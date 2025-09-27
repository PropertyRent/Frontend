import React, { useContext, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../stores/authStore";

const appURL = import.meta.env.VITE_APP_URL;

export default function OwnerPortalAuth() {
  const [mode, setMode] = useState("login");

  const { user, loading, error, loginAdmin, navigate } = useContext(AuthContext);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password ? e.target.password.value : null;
    if (mode === "login") {
      console.log("Form submitted!!");
      loginAdmin({ email, password });
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Link to="/">
        <FaArrowLeft className="absolute top-4 left-4 text-[var(--color-darker)] cursor-pointer hover:text-[var(--color-darkest)]" />
      </Link>
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/" alt="PropertyRent" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-light text-center text-gray-700 mb-2">
          {mode === "login" && "Welcome to the Admin Portal"}
          {mode === "signup" && "Create your account"}
          {mode === "reset" && "Reset your password"}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {mode === "login" && "Log in with your account credentials below."}
          {mode === "signup" &&
            "Fill in the form to create a new password and register."}
          {mode === "reset" && "Enter your email to reset your password."}
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email always present */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password fields only for login/signup */}
          {(mode === "login" || mode === "signup") && (
            <>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-600 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              {/* {mode === "signup" && (
                <div>
                  <label htmlFor="confirm" className="block text-sm text-gray-600 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              )} */}
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-5 py-2 rounded-full bg-[var(--color-light-brown)] text-white font-medium hover:bg-[var(--color-dark)] cursor-pointer transition duration-300"
            >
              {mode === "login" && loading ? "Logging in..." : "Log in"}
              {/* {mode === "signup" && "Sign up"} */}
              {mode === "reset" && "Send reset link"}
            </button>
          </div>
        </form>

        {/* Footer links */}
        <div className="text-center text-sm mt-4 space-y-2">
          {mode === "login" && (
            <>
              {/* <button
                onClick={() => setMode("signup")}
                className="text-gray-800 underline block w-full"
              >
                Create a password
              </button> */}
              <button
                onClick={() => setMode("reset")}
                className="text-gray-800 underline block w-full"
              >
                Forgot your password?
              </button>
            </>
          )}

          {(mode === "signup" || mode === "reset") && (
            <button
              onClick={() => setMode("login")}
              className="text-gray-600 underline block w-full"
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
