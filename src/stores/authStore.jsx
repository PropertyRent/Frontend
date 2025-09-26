import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_APP_URL;

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loginAdmin: () => {},
  logoutAdmin: () => {},
  navigate: () => {},
  error: null,
  loading: false,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("adminUser")) || null
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginAdmin = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        userData,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data) {
        setUser(response.data.data);
        localStorage.setItem("adminUser", JSON.stringify(response.data.data));
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setError(
        error.response ? error.response.data.message : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };


  const logoutAdmin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/api/auth/logout`, {}, { withCredentials: true });
      console.log(response.data);
      setUser(null);
      localStorage.removeItem("adminUser");
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(
        error.response ? error.response.data.message : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginAdmin,
        logoutAdmin,
        setUser,
        error,
        loading,
        navigate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
