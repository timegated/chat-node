import { reactive } from "vue";

interface Topics {
  topicid: string;
  topicname: string;
  active: boolean;
}

interface Prompts {
  prompttext: string;
}
export interface GlobalData {
  model:  string;
  topics: Topics[],
  prompts: Prompts[],
  currentPrompt: string;
  currentTopic: string;
  currentTopicName: string;
}

export const store: GlobalData = reactive({
  model: 'text-davinci-003',
  topics: [] as Topics[],
  prompts: [] as Prompts[],
  currentPrompt: '',
  currentTopic: '',
  currentTopicName: ''
});
