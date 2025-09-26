import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const appURL = import.meta.env.VITE_APP_URL;

export const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
  setLoading: () => {},
  loginAdmin: () => {},
  logoutAdmin: () => {},
  error: null,
  setError: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("adminUser")
      ? JSON.parse(localStorage.getItem("adminUser"))
      : null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const loginAdmin = async (userData) => {
    console.log("Logging in with:", userData);
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${appURL}/auth/login`, userData, {
        withCredentials: true,
      });
      setUser(res.data.user);
      localStorage.setItem("adminUser", JSON.stringify(res.data.user));
      console.log("Login successful:", res.data);
      navigate("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${appURL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      localStorage.removeItem("adminUser");
      console.log("Logout successful:", res.data);
      navigate("/owner-login");
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        setLoading,
        loginAdmin,
        logoutAdmin,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;