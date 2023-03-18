<template>
  <fieldset :style="{ height: fieldsetHeight }">
    <legend>Prompt</legend>
    <textarea :value="value" @input="onInput" ref="textarea"></textarea>
  </fieldset>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'GrowingFieldset',
  props: {
    value: String,
    promptValue: String
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const text = ref(props.value || '');
    const fieldsetHeight = ref('auto');

    const updateFieldsetHeight = () => {
      fieldsetHeight.value = `${textareaRef?.value?.scrollHeight ?? 100}px`;
    }

    const textareaRef = ref<any>(null);

    const onInput = (event: any): void => {
      const target = event.target as HTMLTextAreaElement;
      text.value = target.value;
      emit('update:value', text.value);
    }

    watch(() => props.value, (newValue) => {
      if (newValue !== text.value) {
        text.value = newValue || '';
        updateFieldsetHeight();
      }
    });

    return { text, fieldsetHeight, onInput, textareaRef };
  }
});
</script>

<style>
  textarea {
    width: 100%;
    border: 1px solid #ccc;
    padding: 5px;
    font-size: 16px;
    line-height: 1.4;
    font-family: inherit;
  }
</style>