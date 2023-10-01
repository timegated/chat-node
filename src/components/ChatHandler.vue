<template>
  <section class="container">
    <PromptComponent />
    <section class="response-container">
      <div class="responses">
        <section :key="index" v-for="(parsed, index) in responses">
          <span class="model">Using model {{ store.model }}.</span>
          <div v-markdown="parsed.text" class="response"></div>
        </section>
      </div>
    </section>
    <section class="generated-prompts">
      <div>
        <span :style="{ fontWeight: 'bold' }"
          >Generate Prompts for topic: {{ store.currentTopicName }}</span
        >
      </div>
      <button class="generate-prompt-btn" @click="sseGeneratePrompts">Generate</button>
      <button
        class="generated-prompt-text"
        v-for="(item, index) in createPromptArray"
        :key="index"
        @click="pushGeneratedPrompt"
      >
        {{ item }}
      </button>
    </section>
  </section>
  <GrowingFieldset
    :value="store.currentPrompt"
    @update:value="store.currentPrompt = $event"
    @stream="sseChatResponse"
  />
</template>

<script lang="ts">
import { store } from '../store/store'
import { BASE_API_URL } from '@/utils/urlHandler'
import GrowingFieldset from '@/components/GrowingFieldset/GrowingFieldset.vue'
import PromptComponent from './Prompts/PromptComponent.vue'

interface Responses {
  text: string
  prompt: string
  topic: string
}

interface Data {
  prompt: string
  generatedPromptText: string
  generatedPrompts: string[]
  role: string
  response: string
  responses: Responses[]
  index: number
  multiple: any
  activeTopic: boolean
  processing: boolean
  store: any
}

export default {
  components: {
    GrowingFieldset,
    PromptComponent
  },
  data(): Data {
    return {
      prompt: '',
      generatedPromptText: '',
      generatedPrompts: [],
      role: '',
      activeTopic: false,
      responses: [{ text: '', prompt: '', topic: '' }],
      index: 0,
      response: '',
      multiple: [],
      processing: true,
      store
    }
  },
  computed: {
    createPromptArray() {
      const listText = this.generatedPromptText.replace(/-/g, '').split('.')
      return listText
    }
  },
  methods: {
    incResponseIndex() {
      this.index++
    },
    pushGeneratedPrompt(e: any) {
      this.store.currentPrompt = e.target.textContent
    },
    async saveResponse(id: number) {
      try {
        const responseToSave = this.responses[id]
        const response = await fetch(`${BASE_API_URL}/user/save-response`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(responseToSave)
        })
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    async sseChatResponse() {
      try {
        const url = `${BASE_API_URL}/${
          store.model.includes('text') ? 'stream' : 'stream/chat'
        }?prompt=${store.currentPrompt}&modelChoice=${store.model}`
        const eventSource = new EventSource(url)

        eventSource.onmessage = (event) => {
          this.responses[this.index].text += event.data;
          this.responses[this.index].prompt = store.currentPrompt
          this.responses[this.index].topic = store.currentTopic
        }

        eventSource.onopen = (event) => {
          console.log('Connection opened', event)
        }

        eventSource.onerror = (event) => {
          console.log('Error occurred', event)
          eventSource.close()
        }

        eventSource.addEventListener('done', (event) => {
          this.incResponseIndex();
          this.responses.push({
            text: '',
            prompt: '',
            topic: ''
          })
          eventSource.close()
        })
      } catch (error: any) {
        throw new Error(error)
      }
    },
    async sseGeneratePrompts() {
      this.generatedPromptText = ""
      try {
        const url = `${BASE_API_URL}/stream/create-prompts?topic=${store.currentTopicName}`
        const eventSource = new EventSource(url)

        eventSource.onmessage = (event) => {
          if (event.data === '') return;
          this.generatedPromptText += event.data
        }

        eventSource.onopen = (event) => {
          console.log('Connection opened', event)
        }

        eventSource.onerror = (event) => {
          console.log('Error occurred', event)
          eventSource.close()
        }

        eventSource.addEventListener('done', (event) => {
          eventSource.close() 
        })
      } catch (error: any) {
        throw new Error(error)
      }
    }
  }
}
</script>

<style>
.model {
  display: flex;
  justify-content: center;
}

.container {
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-gap: 1rem;
  height: 100vh;
}

.input-container {
  width: 100%;
}

.container > .model {
  height: 10px;
}

.response-container {
  max-width: 100%;
  max-height: 100vh;
  padding: 10px;
  height: 85%;
  overflow: scroll;
}

.responses {
  max-width: 55vw;
  overflow: auto;
  padding: 0.75rem;
}

.responses > section {
  margin: 0.75rem 0;
}

.response {
  margin-right: 0.75rem;
}

.prompt-titles {
  font-weight: bold;
  font-size: 18px;
}

.generated-prompts {
  display: flex;
  flex-direction: column;
  overflow: scroll;
}

.generate-prompt-btn {
  width: 30%;
}

.generated-prompt-text {
  margin-top: 0.75rem;
  padding: 1.25rem;
}

.generated-prompt-text {
  background: var(--main-color-darkgreen);
  color: white;
  cursor: pointer;
  border-radius: 8px;
}

@media screen and (max-width: 1600px) {
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .responses {
    margin: auto;
  }
}
</style>
