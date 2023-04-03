<template>
  <section class="container">
      <PromptComponent />
      <section class="response-container">
      <div class="responses">
        <section :key="parsed.text" v-for="parsed in parseMarkdown">
          <GrowingFieldset :value="parsed.prompt" @update:value="store.currentPrompt = $event"
        @stream="streamChatResponse" />
          <span class="model">Using model {{ store.model }}.</span>
          <div v-html="parsed.text" class="response"></div>
        </section>
      </div>
    </section>
    <section :style="{border: '1px solid black', width: '250px', height: '250px'}">

    </section>
  </section>
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
}

interface Data {
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
    GrowingFieldset,
    PromptComponent
  },
  data(): Data {
    return {
      prompt: '',
      compiledPrompt: '',
      role: '',
      activeTopic: false,
      responses: [{ text: '', prompt: ''}],
      index: 0,
      response: '',
      multiple: [],
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
    }
  },
  methods: {
    incResponseIndex() {
      this.index++
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
          this.responses[this.index].text += chunk
          this.responses[this.index].prompt = store.currentPrompt
        }
        this.incResponseIndex()
        this.responses.push({
          text: '',
          prompt: ''
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

  .text-container {
    display: flex;
    flex-direction: column;
    display: none;
  }
}
</style>
