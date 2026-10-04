import { Router } from "express";
import { createNewChat, updateChatTitle } from "../queries/chat";

const chatRouter = Router();

chatRouter.post("/new", async (req, res) => {
  const { query } = req.body;
  try {
    if (!query) {
      res.status(402).json({
        sucess: false,
        message: "Query Not Found.",
      });
    }
    const newChat = await createNewChat();
    console.log("New Chat Created : ", newChat[0].id);
    const newTitle = await updateChatTitle(query);
    console.log("This is new Title :", newTitle);
    res.status(200).json({
      success: true,
      message: "New Chat Created",
      data: { id: newChat[0].id, title: newTitle },
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
