import express from "express";
import { model } from "./ai/config";
import cors from "cors";
import { HumanMessage } from "langchain";
import { chatGraph } from "./ai/graph";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);
app.get("/", (req, res) => {
  res.send("Hello!!! Server is working");
});

app.post("/chat", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    res.status(400).json({
      success: false,
      message: "Query is required",
    });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await chatGraph.stream(
      {
        messages: [new HumanMessage(query)],
      },
      {
        streamMode: "messages",
      },
    );

    for await (const chunk of stream) {
      const messageChunk = Array.isArray(chunk) ? chunk[0] : chunk;

      const content =
        typeof messageChunk.content === "string" ? messageChunk.content : "";

      if (!content) continue;

      res.write(
        `data: ${JSON.stringify({
          content,
        })}\n\n`,
      );
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error(error);

    res.write(
      `data: ${JSON.stringify({
        error: "Chat processing failed",
      })}\n\n`,
    );

    res.end();
  }
});
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
