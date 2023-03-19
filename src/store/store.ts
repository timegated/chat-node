import { reactive } from "vue";
import { topics } from "@/utils/promptBuilder/promptBuilder";
import type { PromptText } from './types/prompt-text';

export interface GlobalData {
  model:  string;
  topics: PromptText
}

export const store: GlobalData = reactive({
  model: 'text-davinci-003',
  topics,
  setModelParam(e: any) {
    this.model = e.target.parentElement.childNodes[0].childNodes[0].textContent;
  }
});
