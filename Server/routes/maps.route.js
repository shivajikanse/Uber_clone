import express from "express";
import { authuser } from "../middleware/auth.middleware.js";
import {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestion,
} from "../controllers/maps.controller.js";
import { query } from "express-validator";

const router = express.Router();

//Gets you Co-ordinates Route
router.get(
  "/get-coordinates",
  query("address").isString().isLength({ min: 3 }),
  authuser,
  getCoordinates,
);

//Distance and Time Route
router.get(
  "/get-distance-time",
  query("origin").isString().isLength({ min: 3 }),
  query("destination").isString().isLength({ min: 3 }),
  authuser,
  getDistanceTime,
);

//Suggestion Route
router.get(
  "/get-suggestion",
  query("input").isString().isLength({ min: 3 }),
  authuser,
  getAutoCompleteSuggestion,
);

export default router;
