<template>
  <section class="container">
      <PromptComponent />
      <section class="response-container">
      <div class="responses">
        <section :key="index" v-for="parsed, index in parseMarkdown">
          <span class="model">Using model {{ store.model }}.</span>
          <div v-html="parsed.text" class="response"></div>
          <div>
            <button v-if="!processing" @click="saveResponse(index)">Save</button>
          </div>
        </section>
      </div>
    </section>
    <section>
      Prompts
      <button @click="generatePrompts">Generate Prompts</button>
      <div v-html="parseGeneratedPrompts"></div>
    </section>
  </section>
  <GrowingFieldset :value="store.currentPrompt" @update:value="store.currentPrompt = $event"
  @stream="streamChatResponse" />
</template>

<script lang="ts">
import { store } from '../store/store'
import { BASE_API_URL } from '@/utils/urlHandler'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import hljs from 'highlightjs'
import GrowingFieldset from '@/components/GrowingFieldset/GrowingFieldset.vue';
import PromptComponent from './Prompts/PromptComponent.vue'

const renderer = new marked.Renderer()
marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  },
  async: true
})

interface Responses {
  text: string
  prompt: string
  topic: string
}

interface Data {
  prompt: string
  generatedPrompts: string
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
      generatedPrompts: '',
      role: '',
      activeTopic: false,
      responses: [{ text: '', prompt: '', topic: ''}],
      index: 0,
      response: '',
      multiple: [],
      processing: true,
      store
    }
  },
  computed: {
    parseMarkdown() {
      return this.responses.map((response, index: number) => {
        if (index === this.index) {
          return {
            ...response,
            prompt: store.currentPrompt,
            text: DOMPurify.sanitize(marked(response.text, { renderer }))
          }
        }
        return response;
      })
    },
    parseGeneratedPrompts () {
      return DOMPurify.sanitize(marked(this.generatedPrompts, { renderer }))
    }
  },
  methods: {
    incResponseIndex() {
      this.index++
    },
    async saveResponse (id: number) {
      console.log(id);
      try {
        const responseToSave = this.responses[id];
        console.log(responseToSave);
        const response = await fetch(`${BASE_API_URL}/user/save-response`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(responseToSave)
        });
        console.log(response);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async streamChatResponse() {
      try {
        const response = await fetch(
          `${BASE_API_URL}/stream/chat?prompt=${store.currentPrompt}&model=${store.model}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'text/stream',
            }
          }
        )
        const reader = response.body?.getReader()
        const decoder = new TextDecoder('utf-8')
        while (this.processing) {
          const read: any = await reader?.read()
          if (read.done) {
            this.processing = false
            break
          }
          const chunk = decoder.decode(read.value, { stream: true })
          this.responses[this.index].text += chunk
          this.responses[this.index].prompt = store.currentPrompt
          this.responses[this.index].topic = store.currentTopic;
        }
        this.incResponseIndex()
        this.responses.push({
          text: '',
          prompt: '',
          topic: ''
        })
      } catch (error: any) {
        throw new Error(error)
      }
    },
    async generatePrompts() {
      try {
        if (this.generatedPrompts.length > 0) this.generatedPrompts = '';
        const response = await fetch(
          `${BASE_API_URL}/stream/create-prompts?topic=${store.currentTopicName}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'text/stream',
            }
          }
        )
        const reader = response.body?.getReader()
        const decoder = new TextDecoder('utf-8')
        while (this.processing) {
          const read: any = await reader?.read()
          if (read.done) {
            this.processing = false
            break
          }
          const chunk = decoder.decode(read.value, { stream: true })
          this.generatedPrompts += chunk;
        }
        this.incResponseIndex()
        this.responses.push({
          text: '',
          prompt: '',
          topic: ''
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
}

.input-container {
  width: 100%;
}

.container>.model {
  height: 10px;
}

.response-container {
  max-width: 100%;
  max-height: 100vh;
  padding: 10px;
  height: 100%;
  overflow: scroll;
}

.responses {
  max-width: 55vw;
  overflow: auto;
  padding: 0.75rem;
}

.responses>section {
  margin: 0.75rem 0;
}

.response {
  margin-right: 0.75rem;
}

.prompt-titles {
  font-weight: bold;
  font-size: 18px;
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
