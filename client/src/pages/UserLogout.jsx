import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem("token");

        await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            // withCredentials: true, // if backend uses cookies
          },
        );

        localStorage.removeItem("token");
        navigate("/UserLogin");
      } catch (error) {
        console.error("Logout error:", error);
        navigate("/UserLogin"); // fallback redirect
      }
    };

    logout();
  }, [navigate]);

  return null;
};

export default UserLogout;
