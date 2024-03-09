import express from "express";
import { getPostsController } from "../controllers/postControllers.js";
import { requireSignIn } from "../middlewares/authMiddlewares.js";

const router = express.Router();

//Post routes
router.get("/all-posts", requireSignIn, getPostsController);

export default router;
