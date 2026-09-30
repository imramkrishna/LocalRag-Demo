import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "openrouter/free",
  apiKey:"",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
});

export {model}
