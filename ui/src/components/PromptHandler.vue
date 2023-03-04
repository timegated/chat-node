<template>
    <h1>{{ name }}</h1>
    <div>TOPIC: <span>SQL</span></div>
    <div class="text-container">
        <div>
            <span v-for="prompt in prompts" @click="pushPrompt" class="text" draggable="true">
                {{ prompt.prompt }}
            </span>
        </div>
        <div>
            <span v-for="role in roles" class="text" @click="pushRole" draggable="true">
                {{ role.role }}
            </span>
        </div>
    </div>
    <div class="fieldset-container">
        <fieldset>
            <legend>Prompt</legend>
            <input class="prompt-input" v-model.trim="prompt" style="width: 100%">
        </fieldset>
    </div>
    <div>Message is: {{ prompt }}</div>
    <button @click="getResponse">Send</button>
    <div class="response">
        {{ response }}
    </div>
</template>

<script lang="ts">

interface Data {
    name: string;
    prompts: { prompt: string, rank: number }[];
    roles: {role: string}[];
    response: string;
    prompt: string;
    buildPrompt: string[];
};

export default {
    data() {
        return {
            name: 'John',
            prompts: [
                { prompt: 'Explain SQL', rank: 0 },
                { prompt: 'Explain INNER JOIN', rank: 0 },
                { prompt: 'Explain what a Join is', rank: 0 }
            ],
            roles: [
                {
                    role: 'Assume the role of a '
                }, 
                {
                    role: 'Take on the role of a '
                },
                {
                    role: 'You are a '
                },
                {
                    role: 'You are an '
                }
            ],
            response: "No Answers Yet",
            multiple: [],
            prompt: '',
            buildPrompt: []
        } as Data;
    },
    computed: {
        getPrompts() {
            return !this.prompts.length ? [{ prompt: 'No Prompts Here' }] : this.prompts;
        },
        mapOverPrompts() {
            return this.getPrompts.map((prompt) => prompt.prompt).join(' ');
        }
    },
    methods: {
        async getResponse() {
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
                                return readable.read().then(({done, value}) => {
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
            .then(blob => blob.text())
        },
        pushPrompt(e: any) {
            console.log(e.target.value);
            this.prompt = e.target.textContent
        },
        pushRole(r: any) {
            console.log(r);
        }
    }
}
</script>

<style>
.text-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
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

.text-container {
    display: flex;
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
}
</style>