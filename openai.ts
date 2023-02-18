import {Configuration, CreateCompletionResponse, OpenAIApi, OpenAIFile} from 'openai';
require("dotenv").config();

const config = new Configuration({
  apiKey: process.env.GPT_SECRET,
});
const api = new OpenAIApi(config);

// Insert before what a user types if they select this option.
const promptPrepend = [
    {
      type: "WHAT",
      prepend: "What is a",
    },
    {
      type: "ROLE",
      prepend: "Assume the role of a",
    },
    {
      type: "EXP",
      explain: "Explain",
    },
  ];

export async function promptResponse(promptText: string, promptChoice: number, model: string) {
    try {
        const completion = await api.createCompletion({
          model: model,
          prompt: `${promptPrepend[promptChoice].prepend} ${promptText}`,
          max_tokens: 4000,
          n: 10
        });
        console.log(completion.data.choices);
        return completion.data.choices[0].text;
      } catch (error: any) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
}

export const extractLines = (data: Buffer) =>
  data
    .toString()
    .split("\n")
    .filter((line: string) => line.trim() !== "");

export const parseStreamData = (data: Buffer) => {
    const lines = extractLines(data);
    for (const line of lines) {
      const message = line.replace(/^data: /, "");
      if (message === "[DONE]") {
        return; // Stream finished
      }
      try {
        const parsed = JSON.parse(message);
        return parsed.choices[0].text;
      } catch (error) {
        console.error("Could not JSON parse stream message", message, error);
      }
    }
}

export async function promptResponseStream(prompt: string, prefixChoice: number, model: string) {
  try {
    const res = await api.createCompletion(
      {
        model: model,
        prompt: `${promptPrepend[prefixChoice].prepend} ${prompt}`,
        max_tokens: 4000,
        temperature: 0,
        stream: true,
      },
      { responseType: "stream" }
    );

    const result = res.data.on("data", (data: Buffer) => parseStreamData(data));
    return result;
  } catch (error: any) {
    if (error.response?.status) {
      error.response.data.on("data", (data: Buffer) => {
        const message = data.toString();
        try {
          const parsed = JSON.parse(message);
          console.error("An error occurred during OpenAI request: ", parsed);
        } catch (error) {
          console.error("An error occurred during OpenAI request: ", message);
        }
      });
    } else {
      console.error("An error occurred during OpenAI request", error);
    }
    throw error;
  }
}
