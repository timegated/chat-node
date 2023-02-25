<template>
    <h1>{{ name }}</h1>
    <span v-for="prompt in prompts" class="prompts" draggable="true">
        {{ prompt.prompt }}
    </span>
</template>

<script lang="ts">

interface Data {
    name: string;
    prompts: { prompt: string }[]
};

export default {
    data() {
        return {
            name: 'John',
            prompts: [
                { prompt: 'Explain SQL' },
                { prompt: 'Explain INNER JOIN' },
                { prompt: 'Explain what a Join is' }
            ]
        } as Data;
    },
    computed: {
        getPrompts() {
            return !this.prompts.length ? [{ prompt: 'No Prompts Here' }] : this.prompts;
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
    justify-content: space-between;
    align-items: center;
    max-width: 50%;
}

.prompts {
    display: flex;
    border: 1px solid hsl(255deg, 255%, 255%);
    border-radius: 8px;
    margin-top: 10px;
    padding: 10px;
}
</style>