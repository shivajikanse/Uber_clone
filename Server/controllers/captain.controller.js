import express from "express";
import { validationResult } from "express-validator";
import CaptainModel from "../models/captain.model.js";
import { createCaptain } from "../Services/captain.service.js";
import BlackListToken from "../models/blackListToken.js";

/* =========================================================================================== */
export const registerCaptain = async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullName, email, password, vehicle } = req.body;

  // const hashedPassword = await CaptainModel.hashPassword(String(password));

  const captain = await createCaptain({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  // Generate auth token
  const token = captain.generateAuthToken();
  res.status(201).json({ captain, token });
};

/* ===================================================================================== */
// Login Captain
export const loginCaptain = async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  // Check if captain exists
  const captain = await CaptainModel.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(400).json({ error: "Invalid email " });
  }

  // Check if password matches
  const isPasswordMatch = await captain.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(400).json({ error: "Invalid  password" });
  }
  // Generate auth token
  const token = captain.generateAuthToken();
  res.status(200).json({ captain, token });
};

/*  ============================================================================ */
// Get Captain Profile
export const CaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

//========== Logout Captain  //
export const logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }

  try {
    await BlackListToken.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: "Failed to logout" });
  }
};
