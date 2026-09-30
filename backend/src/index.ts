import express from "express";
import { model } from "./ai/config";
import cors from "cors"
const app = express();
app.use(express.json())
app.use(cors({
  origin:['http://localhost:5173']
}))
app.get("/", (req, res) => {
  res.send("Hello!!! Server is working");
});

app.post("/chat", async (req, res) => {
  try {
    const {query}=req.body;
    if(!query){
      res.json({
        status:400,
        success:false,
        message:"No query passed, Pass the query to get the response",
      })
      return;
    }
    const response = await model.invoke(query);
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
