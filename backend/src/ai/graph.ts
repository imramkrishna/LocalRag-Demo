import {
  END,
  START,
  StateGraph,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { model } from "./config";
async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return {
    messages: [response],
  };
}

export const chatGraph = new StateGraph(MessagesAnnotation)
  .addNode("callModel", callModel)
  .addEdge(START, "callModel")
  .addEdge("callModel", END)
  .compile();
