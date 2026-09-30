import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv"

dotenv.config()
const model = new ChatOpenAI({
  model: "openrouter/free",
  apiKey:process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
});

export {model}
