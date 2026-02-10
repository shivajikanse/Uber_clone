import { getAddressCoordinate } from "../Services/maps.service.js";
import { getDistanceTimeMatrix } from "../Services/maps.service.js";
import { getSuggestion } from "../Services/maps.service.js";
import { validationResult } from "express-validator";

//get the co-ordinates of user !!
export const getCoordinates = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;
  try {
    const coordinates = await getAddressCoordinate(address);
    res.status(200).json(coordinates);
  } catch (error) {
    res.status(404).json({ message: "Coordinate not found !" });
  }
};

//get distance and time user and destination
export const getDistanceTime = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination } = req.query;

  try {
    if (!origin || !destination) {
      return res
        .status(400)
        .json({ message: "origin and destination are required" });
    }

    const originCoords = await getAddressCoordinate(origin);
    const destinationCoords = await getAddressCoordinate(destination);
    console.log("Pickup coords:", originCoords);
    console.log("Destination coords:", destinationCoords);

    const distanceTime = await getDistanceTimeMatrix(
      originCoords,
      destinationCoords,
    );
    res.status(200).json(distanceTime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error " });
  }
};

//Suggestion !
export const getAutoCompleteSuggestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { input } = req.query;
  try {
    const suggestions = await getSuggestion(input);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
