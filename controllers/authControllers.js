import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

//signUpController
export const signUpController = async (req, res) => {
  try {
    const { name, email, password, confirm_password, profilePicture, answer } =
      req.body;

    //validations
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }
    if (!email) {
      return res.status(400).send({ message: "email is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "password is required" });
    }
    if (!confirm_password) {
      return res.status(400).send({ message: "confirm_password is required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "answer is required" });
    }

    //existing user check
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already registered with this email id",
      });
    }

    //password & confirm_password case check
    if (password !== confirm_password) {
      return res.status(400).send({
        success: false,
        message: "Password & Confirm Password should be same",
      });
    }

    //hashing the password
    const hashedPassword = await hashPassword(password);

    //After all validations saving the user
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      confirm_password: hashedPassword,
      profilePicture,
      answer,
    }).save();

    return res.status(200).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error in signUpController",
      error,
    });
  }
};

//loginController
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validations
    if (!email) {
      return res.status(400).send({ message: "email is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "password is required" });
    }

    //Checking if user is exist or not
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email",
      });
    }

    //password check
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Incorrect Password",
      });
    }

    //creating jsonwebtoken
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", //will expires in 7day
    });

    return res.status(200).send({
      success: true,
      message: "Successfully login",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      token, //passing the jwt
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error in loginController",
      error,
    });
  }
};

//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;

    //validations
    if (!email || !newPassword || !answer) {
      return res.send({
        message: "Please fill all the fields",
      });
    }

    //existing user check
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }

    //hashing the newPassword
    const hash = await hashPassword(newPassword);

    //updating hashed password
    await userModel.findByIdAndUpdate(user._id, { password: hash });

    return res.status(201).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in forgotPasswordController",
      error,
    });
  }
};
