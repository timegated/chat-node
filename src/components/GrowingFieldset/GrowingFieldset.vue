<template>
  <div class="fieldset-container">
    <fieldset :style="{ height: fieldsetHeight }">
      <legend>Prompt</legend>
      <textarea :prompt="prompt" :value="value" @input="onInputValue" ref="textarea"></textarea>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'GrowingFieldset',
  props: {
    value: String,
    prompt: String
  },
  emits: ['update:value', 'update:prompt'],
  setup(props, { emit }) {
    const text = ref(props.value || '');
    const fieldsetHeight = ref('auto');

    const updateFieldsetHeight = () => {
      fieldsetHeight.value = `${textareaRef?.value?.scrollHeight ?? 100}px`;
    }

    const textareaRef = ref<any>(null);

    const onInputValue = (event: any): void => {
      const target = event.target as HTMLTextAreaElement;
      text.value = target.value;
      if (!props.value) {
        emit('update:prompt', text.value)
      }
      emit('update:value', text.value);
    }

    watch(() => props.value, (newValue) => {
      if (newValue !== text.value) {
        text.value = newValue || '';
        updateFieldsetHeight();
      }
    });

    return { text, fieldsetHeight, onInputValue, textareaRef };
  }
});
</script>

<style>
.fieldset-container {
  margin: 1.25rem 0;
}

fieldset {
  display: flex;
  align-items: center;
  border-radius: 16px;
  border-color: var(--main-accent-color-light);
  margin: auto;
  max-width: 50vw;
  resize: none;
}

textarea {
  width: 100%;
  border: 1px solid #ccc;
  padding: 5px;
  font-size: 16px;
  line-height: 1.4;
  font-family: inherit;
  border-radius: 8px
}
</style>