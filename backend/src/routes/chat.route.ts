import { Router } from "express";
import {
  createNewChatController,
  getChatByIdController,
} from "../controllers/chat.controller";

const chatRouter = Router();

chatRouter.post("/new", createNewChatController);
chatRouter.get("/:id", getChatByIdController);

export default chatRouter;
