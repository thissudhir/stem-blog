import express  from "express";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import cookieParser from "cookie-parser";

import cors from 'cors'; 

const app =express()

app.use(express.json())
app.use(cookieParser())
app.use(cors());




app.use("/api/posts", postRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)


app.listen(8800, ()=>{
    console.log("Server is running on port 8800");
})