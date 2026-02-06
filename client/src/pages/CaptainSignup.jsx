import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext.jsx";
import { useNavigate } from "react-router-dom";

function CaptainSignup() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [vehiclecolor, setVehicleColor] = React.useState("");
  const [vehicletype, setVehicleType] = React.useState("");
  const [vehiclePlate, setVehiclePlate] = React.useState("");
  const [vehicleCapacity, setVehicleCapacity] = React.useState(0);

  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const newCaptain = {
        fullName: {
          firstName: firstName,
          lastName: lastName,
        },
        email: email,
        password: password,
        vehicle: {
          color: vehiclecolor,
          plate: vehiclePlate,
          vehicleType: vehicletype,
          capacity: Number(vehicleCapacity),
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/captains/register`,
        newCaptain,
      );
      console.log("Server response:", response);

      if (response.status === 201) {
        const data = response.data;
        console.log("Captain registered successfully:", data);
        setCaptain(data);
        navigate("/CaptainLogin");
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setVehicleCapacity("");
      setVehicleColor("");
      setVehiclePlate("");
      setVehicleType("");
    } catch (error) {
      console.log("FULL ERROR ", error.response?.data);

      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) =>
          console.error(`${err.param}: ${err.msg}`),
        );
      }
    }
  };
  return (
    <div>
      <div className="p-7 h-screen flex flex-col justify-between">
        <div>
          <img
            className="w-16 mb-10"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
            alt=""
          />

          <form
            onSubmit={(e) => {
              onSubmitHandler(e);
            }}
          >
            <h3 className="text-lg w-1/2  font-medium mb-2">
              What's your name
            </h3>
            <div className="flex gap-4 mb-7">
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <input
                required
                className="bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>

            <h3 className="text-lg font-medium mb-2">What's your email</h3>
            <input
              required
              value={email}
              className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              type="email"
              placeholder="email@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <h3 className="text-lg font-medium mb-2">Enter Password</h3>

            <input
              className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              type="password"
              placeholder="password"
            />

            {/*//Vehicle information */}
            <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
            <div className="flex gap-4 mb-7">
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="Vehicle color"
                value={vehiclecolor}
                onChange={(e) => setVehicleColor(e.target.value)}
              />
              <select
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg"
                value={vehicletype}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="">Select vehicle type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>
            </div>
            <div className="flex gap-4 mb-7">
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="Vehicle plate"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
              />
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="number"
                placeholder="Vehicle capacity"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
              />
            </div>

            <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">
              Create account
            </button>
          </form>
          <p className="text-center">
            Already have a account?{" "}
            <Link to="/CaptainLogin" className="text-blue-600">
              Login here
            </Link>
          </p>
        </div>
        <div>
          <p className="text-[10px] leading-tight">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CaptainSignup;
