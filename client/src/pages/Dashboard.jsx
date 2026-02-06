import React from "react";
import { Link } from "react-router-dom";
import UserLogin from "./UserLogin";

function Dashboard() {
  return (
    <div>
      <div className=" bg-cover bg-bottom bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww)] h-screen pt-7 flex justify-between flex-col w-full bg-red-400">
        <img
          className="w-40 h-15 object-contain"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt=""
        />
        <div className="bg-white py-5 px-10 justify-center items-center flex flex-col pb-7">
          <h2 className=" text-2xl font-bold ">Get started with Uber</h2>
          <Link
            to="/UserLogin"
            className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-3"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
