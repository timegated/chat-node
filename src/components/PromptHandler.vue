<template>
    <section class="container">
      <h1>Using model {{ store.model }}</h1>
      <section v-if="multiple.length" class="multiple-container">
        <div :key="m.index" v-for="m in multiple" class="response">
            <h3>Answer {{ m.index }}</h3>
            {{ m.text }}
        </div>
      </section>
      <section v-else class="response-container">
        <div class="response">
          {{ streamedResponse }}
        </div>
      </section>
        <section class="topic-container">
            Topics:
            <div class="topics">
                <button :key="topicChoice" v-for="topicChoice in topicChoices" @click="setCurrentTopic">
                    {{ topicChoice }}
                </button>
            </div>
        </section>
        <div class="fieldset-container">
            <fieldset>
                <legend>Prompt</legend>
                <input class="prompt-input" v-model.trim="prompt" style="width: 100%" />
            </fieldset>
        </div>
        <div class="btn-container">
            <button @click="getAnswer">Answer</button>
            <button @click="getMultipleAnswers">Multiple Answers</button>
            <button @click="streamResponse">Stream</button>
        </div>
        <div class="text-container">
            <div>
                <h3>Base Prompts</h3>
                <span :key="prompt.prompt" v-for="prompt in getCurrentTopicPrompts" @click="pushPrompt" class="text" draggable="true">
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
</template>

<script lang="ts">
import { store } from '../store/store';
import { BASE_URL_DEV } from '@/utils/urlHandler';


interface Data {
    topicChoices: string[];
    currentTopic: string;
    topics: {
        [key: string]: {
            prompts: {prompt: string, rank: number}[];
            roles: { role: string}[];
        }
    };
    response: ReadableStream;
    streamedResponse: string;
    prompt: string;
    buildPrompt: string[];
    multiple: any;
    store: any;
};

export default {
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
            response: new ReadableStream(),
            streamedResponse: "",
            multiple: [],
            prompt: '',
            buildPrompt: [],
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
        async getAnswer() {
            this.response = await fetch(`${BASE_URL_DEV}/stream?prompt=${this.prompt}&model=${store.model}`, {
                method: "GET",
                headers: {
                  'response-type': 'text/stream'
                }
            }).then(res => {
                if (res.body) {
                    const readable = res.body.getReader();
                    return new ReadableStream({
                        start(controller) {
                            return pump();
                            function pump(): any {
                                return readable.read().then(({ done, value }) => {
                                    if (done) {
                                        controller.close();
                                        return;
                                    }
                                    controller.enqueue(value);
                                    return pump();
                                })
                            }
                        }
                    })
                }
            })
            .then((stream) => new Response(stream).text()) as ReadableStream
        },
        async getMultipleAnswers() {
            this.multiple = await fetch(`${BASE_URL_DEV}/answer/multiple?prompt=${this.prompt}&model=${store.model}`, {
                method: "GET"
            }).then(res => {
                return res.json();
            })
          },
        async streamResponse() {
          try {
            const response = await fetch(`${BASE_URL_DEV}/stream?prompt=${this.prompt}&model=${store.model}`, {
              method: 'GET',
              headers: {
                'response-type': 'text/stream'
              }
            })
            let processing = true;
            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');
              while(processing) {
                const read: any = await reader?.read();
                if (read.done) {
                  break;
                }
                const chunk = decoder.decode(read.value, {stream: true});

                this.streamedResponse += chunk;
              }
          } catch (error: any) {
            throw new Error(error);
          }
        },
        pushPrompt(e: any) {
            console.log(e.target.value);
            this.prompt = e.target.textContent
        },
        pushRole(e: any) {
            console.log(e);
            if (this.prompt !== "") {
                // Roles always prepended
                this.prompt = "";
            }
            this.prompt = `${e.target.textContent} ${this.prompt}`;
        },
        setCurrentTopic (e: any) {
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
  width: 75vw;
  margin: 0 auto;
  overflow: auto;
}

.response-container {
  max-height: 50vh;
  max-width: 100vw;
  margin: 1rem 0;
}

.response {
  height: 45vh;
}
.multiple-container {
  overflow-y: scroll;
  max-height: 50vh;
  max-width: 100vw;
  margin: 1rem 0;
  padding-right: 1rem;
  margin-right: 1rem;
}

.topic-container {
    display: flex;
    align-items: center;
    font-weight: bold;

}

.topics {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 1rem;
}

.topics>button {
    width: 72px;
    margin-right: 0.25rem;
}

.text-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.25rem;
    justify-content: space-around;
    align-items: center;
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

.btn-container {
    max-width: 15%;
    display: flex;
    justify-content: space-between;
    margin: 1.25rem 0;
}

.btn-container>:first-child {
  margin-right: 0.75rem;
}

button {
    background-color: var(--main-bg-color-one);
    color: var(--main-accent-color-light);
    padding: 0.75rem;
    border-radius: 16px;
    outline: none;
    border: 1px solid var(--main-accent-color-light);
}

.response {
    border: 1px solid var(--main-accent-color-light);
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1.25rem;
}
</style>