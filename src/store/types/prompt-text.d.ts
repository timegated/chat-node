export interface PromptText {
  [key: string]: {
    prompts: Array<{ prompt: string }>,
    roles: Array<{ role: string }>
  };
}