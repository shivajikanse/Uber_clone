import usermodel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BlackListToken from "../models/blackListToken.js";
import CaptainModel from "../models/captain.model.js";

export const authuser = async (req, res, next) => {
  let token;

  // 1. Check cookie
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // 2. Check Authorization header
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 3. If still no token
  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  // Check if token is blacklisted
  const isBlacklisted = await BlackListToken.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(403).json({
        message: "Token does not belong to a user",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// ==============Captain Authentication Middleware=====================
export const captainAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.token ||
    (authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  // Check if token is blacklisted
  const isBlacklisted = await BlackListToken.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("captainAuth decoded id:", decoded._id);

    const captain = await CaptainModel.findById(decoded._id).select(
      "-password",
    );
    if (!captain) {
      // If the id exists in users, it means a user token was sent instead of a captain token
      const user = await usermodel.findById(decoded._id).select("-password");
      if (user) {
        return res.status(403).json({
          message: "Token belongs to a user; please log in as a captain",
        });
      }

      return res
        .status(404)
        .json({ message: "Captain not found for provided token" });
    }

    req.captain = captain;

    next();
  } catch (err) {
    console.error("captainAuth error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};
