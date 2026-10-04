import { chatGraph } from "../ai/graph";
import db from "../db";
import { chat } from "../db/schema";

export async function createNewChat() {
  const newChat = db.insert(chat).values({}).returning({ id: chat.id });
  if (!newChat) {
    throw new Error("Error while creating new chat.");
  }
  return newChat;
}
export async function updateChatTitle(query: string) {
  try {
    const response = await chatGraph.invoke({
      messages: [
        `Generate Chat Title For The Query : ${query}. Make the Chat Title Short and donot exceed more than 50 characters. Just Give a single response whatever you think is best in suited chat title for this query. Avoid Giving me Options, Just Generate me a chat title.`,
      ],
    });
    const generatedTitle = response.messages[response.messages.length - 1]
      .content as string;
    const insertedChatTitle = await db
      .insert(chat)
      .values({ title: generatedTitle })
      .returning();
    return generatedTitle;
  } catch (error) {
    console.log("Error while Updating Chat Title : ", error);
    throw new Error(error as string);
  }
}
