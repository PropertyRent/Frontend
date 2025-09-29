import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_APP_URL;

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loginAdmin: () => {},
  logoutAdmin: () => {},
  verifyEmail: () => {},
  forgotPassword: () => {},
  resetPassword: () => {},
  clearError: () => {},
  clearAllErrors: () => {},
  navigate: () => {},
  // Separate loading states
  loginLoading: false,
  logoutLoading: false,
  verifyEmailLoading: false,
  forgotPasswordLoading: false,
  resetPasswordLoading: false,
  // Separate error states
  loginError: null,
  logoutError: null,
  verifyEmailError: null,
  forgotPasswordError: null,
  resetPasswordError: null,
  // Separate success states
  loginSuccess: null,
  logoutSuccess: null,
  verifyEmailSuccess: null,
  forgotPasswordSuccess: null,
  resetPasswordSuccess: null,
  // Legacy states for backward compatibility
  error: null,
  loading: false,
  success: null,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("adminUser")) || null
  );

  // Separate loading states
  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  // Separate error states
  const [loginError, setLoginError] = useState(null);
  const [logoutError, setLogoutError] = useState(null);
  const [verifyEmailError, setVerifyEmailError] = useState(null);
  const [forgotPasswordError, setForgotPasswordError] = useState(null);
  const [resetPasswordError, setResetPasswordError] = useState(null);

  // Separate success states
  const [loginSuccess, setLoginSuccess] = useState(null);
  const [logoutSuccess, setLogoutSuccess] = useState(null);
  const [verifyEmailSuccess, setVerifyEmailSuccess] = useState(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(null);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(null);

  // Legacy states for backward compatibility
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const clearError = () => {
    setError(null);
    setSuccess(null);
  };

  const clearAllErrors = () => {
    setLoginError(null);
    setLogoutError(null);
    setVerifyEmailError(null);
    setForgotPasswordError(null);
    setResetPasswordError(null);
    setLoginSuccess(null);
    setLogoutSuccess(null);
    setVerifyEmailSuccess(null);
    setForgotPasswordSuccess(null);
    setResetPasswordSuccess(null);
    setError(null);
    setSuccess(null);
  };

  const navigate = useNavigate();

  const loginAdmin = async (userData) => {
    console.log("Logging in with data:", userData);
    const loadingToast = toast.loading("Logging in...");
    try {
      setLoginLoading(true);
      setLoginError(null);
      setLoading(true); // Legacy compatibility
      
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        userData,
        { withCredentials: true }
      );
      
      console.log(response.data);
      if (response.data) {
        setUser(response.data?.user);
        localStorage.setItem("adminUser", JSON.stringify(response.data?.user));
        
        const successMessage = response.data?.message || "Login successful! Welcome back.";
        setLoginSuccess(successMessage);
        setSuccess(successMessage); // Legacy compatibility
        
        toast.success(successMessage, { id: loadingToast });
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      
      setLoginError(errorMessage);
      setError(errorMessage); // Legacy compatibility
      
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoginLoading(false);
      setLoading(false); // Legacy compatibility
    }
  };


  const logoutAdmin = async () => {
    const loadingToast = toast.loading("Logging out...");
    try {
      setLogoutLoading(true);
      setLogoutError(null);
      setLoading(true); // Legacy compatibility
      
      const response = await axios.post(`${apiUrl}/api/auth/logout`, {}, { withCredentials: true });
      console.log(response.data);
      
      setUser(null);
      localStorage.removeItem("adminUser");
      
      const successMessage = response.data?.message || "Logged out successfully.";
      setLogoutSuccess(successMessage);
      setSuccess(successMessage); // Legacy compatibility
      
      toast.success(successMessage, { id: loadingToast });
      navigate("/");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Logout failed. Please try again.";
      
      setLogoutError(errorMessage);
      setError(errorMessage); // Legacy compatibility
      
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLogoutLoading(false);
      setLoading(false); // Legacy compatibility
    }
  };

  const verifyEmail = async (token) => {
    const loadingToast = toast.loading("Verifying email...");
    try {
      setVerifyEmailLoading(true);
      setVerifyEmailError(null);
      setLoading(true); // Legacy compatibility
      setError(null); // Legacy compatibility
      
      const response = await axios.get(
        `${apiUrl}/api/auth/verify-email/${token}`,
        { withCredentials: true }
      );
      
      console.log(response.data);
      const successMessage = response.data?.message || "Email verified successfully!";
      
      setVerifyEmailSuccess(successMessage);
      setSuccess(successMessage); // Legacy compatibility
      
      toast.success(successMessage, { id: loadingToast });
      return response.data;
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Email verification failed";
      
      setVerifyEmailError(errorMessage);
      setError(errorMessage); // Legacy compatibility
      
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setVerifyEmailLoading(false);
      setLoading(false); // Legacy compatibility
    }
  };

  const forgotPassword = async (email) => {
    const loadingToast = toast.loading("Sending reset link...");
    try {
      setForgotPasswordLoading(true);
      setForgotPasswordError(null);
      setLoading(true); // Legacy compatibility
      setError(null); // Legacy compatibility
      
      const response = await axios.post(
        `${apiUrl}/api/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );
      
      console.log(response.data);
      const successMessage = response.data?.message || "Reset password link sent to your email!";
      
      setForgotPasswordSuccess(successMessage);
      setSuccess(successMessage); // Legacy compatibility
      
      toast.success(successMessage, { id: loadingToast });
      return response.data;
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Failed to send reset password link";
      
      setForgotPasswordError(errorMessage);
      setError(errorMessage); // Legacy compatibility
      
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setForgotPasswordLoading(false);
      setLoading(false); // Legacy compatibility
    }
  };

  const resetPassword = async (token, newPassword) => {
    const loadingToast = toast.loading("Resetting password...");
    try {
      setResetPasswordLoading(true);
      setResetPasswordError(null);
      setLoading(true); // Legacy compatibility
      setError(null); // Legacy compatibility
      
      const response = await axios.post(
        `${apiUrl}/api/auth/reset-password/${token}`,
        {
          new_password: newPassword,
        },
        { withCredentials: true }
      );
      
      console.log(response.data);
      const successMessage = response.data?.message || "Password reset successfully!";
      
      setResetPasswordSuccess(successMessage);
      setSuccess(successMessage); // Legacy compatibility
      
      toast.success(successMessage, { id: loadingToast });
      return response.data;
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Failed to reset password";
      
      setResetPasswordError(errorMessage);
      setError(errorMessage); // Legacy compatibility
      
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setResetPasswordLoading(false);
      setLoading(false); // Legacy compatibility
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginAdmin,
        logoutAdmin,
        verifyEmail,
        forgotPassword,
        resetPassword,
        clearError,
        clearAllErrors,
        setUser,
        navigate,
        // Separate loading states
        loginLoading,
        logoutLoading,
        verifyEmailLoading,
        forgotPasswordLoading,
        resetPasswordLoading,
        // Separate error states
        loginError,
        logoutError,
        verifyEmailError,
        forgotPasswordError,
        resetPasswordError,
        // Separate success states
        loginSuccess,
        logoutSuccess,
        verifyEmailSuccess,
        forgotPasswordSuccess,
        resetPasswordSuccess,
        // Legacy states for backward compatibility
        error,
        loading,
        success,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
