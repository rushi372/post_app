import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postModel from "./models/postModel.js";
import { posts } from "./data/posts.js";
import postRoutes from "./routes/postRoutes.js";
import path from 'path';
//configuring dotenv file
dotenv.config();

//creating server
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//accessing static files
app.use(express.static(path.join(__dirname, './client/build')))

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/post", postRoutes);

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    try {
      app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
      });
      //postModel.insertMany(posts);
    } catch (error) {
      console.error(`Error starting the server: ${error.message}`);
    }
  })
  .catch((error) => {
    console.log(`Error connecting to the database: ${error.message}`);
  });
