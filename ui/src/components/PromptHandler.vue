<template>
    <section class="container">
        <div class="response">
            <h3>Response</h3>
            {{ response }}
        </div>
        <h1>{{ name }}</h1>
        <section>
            Topics:
            <div class="topics">
                <button v-for="topicChoice in topicChoices" @click="setCurrentTopic">
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
        </div>
        <div class="text-container">
            <div>
                <span v-for="prompt in getCurrentTopicPrompts" @click="pushPrompt" class="text" draggable="true">
                    {{ prompt.prompt }}
                </span>
            </div>
            <div>
                <span v-for="role in getCurrentRolePrompts" class="text" @click="pushRole" draggable="true">
                    {{ role.role }}
                </span>
            </div>
        </div>
    </section>
</template>

<script lang="ts">

interface Data {
    name: string;
    topicChoices: string[];
    currentTopic: string;
    topics: any
    response: string;
    prompt: string;
    buildPrompt: string[];
};

export default {
    data() {
        return {
            name: 'John',
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
                        { prompt: 'Explain tuples in GO', rank: 0 },
                        { prompt: 'Explain the def keyword in GO', rank: 0 },
                        { prompt: 'Explain range keyword in GO', rank: 0 },
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
            response: "No Answers Yet",
            multiple: [],
            prompt: '',
            buildPrompt: []
        } as Data;
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
            this.response = await fetch(`http://localhost:3002/answer?prompt=${this.prompt}`, {
                method: "GET"
            }).then(res => {
                console.log(res);
                if (res.body) {
                    const readable = res.body.getReader();
                    return new ReadableStream({
                        start(controller) {
                            return pump();
                            function pump(): any {
                                return readable.read().then(({ done, value }) => {
                                    console.log(value);
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
                return "No Response";
            })
                .then(stream => new Response(stream))
                .then(response => response.blob())
                .then(blob => {
                    console.log(blob.text());
                    return blob.text();
                })
        },
        async getMultipleAnswers() {
            this.response = await fetch(`http://localhost:3002/answer/multiple?prompt=${this.prompt}`, {
                method: "GET"
            }).then(res => {
                console.log(res);
                if (res.body) {
                    const readable = res.body.getReader();
                    return new ReadableStream({
                        start(controller) {
                            return pump();
                            function pump(): any {
                                return readable.read().then(({ done, value }) => {
                                    console.log(value);
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
                return "No Response";
            })
                .then(stream => new Response(stream))
                .then(response => response.blob())
                .then(blob => {
                    console.log(blob.text());
                    return blob.text();
                })
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
</script>

<style>
.topics {
    display: flex;
    flex-direction: row;
    align-items: center;
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
}

.text {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border: 1px solid hsl(255deg, 255%, 255%);
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

button {
    background-color: var(--main-bg-color-one);
    color: var(--main-accent-color-light);
    padding: 0.75rem;
    border-radius: 16px;
    outline: none;
    border: 1px solid var(--main-accent-color-light);
}
</style>