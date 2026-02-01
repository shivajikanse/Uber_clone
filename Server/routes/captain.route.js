import express from "express";
const router = express.Router();
import { body } from "express-validator";
import { registerCaptain } from "../controllers/captain.controller.js";
import { loginCaptain } from "../controllers/captain.controller.js";
import { captainAuth } from "../middleware/auth.middleware.js";
import { CaptainProfile } from "../controllers/captain.controller.js";
import { logoutCaptain } from "../controllers/captain.controller.js";

// Register Captain
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("fullName.lastName")
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("vehicle.color").notEmpty().withMessage("Vehicle color is required"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Plate number must be at least 3 characters long"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
    body("vehicle.vehicleType")
      .isIn(["bike", "car", "van", "auto"])
      .withMessage("Invalid vehicle type"),
  ],
  registerCaptain,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  loginCaptain,
);

// Get Captain Profile
router.get("/profile", captainAuth, CaptainProfile);

router.get("/logout", captainAuth, logoutCaptain);

export default router;
