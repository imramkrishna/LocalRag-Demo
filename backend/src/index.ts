import express from "express";
import { model } from "./ai/config";

const app = express();
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello!!! Server is working");
});

app.get("/chat", async (req, res) => {
  try {
    const response = await model.invoke("Hello, Who is this ?");
    console.log(response)
    res.json({
        success:true,
        data:{
            response:response.content
        }
    })
  } catch (error) {
    console.log(error)
    res.json({
        success:false,
        message:"There was an error while processing your request."
    })
  }
});
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
