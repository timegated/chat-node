<template>
  <section class="container">
    <section class="topic-container">
      <div class="topics">
        <span class="topic-title">Topics:</span>
        <button
          :key="topicChoice"
          :class="{ isActive: topicChoice === currentTopic }"
          v-for="topicChoice in topicChoices"
          @click="pushTopic"
        >
          {{ topicChoice }}
        </button>
      </div>
      <div class="text-container">
        <span class="prompt-titles">Base Prompts</span>
        <div>
          <span
            :key="p.prompt"
            :class="{ isActive: p.prompt === compiledPrompt }"
            v-for="p in getCurrentTopicPrompts"
            @click="pushPrompt"
            class="text"
          >
            {{ p.prompt }}
          </span>
        </div>
        <span class="prompt-titles">Roles</span>
        <div>
          <span
            :key="r.role"
            :class="{ isActive: r.role === role }"
            v-for="r in getCurrentRolePrompts"
            class="text"
            @click="pushRole"
            draggable="true"
          >
            {{ r.role }}
          </span>
        </div>
      </div>
      <section class="input-container">
      <GrowingFieldset :value="prompt" @update:value="prompt = $event"></GrowingFieldset>
      <div class="btn-container">
        <button class="cta" @click="streamChatResponse">Get Answer</button>
      </div>
    </section>
    </section>
    <section class="response-container">
      <div class="responses">
        <section :key="parsed.text" v-for="parsed in parseMarkdown">
          <span class="model">Using model {{ store.model }}. With Prompt: {{ parsed.prompt }}</span>
          <div v-html="parsed.text" class="response"></div>
        </section>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { store } from '../store/store'
import { BASE_API_URL } from '@/utils/urlHandler'
import GrowingFieldset from '@/components/GrowingFieldset/GrowingFieldset.vue'
import { buildSentence } from '../utils/promptBuilder/promptBuilder'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import hljs from 'highlightjs'

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
}

interface Data {
  topicChoices: string[]
  currentTopic: string
  prompt: string
  compiledPrompt: string
  role: string
  response: string
  responses: Responses[]
  index: number
  multiple: any
  store: any
  activeTopic: boolean
}

export default {
  components: {
    GrowingFieldset
  },
  data(): Data {
    return {
      topicChoices: ['sql', 'http', 'js', 'python', 'go'],
      currentTopic: '',
      prompt: '',
      compiledPrompt: '',
      role: '',
      activeTopic: false,
      responses: [{ text: '', prompt: '' }],
      index: 0,
      response: '',
      multiple: [],
      store
    }
  },
  computed: {
    getCurrentTopicPrompts() {
      const currentTopic = this.currentTopic === '' ? 'sql' : this.currentTopic
      return store.topics[currentTopic].prompts
    },
    getCurrentRolePrompts() {
      const currentTopic = this.currentTopic === '' ? 'sql' : this.currentTopic
      return store.topics[currentTopic].roles
    },
    parseMarkdown() {
      return this.responses.map((response) => {
        return {
          ...response,
          text: DOMPurify.sanitize(marked(response.text, { renderer }))
        }
      })
    },
    parseCompiledPrompt() {
      let words = this.compiledPrompt.split(' ')
      return words
        .map((word, index) => {
          if (index === 0) {
            return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
          }
          return word.toLowerCase()
        })
        .join(' ')
    }
  },
  methods: {
    incResponseIndex() {
      this.index++
    },
    async streamChatResponse() {
      try {
        const response = await fetch(
          `${BASE_API_URL}/stream/chat?prompt=${this.prompt}&model=${store.model}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'text/stream',
            }
          }
        )
        let processing = true
        const reader = response.body?.getReader()
        const decoder = new TextDecoder('utf-8')
        while (processing) {
          const read: any = await reader?.read()
          if (read.done) {
            processing = false
            break
          }
          const chunk = decoder.decode(read.value, { stream: true })
          console.log(chunk)
          this.responses[this.index].text += chunk
          this.responses[this.index].prompt = this.prompt
        }
        this.incResponseIndex()
        this.responses.push({
          text: '',
          prompt: ''
        })
      } catch (error: any) {
        throw new Error(error)
      }
    },
    pushPrompt(e: any) {
      this.compiledPrompt = e.target.textContent;
    },
    pushRole(e: any) {
      this.role = e.target.textContent;
    },
    pushTopic(e: any) {
      this.currentTopic = e.target.textContent;
      this.prompt = ''
      this.role = ''
    },
    buildPrompt() {
      this.prompt = buildSentence(this.currentTopic, this.compiledPrompt, this.role)
    },
    checkValues() {
      const currentPrompt = this.compiledPrompt !== ''
      const currentRole = this.role !== ''
      const currentTopic = this.currentTopic !== ''
      if (currentPrompt && currentRole && currentTopic) {
        this.buildPrompt()
      }
    }
  },
  watch: {
    compiledPrompt: {
      immediate: true,
      handler() {
        this.checkValues()
      }
    },
    role: {
      immediate: true,
      handler() {
        this.checkValues()
      }
    },
    currentTopic: {
      immediate: true,
      handler() {
        this.checkValues()
      }
    }
  }
}
</script>

<style>
.container {
  height: 100vh;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 10px;
}

.input-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.topic-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-direction: column;
  margin-top: 0.5rem;
}

.container > .model {
  height: 10px;
}

.response-container {
  max-width: 100vw;
  padding: 10px;
  height: 100%;
}

.responses {
  height: 35vw;
  max-width: 50vw;
  overflow: auto;
  padding: 0.75rem;
}

.responses > section {
  margin: 0.75rem 0;
}

.response {
  margin-right: 0.75rem;
}

.multiple-container {
  overflow-y: scroll;
  max-height: 50vh;
  max-width: 100vw;
  margin: 1rem 0;
  padding-right: 1rem;
  margin-right: 1rem;
}

.topics {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2rem;
}

.topic-title {
  font-weight: bold;
  font-size: 18px;
  margin-right: 1rem;
}

.topics > button {
  width: 72px;
  padding: 0.25rem;
  margin-right: 0.25rem;
}

.text-container > div {
  display: grid;
  grid-template-columns: 1fr;
}

.text-container > div > span:hover {
  cursor: pointer;
  background-color: var(--main-green-one);
  transition: background-color 0.25s ease;
  color: #ffffff;
}

.text {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  /* border: 1px solid var(--main-accent-color-light); */
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 8px;
  margin-top: 10px;
  padding: 10px;
}

.isActive {
  background-color: var(--main-green-one);
  color: #ffffff;
}

button.cta {
  width: 15vw;
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
    max-width: 55vw;
    margin: auto;
  }

  .text-container {
    display: flex;
    flex-direction: column;
    display: none;
  }
}
</style>
