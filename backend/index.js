import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.static("public"));
app.use("/images", express.static("images"));

dotenv.config();
const PORT = process.env.PORT || 3000;
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server is Running on port ${PORT}`))
  )
  .catch((error) => console.log(`${error} didn't connected to the server`));

app.use("/chat", chatRoute);
app.use("/message", messageRoute);
