import express from "express";
const router = express.Router();
import { body, query } from "express-validator";
import { authuser, captainAuth } from "../middleware/auth.middleware.js";
import {
  createRideController,
  confirmRide,
  startRide,
  endRide,
} from "../controllers/rides.controller.js";
import { getFare } from "../controllers/rides.controller.js";

router.post(
  "/create",
  authuser,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Inavlid pickup address "),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Inavlid destination address "),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "moto"])
    .withMessage("Invalid vehicle type"),
  createRideController,
);

router.get(
  "/get-fare",
  authuser,
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  getFare,
);

//Confirm ride
router.post(
  "/confirm",
  captainAuth,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  confirmRide,
);

router.get(
  "/start-ride",
  captainAuth,
  query("rideId").isMongoId().withMessage("Invalid ride id"),
  query("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),
  startRide,
);

router.post(
  "/end-ride",
  captainAuth,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  endRide,
);

export default router;
