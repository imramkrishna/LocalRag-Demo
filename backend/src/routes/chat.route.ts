import { Router } from "express";
import db from "../db";
import { chat } from "../db/schema";
import { chatGraph } from "../ai/graph";

const chatRouter = Router();
async function createNewChat() {
  const newChat = db.insert(chat).values({}).returning({ id: chat.id });
  if (!newChat) {
    throw new Error("Error while creating new chat.");
  }
  return newChat;
}
async function updateChatTitle(query: string) {
  const response = await chatGraph.invoke({
    messages: [
      `Generate Chat Title For The Query : ${query}. Make the Chat Title Short and donot exceed more than 50 characters. Just Give a single response whatever you think is best in suited chat title for this query. Avoid Giving me Options, Just Generate me a chat title.`,
    ],
  });
  return response.messages[response.messages.length - 1].content;
}
chatRouter.post("/new", async (req, res) => {
  const { query } = req.body;
  try {
    if (!query) {
      res.status(402).json({
        sucess: false,
        message: "Query Not Found.",
      });
    }
    const newChatId = await createNewChat();
    console.log("New Chat Created : ", newChatId);
    const newTitle = await updateChatTitle(query);
    console.log("This is new Title ", newTitle);
    res.status(200).json({
      success: true,
      message: "New Chat Created",
      data: { id: newChatId, title: newTitle },
    });
  } catch (error) {
    console.log("Error while processing your request : ", error);
    res.status(500).json({
      success: false,
      message: "Error while processing your request.",
    });
  }
});
chatRouter.get("/:id", async (req, res) => {
  const chatId = req.params.id;
  if (!chatId) {
    res.status(404).json({
      message: "Couldnot Find Chat. Invalid chat id.",
    });
    return;
  }
  console.log(chatId);
  res.send(chatId);
});

export default chatRouter;
