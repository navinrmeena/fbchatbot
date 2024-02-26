

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();


app.get("/",(req,res)=>{
  console.log( "hosted at http://localhost:8000/api/v1/users/registerz");
  res.send("hello ji hello");

});

app.listen(8000,()=>{
  console.log("server is running at http://localhost:8000 ")
})







app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  
  app.use(
    express.json({
      limit: "16kb",
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
      limit: "16kb",
    })
  );
  app.use(express.static("public"));
  
  app.use(cookieParser());
  
  //routes import
  // import userRouter from ".backend/routes/user.routes.js";
  import userRouter from "./src/routes/user.routes.js";
  
  //routes declaration
  app.use("/api/v1/users", userRouter);
  
  // http://localhost:8000/api/v1/users/register
  
  export { app };
  
