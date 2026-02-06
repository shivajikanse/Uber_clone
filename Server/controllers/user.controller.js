import userModel from "../models/user.model.js";
import { createUser } from "../Services/user.service.js";
import { validationResult } from "express-validator";
import BlackListToken from "../models/blackListToken.js";

// Register User
export const registerUser = async (req, res, next) => {
  // Validate request
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  //Request User data !!
  const { fullName, email, password } = req.body;
  //create user
  const user = await createUser({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password,
  });

  const token = user.generateAuthToken();
  res.status(201).json({ user, token });
};

/* ------------------------------------------------------------------------------------------ */
// Login User
export const loginUser = async (req, res, next) => {
  // Validate request
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  //Request User data !!
  const { email, password } = req.body;

  //find user by email
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  //compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  //generate token;
  const token = user.generateAuthToken();

  res.cookie("token", token, { httpOnly: true }); // token in cookie

  res.status(200).json({ user, token });
};

/* ------------------------------------------------------------------------------------------ */

// Get User Profile
export const getUserProfile = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

export const logoutUser = async (req, res, next) => {
  try {
    // Invalidate the token by adding it to the blacklist
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    if (token) {
      await BlackListToken.create({ token });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
