import type { Request, Response } from "express";
import { createNewChat, findChatById, updateChatTitle } from "../queries/chat";
import { chat } from "../db/schema";
export const createNewChatController = async (req: Request, res: Response) => {
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
    const newTitle = await updateChatTitle(query, newChat[0].id);
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
};

export const getChatByIdController = async (req: Request, res: Response) => {
  const chatId = req.params.id;
  try {
    if (!chatId) {
      res.status(404).json({
        message: "Couldnot Find Chat. Invalid chat id.",
      });
      return;
    }
    const chat = await findChatById(chatId as string);
    if (!chat) {
      res.status(404).json({
        message: "Couldnot Find Chat. Invalid chat id.",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Chat found.",
      data: chat,
    });
  } catch (error) {
    console.log("Error while searching chat : ", error);
    res.status(200).json({
      success: false,
      message: "Error Chat Not found.",
    });
  }
};
