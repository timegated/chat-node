<template>
  <section class="container">
    <section class="topic-container">
      <div class="topics">
        <span class="topic-title">Topics:</span>
        <button :key="topicChoice" :class="{'isActive': topicChoice === currentTopic}" v-for="topicChoice in topicChoices" @click="pushTopic">
          {{ topicChoice }}
        </button>
      </div>
      <div class="text-container">
        <div>
          <span class="prompt-titles">Base Prompts</span>
          <span :key="p.prompt" :class="{'isActive': p.prompt === prompt}" v-for="p in getCurrentTopicPrompts" @click="pushPrompt" class="text">
            {{ p.prompt }}
          </span>
        </div>
        <div>
          <span class="prompt-titles">Roles</span>
          <span :key="r.role" :class="{'isActive': r.role === role}" v-for="r in getCurrentRolePrompts" class="text" @click="pushRole" draggable="true">
            {{ r.role }}
          </span>
        </div>
      </div>
    </section>
    <section class="response-container">
      <div class="responses">
        <section :key="response.text" v-for="response in responses">
          <span class="model">Using model {{ store.model }}. With Prompt: {{ response.prompt }}</span>
          <div class="response">
            {{ response.text.replace('undefined', '') }}
          </div>
        </section>
      </div>
        <GrowingFieldset :prompt="prompt" :value="compiledPrompt" @update:value="compiledPrompt = $event"
          @update:prompt="prompt = $event"></GrowingFieldset>
      <div class="btn-container">
        <!-- <button @click="getMultipleAnswers">Multiple Answers</button> -->
        <button class="cta" @click="streamChatResponse">Get Answer</button>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { store } from '../store/store';
import { BASE_URL_DEV } from '@/utils/urlHandler';
import GrowingFieldset from '@/components/GrowingFieldset/GrowingFieldset.vue'
import { buildSentence } from '../utils/promptBuilder/promptBuilder';

interface Responses {
  text: string,
  prompt: string,
}

interface Data {
  topicChoices: string[];
  currentTopic: string;
  prompt: string;
  compiledPrompt: string;
  role: string;
  response: string;
  responses: Responses[];
  index: number;
  multiple: any;
  store: any;
  activeTopic: boolean;
};

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
      responses: [{ text: "", prompt: "" }],
      index: 0,
      response: "",
      multiple: [],
      store
    }
  },
  computed: {
    getCurrentTopicPrompts() {
      const currentTopic = this.currentTopic === '' ? 'sql' : this.currentTopic;
      return store.topics[currentTopic].prompts
    },
    getCurrentRolePrompts() {
      const currentTopic = this.currentTopic === "" ? 'sql' : this.currentTopic;
      return store.topics[currentTopic].roles;
    }
  },
  methods: {
    incResponseIndex() {
      this.index++;
    },
    async streamResponse() {
      try {
        const response = await fetch(`${BASE_URL_DEV}/stream?prompt=${this.compiledPrompt === '' ? this.prompt : this.compiledPrompt}&model=${store.model}`, {
          method: 'GET',
          headers: {
            'response-type': 'text/stream'
          }
        });
        let processing = true;
        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');
        while (processing) {
          const read: any = await reader?.read();
          if (read.done) {
            processing = false;
            break;
          }
          const chunk = decoder.decode(read.value, { stream: true });
          this.responses[this.index].text += chunk ? chunk : "";
          this.responses[this.index].prompt = this.prompt;
        }

        this.incResponseIndex();
        this.responses.push({
          text: "",
          prompt: ""
        })
      } catch (error: any) {
        throw new Error(error);
      }
    },
    async streamChatResponse() {
      try {
        const response = await fetch(`${BASE_URL_DEV}/stream/chat?prompt=${this.compiledPrompt === '' ? this.prompt : this.compiledPrompt}&model=${store.model}`, {
          method: 'GET',
          headers: {
            'response-type': 'text/stream'
          }
        });
        let processing = true;
        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');
        while (processing) {
          const read: any = await reader?.read();
          if (read.done) {
            processing = false;
            break;
          }
          const chunk = decoder.decode(read.value, { stream: true });
          this.responses[this.index].text += chunk ? chunk : "";
          this.responses[this.index].prompt = this.compiledPrompt === '' ? this.prompt : this.compiledPrompt;
        }
        this.incResponseIndex();
        this.responses.push({
          text: "",
          prompt: ""
        });
      } catch (error: any) {
        throw new Error(error);
      }
    },
    pushPrompt(e: any) {
      this.prompt = e.target.textContent;
    },
    pushRole(e: any) {
      this.role = e.target.textContent;
    },
    pushTopic(e: any) {
      this.currentTopic = e.target.textContent;
      this.prompt = '';
      this.role = '';
    },
    buildPrompt() {
      this.compiledPrompt = buildSentence(this.currentTopic, this.prompt, this.role);
    },
    checkValues() {
      const currentPrompt = this.prompt !== '';
      const currentRole = this.role !== '';
      const currentTopic = this.currentTopic !== '';
      if (currentPrompt && currentRole && currentTopic) {
        this.buildPrompt();
      }
    }
  },
  watch: {
    prompt: {
      immediate: true,
      handler() {
        this.checkValues();
      }
    },
    role: {
      immediate: true,
      handler() {
        this.checkValues();
      }
    },
    currentTopic: {
      immediate: true,
      handler() {
        this.checkValues();
      }
    }
  }
}
// TODO Use composition to break this up
// TODO text parsing for code and text formatting
// TODO prompt templating -- set up guard rails
</script>

<style>
.container {
  height: 100vh;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 10px;
}

.topic-container {
  display: flex;
  align-items: center;
  justify-content: start;
  font-weight: bold;
  flex-direction: column;
  margin-top: 0.50rem;
}

.container>.model {
  height: 10px;
}

.response-container {
  max-width: 100vw;
  padding: 10px;
}

.responses {
  height: 35vw;
  max-width: 50vw;
  margin: auto;
  overflow: auto;
  border: 1px solid var(--main-accent-color-light);
  border-radius: 8px;
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

.topics>button {
  width: 72px;
  padding: 0.25rem;
  margin-right: 0.25rem;
}

.text-container {
  white-space: nowrap;
}

.text-container>div>span:hover {
  cursor: pointer;
  background-color: var(--main-green-one);
  transition: background-color 0.25s ease;
  color: #FFFFFF;
}

.text {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid var(--main-accent-color-light);
  border-radius: 8px;
  margin-top: 10px;
  padding: 10px;
  height: 36px;
}

.isActive {
  background-color: var(--main-green-one);
  color: #FFFFFF;
}

button.cta {
  width: 50vw;
  margin: auto;
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

}
</style>