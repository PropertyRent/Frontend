import { useContext, useEffect, useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../stores/authStore";

export default function OwnerPortalAuth() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const {
    user,
    loading,
    error,
    success,
    loginAdmin,
    forgotPassword,
    resetPassword,
    clearError,
    navigate,
    setError,
  } = useContext(AuthContext);
  const location = useLocation();
  const params = useParams();
  console.log("Mode:", mode);
  // Extract token from URL parameters for reset password
  const resetToken = params.resetToken;
  console.log("Reset Token from params:", resetToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    try {
      if (mode === "login") {
        console.log("Form submitted!!");
        loginAdmin({ email, password });
      } else if (mode === "forgot") {
        forgotPassword(email);
      } else if (mode === "reset") {
        if (!resetToken) {
          setError(
            "Reset token is missing. Please use the link from your email."
          );
          return;
        }
        if (password !== confirmPassword) {
          setPasswordMatch(false);
          return;
        }
        setPasswordMatch(true);
        console.log("Resetting password with token:", resetToken);
        resetPassword(resetToken, password);
        // After successful reset, redirect to login
        setTimeout(() => {
          setMode("login");
          clearError();
        }, 2000);
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.form.password?.value;
    const confirmPassword = e.target.form.confirmPassword?.value;
    if (password && confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Check if we're on reset password route
    const urlParams = new URLSearchParams(location.search);
    const resetToken = urlParams.get("token");
    if (resetToken || location.pathname.includes("reset-password")) {
      setMode("reset");
    }
  }, [location]);

  useEffect(() => {
    // Clear messages when mode changes
    clearError();
  }, [mode, clearError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Link to="/">
        <FaArrowLeft className="absolute top-4 left-4 text-[var(--color-darker)] cursor-pointer hover:text-[var(--color-darkest)]" />
      </Link>
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/" alt="GMP Rentals" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-light text-center text-gray-700 mb-2">
          {mode === "login" && "Welcome to the Admin Portal"}
          {mode === "signup" && "Create your account"}
          {mode === "forgot" && "Forgot Password"}
          {mode === "reset" && "Reset your password"}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {mode === "login" && "Log in with your account credentials below."}
          {mode === "signup" &&
            "Fill in the form to create a new password and register."}
          {mode === "forgot" && "Enter your email to receive a reset link."}
          {mode === "reset" && "Enter your new password below."}
        </p>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600 text-center">{success}</p>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email field for login and forgot password */}
          {(mode === "login" || mode === "forgot") && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-600 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
          )}

          {/* Password field for login */}
          {mode === "login" && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-600 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-gray-400" />
                  ) : (
                    <FaEye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Password fields for reset password */}
          {mode === "reset" && (
            <>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-600 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    placeholder="••••••••"
                    onChange={handlePasswordChange}
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-gray-400" />
                    ) : (
                      <FaEye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm text-gray-600 mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                      !passwordMatch
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="••••••••"
                    onChange={handlePasswordChange}
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-gray-400" />
                    ) : (
                      <FaEye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {!passwordMatch && (
                  <p className="text-sm text-red-600 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || (mode === "reset" && !passwordMatch)}
              className="w-full inline-flex items-center justify-center px-5 py-2 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium cursor-pointer transition-colors duration-300"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </>
              ) : (
                <>
                  {mode === "login" && "Log in"}
                  {mode === "forgot" && "Send reset link"}
                  {mode === "reset" && "Reset password"}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer links */}
        <div className="text-center text-sm mt-4 space-y-2">
          {mode === "login" && (
            <>
              <button
                onClick={() => setMode("forgot")}
                className="text-gray-800 underline block w-full hover:text-gray-600 transition-colors"
              >
                Forgot your password?
              </button>
            </>
          )}

          {(mode === "forgot" || mode === "reset") && (
            <button
              onClick={() => setMode("login")}
              className="text-gray-600 underline block w-full hover:text-gray-800 transition-colors"
            >
              Back to login
            </button>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-400 text-center">
          Property Rent Management &copy; 2025
        </div>
      </div>
    </div>
  );
}
