<template>
    <h1>PromptHandler</h1>
    <h1 class="user-title">{{ name }}</h1>
    <section class="prompt-container">
            <span :v-for="prompt in prompts" class="prompts" draggable="true">
                {{ prompt.prompt }}
            </span>
    </section>
</template>

<script lang="ts">

interface Data {
    name: string;
    prompts: { prompt: string}[]
};

export default {
    data() {
        return {
                name: 'John',
                prompts: [
                    {prompt: 'Explain SQL'},
                    {prompt: 'Write a SQL query with at least three JOINS'},
                    {prompt: 'Explain what a Join is'}
                ]
            } as Data;
    },
    computed: {
        getPrompts() {
            return !this.prompts.length ? [{prompt: 'No Prompts Here'}] : this.prompts;
        },
        mapOverPrompts() {
            return this.getPrompts.map((prompt) => prompt.prompt).join(' ');
        }
    }
}
</script>

<style>
.user-title {
    width: 20%;
}
.prompt-container {
    display: flex;
    flex-direction: column;
    max-width: 50%;
}

.prompts {
    border: 1px solid hsl(255deg, 255%, 255%);
}
</style>