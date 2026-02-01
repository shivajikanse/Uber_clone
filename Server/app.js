//All Imports
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./lib/db.config.js";
import UserRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import CaptainRoutes from "./routes/captain.route.js";

//Configuring dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//Routes
app.get("/", (req, res) => {
  res.send("Server is up and running");
});
app.use("/api/users", UserRoutes);
app.use("/api/captains", CaptainRoutes);

//Server listening
const StartServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    console.error(error.message);
    process.exit(1);
  }
};

//Invoke
StartServer();
