import express from "express";
import {
  signUpController,
  loginController,
  forgotPasswordController,
} from "../controllers/authControllers.js";

const router = express.Router();

//Auth routes
router.post("/signup", signUpController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);

export default router;
