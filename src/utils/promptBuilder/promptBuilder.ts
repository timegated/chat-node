import type { PromptText } from '../../store/types/prompt-text';

export const topics: PromptText = {
  sql: {
    prompts: [
      { prompt: 'Explain SQL' },
      { prompt: 'Explain INNER JOIN' },
      { prompt: 'Explain what a Join is' },
      { prompt: 'Explain what different versions of SQL exist' },
    ],
    roles: [
      {
        role: 'Assume the role of a database administrator'
      },
      {
        role: 'Take on the role of a SQL expert'
      },
      {
        role: 'As a SQL expert with many years of experience using MSSQL'
      },
      {
        role: 'As an above average SQL developer with unusual amounts of knowledge'
      }
    ],
  },
  js: {
    prompts: [
      { prompt: 'Explain Javascript' },
      { prompt: 'Explain optional chaining in Javascript' },
      { prompt: 'Explain first class functions in JS' },
      { prompt: 'Explain prototypal inheritance' },
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
      { prompt: 'Explain Python' },
      { prompt: 'Explain tuples in Python' },
      { prompt: 'Explain the def keyword in Python' },
      { prompt: 'Explain range keyword in Python' },
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
      { prompt: 'Explain GO' },
      { prompt: 'Explain multiplexing in GO' },
      { prompt: 'Explain concurrency in GO' },
      { prompt: 'Explain immediate assignment in GO' },
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
      { prompt: 'Explain HTTP' },
      { prompt: 'Explain request methods in HTTP' },
      { prompt: 'Explain error codes in HTTP' },
      { prompt: 'Explain status codes in HTTP' },
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
};

export const buildSentence = (topic: string, prompt: string, role: string) => {
  console.group();
  console.log(topic);
  console.log(prompt);
  console.log(role);
  console.groupEnd();
  const sentenceMap = new Map();
  sentenceMap.set('role', role);
  sentenceMap.set('and', 'role');
  sentenceMap.set('prompt', prompt);

  const sentence: string[] = [];
  sentenceMap.forEach((value: string, key: string) => {
    console.log(value, key);
    if (key === 'prompt') {
      sentence.push(getPrompt(topic, value));
    } else if (key === 'role') {
      sentence.push(getRole(topic, value));
    } else {
      sentence.push(key);
    }
  })
  return sentence.join(' ');
}

const getRole = (topic: keyof PromptText, role: string): string => {
  console.log('topic: ', topic);
  const rIdx = topics[topic].roles.findIndex((r) => r.role === role.trim());
  if (rIdx === -1) return '';
  return topics[topic].roles[rIdx].role;
}

const getPrompt = (topic: keyof PromptText, prompt: string): string => {
  console.log('topic: ', topic);
  const pIdx = topics[topic].prompts.findIndex((p) => p.prompt === prompt.trim());
  if (pIdx === -1) return '';
  return topics[topic].prompts[pIdx].prompt;
}
