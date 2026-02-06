import React from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CaptainLogin() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [CaptainData, setCaptainData] = React.useState({});

  const navigate = useNavigate();
  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const CaptainData = {
        email,
        password,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/captains/login`,
        CaptainData,
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("Captain logged in successfully:", data);
        // save user in context
        setCaptain(data);

        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        navigate("/Home");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      // shows backend message if available
      alert(error.response?.data?.message || "Invalid email or password");
    }

    setCaptainData({ email: email, password: password });
    setEmail("");
    setPassword("");
  };
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-20 mb-3"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt=""
        />

        <form onSubmit={(e) => submitHandler(e)}>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>

          <input
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="password"
          />

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">
            Login as Captain
          </button>
        </form>
        <p className="text-center">
          New here?{" "}
          <Link to="/CaptainSignup" className="text-blue-600">
            Register as Captain
          </Link>
        </p>
      </div>
      <div>
        <Link
          to="/UserLogin"
          className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
}

export default CaptainLogin;
