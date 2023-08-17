import express  from "express";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import cookieParser from "cookie-parser";
import multer from "multer";

import cors from 'cors'; // Correct import statement

const app =express()

app.use(express.json())
app.use(cookieParser())
app.use(cors());

// Configure multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use an absolute path for the destination
    cb(null, path.join(__dirname, '../frontend/public/upload'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

// Define the upload route
app.post('/api/upload', upload.single('file'), function (req, res) {
  const file = req.file;
  // Respond with the filename as the URL
  res.status(200).json(file.filename);
});


app.use("/api/posts", postRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)


app.listen(8800, ()=>{
    console.log("Server is running on port 8800");
})