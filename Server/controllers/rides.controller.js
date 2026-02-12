import { validationResult } from "express-validator";
import {
  getAddressCoordinate,
  getCaptainsInTheRadius,
} from "../Services/maps.service.js";
import {
  createRide,
  startRideService,
  endRideService,
} from "../Services/rides.service.js";
import rideModel from "../models/ride.model.js";
import getFareService, { ConfirmRide } from "../Services/rides.service.js";

import { sendMessageToSocketId } from "../socket.js";

//Create Ride
export const createRideController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    const pickupCoordinates = await getAddressCoordinate(pickup);

    const captainsInRadius = await getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      10,
    );

    const rideWithUser = await rideModel.findById(ride._id).populate("user");

    res.status(201).json(rideWithUser);

    // console.log("Total Captains Found:", captainsInRadius.length);
    // console.log("Captains Array:", captainsInRadius);

    captainsInRadius.forEach((captain) => {
      if (captain.socketId) {
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: rideWithUser,
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

//get-Fare
export const getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await getFareService(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Confirm- Ride
export const confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await ConfirmRide({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });
    console.log("Rider socketId:", ride.user.socketId);

    return res.status(200).json(ride);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

//Start Ride
export const startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await startRideService({
      rideId,
      otp,
      captain: req.captain,
    });

    console.log(ride);

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//End ride
export const endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await endRideService({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  s;
};
