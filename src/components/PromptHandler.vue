<template>
  <section class="container">
    <section class="topic-container">
      <div class="topics">
        <span class="topic-title">Topics:</span>
        <button :key="topicChoice" v-for="topicChoice in topicChoices" @click="setCurrentTopic">
          {{ topicChoice }}
        </button>
      </div>
      <div class="text-container">
        <div>
          <h3>Base Prompts</h3>
          <span :key="prompt.prompt" v-for="prompt in getCurrentTopicPrompts" @click="pushPrompt" class="text"
            draggable="true">
            {{ prompt.prompt }}
          </span>
        </div>
        <div>
          <h3>Roles</h3>
          <span :key="role.role" v-for="role in getCurrentRolePrompts" class="text" @click="pushRole" draggable="true">
            {{ role.role }}
          </span>
        </div>
      </div>
    </section>
    <section class="response-container">
      <div class="responses">
        <section :key="response" v-for="response in responses">
          <span class="model">Using model {{ store.model }}. With Prompt: {{ response.prompt }}</span>
          <div class="response">
            {{ response.text.replace('undefined', '') }}
          </div>
        </section>
      </div>
      <div class="fieldset-container">
        <GrowingFieldset :value="prompt" @update="prompt = $event"></GrowingFieldset>
      </div>
      <div class="btn-container">
        <!-- <button @click="getMultipleAnswers">Multiple Answers</button> -->
        <button class="cta" @click="streamResponse">Get Answer</button>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { store } from '../store/store';
import { BASE_URL_DEV } from '@/utils/urlHandler';
import GrowingFieldset from '@/components/GrowingFieldset/GrowingFieldset.vue'

interface Data {
  topicChoices: string[];
  currentTopic: string;
  topics: {
    [key: string]: {
      prompts: { prompt: string, rank: number }[];
      roles: { role: string }[];
    }
  };
  response: string;
  responses: any[];
  index: number;
  prompt: string;
  multiple: any;
  store: any;
};

export default {
  components: {
    GrowingFieldset
  },
  data(): Data {
    return {
      topicChoices: ['sql', 'http', 'js', 'python', 'go'],
      currentTopic: '',
      topics: {
        sql: {
          prompts: [
            { prompt: 'Explain SQL', rank: 0 },
            { prompt: 'Explain INNER JOIN', rank: 0 },
            { prompt: 'Explain what a Join is', rank: 0 },
            { prompt: 'Explain what different versions of SQL exist', rank: 0 },
          ],
          roles: [
            {
              role: 'Assume the role of a database administrator'
            },
            {
              role: 'Take on the role of a SQL expert'
            },
            {
              role: 'You are a very knowledgeable user of SQL'
            },
            {
              role: 'You are an amazing SQL developer'
            }
          ],
        },
        js: {
          prompts: [
            { prompt: 'Explain Javascript', rank: 0 },
            { prompt: 'Explain optional chaining in Javascript', rank: 0 },
            { prompt: 'Explain first class functions in JS', rank: 0 },
            { prompt: 'Explain prototypal inheritance', rank: 0 },
          ],
          roles: [
            {
              role: 'Assume the role of an experienced JS developer'
            },
            {
              role: 'Take on the role of a Javascript developer'
            },
            {
              role: 'You are very knowledgeable about Javascript'
            },
            {
              role: 'You are a very highly paid Javascript developer'
            }
          ],
        },
        python: {
          prompts: [
            { prompt: 'Explain Python', rank: 0 },
            { prompt: 'Explain tuples in Python', rank: 0 },
            { prompt: 'Explain the def keyword in Python', rank: 0 },
            { prompt: 'Explain range keyword in Python', rank: 0 },
          ],
          roles: [
            {
              role: 'Assume the role of an experienced Python developer'
            },
            {
              role: 'Take on the role of a Python developer'
            },
            {
              role: 'You are very knowledgeable about Python'
            },
            {
              role: 'You are a very highly paid Python developer'
            }
          ],
        },
        go: {
          prompts: [
            { prompt: 'Explain GO', rank: 0 },
            { prompt: 'Explain multiplexing in GO', rank: 0 },
            { prompt: 'Explain concurrency in GO', rank: 0 },
            { prompt: 'Explain immediate assignment in GO', rank: 0 },
          ],
          roles: [
            {
              role: 'Assume the role of an experienced GO developer'
            },
            {
              role: 'Take on the role of a GO developer'
            },
            {
              role: 'You are very knowledgeable about GO'
            },
            {
              role: 'You are a very highly paid GO developer'
            }
          ],
        },
        http: {
          prompts: [
            { prompt: 'Explain HTTP', rank: 0 },
            { prompt: 'Explain request methods in HTTP', rank: 0 },
            { prompt: 'Explain error codes in HTTP', rank: 0 },
            { prompt: 'Explain status codes in HTTP', rank: 0 },
          ],
          roles: [
            {
              role: 'Assume the role of a developer who knows HTTP'
            },
            {
              role: 'You have expert knowledge of the HTTP protocol'
            },
            {
              role: 'You are very knowledgeable about HTTP'
            },
            {
              role: 'You know the difference between HTTP and HTTPS'
            }
          ],
        },
      },
      responses: [{text: "", prompt: ""}],
      index: 0,
      response: "",
      multiple: [],
      prompt: ' ',
      store
    }
  },
  computed: {
    getCurrentTopicPrompts() {
      const currentTopic = this.currentTopic === '' ? 'sql' : this.currentTopic;
      return this.topics[currentTopic].prompts
    },
    getCurrentRolePrompts() {
      const currentTopic = this.currentTopic === "" ? 'sql' : this.currentTopic;
      return this.topics[currentTopic].roles;
    }
  },
  methods: {
    async getMultipleAnswers() {
      this.multiple = await fetch(`${BASE_URL_DEV}/answer/multiple?prompt=${this.prompt}&model=${store.model}`, {
        method: "GET"
      }).then(res => {
        return res.json();
      })
    },
    incResponseIndex() {
      this.index++;
    },
    async streamResponse() {
      try {
        const response = await fetch(`${BASE_URL_DEV}/stream?prompt=${this.prompt}&model=${store.model}`, {
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
    pushPrompt(e: any) {
      this.prompt = e.target.textContent;
    },
    pushRole(e: any) {
      console.log(e);
      if (this.prompt !== "") {
        // Roles always prepended
      }
      this.prompt = `${e.target.textContent}`;
    },
    setCurrentTopic(e: any) {
      this.currentTopic = e.target.textContent;
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
  font-weight: bold;
  flex-direction: column;
  justify-content: center;
}

.container>.model {
  height: 10px;
}

.response-container {
  max-width: 100vw;
  padding: 10px;
}

.responses {
  height: 30vw;
  max-width: 75vw;
  margin: auto;
  overflow: auto;
  border: 1px solid var(--main-accent-color-light);
  border-radius: 8px;
  padding: 0.75rem;
}

.response > section {
  max-width: 75vw;
}
.response {
  margin-right: 0.75rem;
  height: 20vh;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 0.25rem;
  align-items: center;
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

.fieldset-container {
  margin: 1.25rem 0;
}

fieldset {
  display: flex;
  align-items: center;
  height: 75px;
  border-radius: 16px;
  border-color: var(--main-accent-color-light);
  margin-right: 1rem;
}

input {
  font-size: 18px;
  padding: 0.25rem;
  border-radius: 8px;
  border: none;
}

@media screen and (max-width: 1600px) {
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

}
</style>