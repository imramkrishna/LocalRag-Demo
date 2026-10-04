import express from "express";
import cors from "cors";
import { HumanMessage } from "@langchain/core/messages";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { chatGraph } from "./ai/graph";
import chatRouter from "./routes/chat.route";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);

app.use("/chat", chatRouter);
app.get("/", (req, res) => {
  res.send("Hello!!! Server is working");
});

app.post("/chat-llm", async (req, res) => {
  const query = req.body.messages
    ?.at(-1)
    ?.parts?.find(
      (part: { type?: string }): part is { type: "text"; text: string } =>
        part.type === "text",
    )?.text;

  if (!query) {
    res.status(400).json({
      success: false,
      message: "Query is required",
    });
    return;
  }

  console.log("New Query Received : ", query);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const textPartId = `answer-${Date.now()}`;
      writer.write({ type: "text-start", id: textPartId });

      const graphStream = await chatGraph.stream(
        {
          messages: [new HumanMessage(query)],
        },
        { streamMode: "messages" },
      );

      for await (const chunk of graphStream) {
        const messageChunk = Array.isArray(chunk) ? chunk[0] : chunk;
        const content =
          typeof messageChunk.content === "string" ? messageChunk.content : "";

        if (content) {
          writer.write({ type: "text-delta", id: textPartId, delta: content });
        }
      }

      writer.write({ type: "text-end", id: textPartId });
    },
    onError: (error) => {
      console.error(error);
      return "Chat processing failed";
    },
  });

  const response = createUIMessageStreamResponse({ stream });
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.status(response.status);

  if (!response.body) {
    res.end();
    return;
  }

  const reader = response.body.getReader();
  const encoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    res.write(encoder.decode(value, { stream: true }));
  }

  res.end();
});
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
