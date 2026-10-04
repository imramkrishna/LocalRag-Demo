import dotenv from "dotenv";
import { ChatOpenRouter } from "@langchain/openrouter";
dotenv.config();
const model = new ChatOpenRouter("openrouter/free", {
  temperature: 1,
  apiKey: process.env.OPENROUTER_API_KEY,
  maxRetries:2
});

export { model };
