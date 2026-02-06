import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import UserSignup from "./pages/UserSignup.jsx";
import CaptainLogin from "./pages/CaptainLogin.jsx";
import CaptainSignup from "./pages/CaptainSignup.jsx";
import UserProtectedWrapper from "./pages/UserProtectedWrapper.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserLogout from "./pages/UserLogout.jsx";
import CaptainLogout from "./pages/CaptainLogout.jsx";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper.jsx";
import CaptainHome from "./pages/CaptainHome.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/UserSignup" element={<UserSignup />} />
        <Route path="/CaptainLogin" element={<CaptainLogin />} />
        <Route path="/CaptainSignup" element={<CaptainSignup />} />
        <Route
          path="/Home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/captain-home"
          element={
            <CaptainProtectWrapper>
              <CaptainHome />
            </CaptainProtectWrapper>
          }
        />

        <Route
          path="/user/logout"
          element={
            <UserProtectedWrapper>
              <UserLogout />
            </UserProtectedWrapper>
          }
        />

        <Route
          path="/captain/logout"
          element={
            <CaptainProtectWrapper>
              <CaptainLogout />
            </CaptainProtectWrapper>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
