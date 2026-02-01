import userModel from "../models/user.model.js";

export const createUser = async ({ firstName, lastName, email, password }) => {
  if (!firstName || !email || !password) {
    throw new Error("All fields are required");
  }
  //Check if user already exists
  const existingUser = await userModel.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  //Create new user
  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email: email,
    password: await userModel.hashPassword(String(password)),
  });

  return user;
};
