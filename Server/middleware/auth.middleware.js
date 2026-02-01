import usermodel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BlackListToken from "../models/blackListToken.js";
import CaptainModel from "../models/captain.model.js";

export const authuser = async (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization").split(" ")[1];
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
    req.user = await usermodel.findById(decoded._id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// ==============Captain Authentication Middleware=====================
export const captainAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
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
