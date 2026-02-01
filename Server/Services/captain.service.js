import CaptainModel from "../models/captain.model.js";

export const createCaptain = async ({
  firstName,
  lastName,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
}) => {
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !capacity ||
    !vehicleType
  ) {
    throw new Error("All fields are required");
  }
  //Check if user already exists
  const existingCaptain = await CaptainModel.findOne({
    email: email.toLowerCase(),
  });
  if (existingCaptain) {
    throw new Error("Captain with this email already exists");
  }

  const hashedPassword = await CaptainModel.hashPassword(String(password));

  //Create new captain
  const captain = await CaptainModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email: email.toLowerCase(),
    password: hashedPassword,
    vehicle: {
      color,
      plate,
      capacity,
      vehicleType,
    },
  });
  return captain;
};
