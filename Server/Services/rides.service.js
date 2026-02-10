import axios from "axios";
import { getDistanceTimeMatrix } from "../Services/maps.service.js";
import rideModel from "../models/ride.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { getAddressCoordinate } from "../Services/maps.service.js";

//Get fare function
async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const pickupCoords = await getAddressCoordinate(pickup);
  const destinationCoords = await getAddressCoordinate(destination);

  const { distance, duration } = await getDistanceTimeMatrix(
    pickupCoords,
    destinationCoords,
  );

  if (!distance || !duration) {
    throw new Error("Invalid distance or duration from Mapbox");
  }

  const baseFare = {
    auto: 30,
    car: 50,
    moto: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    moto: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    moto: 1.5,
  };

  const distanceKm = distance / 1000;
  const durationMin = duration / 60;

  const fare = {
    auto: Math.round(
      baseFare.auto +
        distanceKm * perKmRate.auto +
        durationMin * perMinuteRate.auto,
    ),
    car: Math.round(
      baseFare.car +
        distanceKm * perKmRate.car +
        durationMin * perMinuteRate.car,
    ),
    moto: Math.round(
      baseFare.moto +
        distanceKm * perKmRate.moto +
        durationMin * perMinuteRate.moto,
    ),
  };

  return fare;
}

export default getFare;

//Generate otp
function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp(num);
}

//Create Ride
export const createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);

  const ride = rideModel.create({
    user,
    pickup,
    destination,
    otp: getOtp(6),
    fare: fare[vehicleType],
  });

  return ride;
};

//Confirm Ride
export const ConfirmRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "accepted",
      captain: captain._id,
    },
  );

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

//Start ride
export const startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    },
  );

  return ride;
};

//End Ride
export const endRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "completed",
    },
  );

  return ride;
};
