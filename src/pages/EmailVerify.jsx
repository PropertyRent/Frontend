import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { AuthContext } from "../stores/authStore";

export default function EmailVerify() {
  const { token } = useParams();
  const { verifyEmail, loading, error, success, clearError } = useContext(AuthContext);
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setVerificationStatus("error");
    }
  }, [token]);

  const handleVerification = async () => {
    try {
      clearError();
      verifyEmail(token);
      setVerificationStatus("success");
    } catch (error) {
      setVerificationStatus("error");
    }
  };

  const retryVerification = () => {
    setVerificationStatus("verifying");
    handleVerification();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Back to Home Button */}
      <Link 
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-[var(--color-darker)] hover:text-[var(--color-darkest)] transition-colors"
      >
        <FaArrowLeft />
        <span className="text-sm">Back to Home</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/Logo_1.png" 
            alt="PropertyRent" 
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Verification Status */}
        {verificationStatus === "verifying" && (
          <>
            <div className="mb-6">
              <FaSpinner className="mx-auto text-4xl text-[var(--color-secondary)] animate-spin" />
            </div>
            <h1 className="text-2xl font-light text-gray-700 mb-4">
              Verifying Your Email
            </h1>
            <p className="text-gray-500 mb-6">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {verificationStatus === "success" && (
          <>
            <div className="mb-6">
              <FaCheckCircle className="mx-auto text-4xl text-green-500" />
            </div>
            <h1 className="text-2xl font-light text-gray-700 mb-4">
              Email Verified Successfully!
            </h1>
            <p className="text-gray-500 mb-6">
              {success || "Your email has been verified. You can now access your account."}
            </p>
            <div className="space-y-3">
              <Link
                to="/admin-login"
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white font-medium transition-colors duration-300"
              >
                Go to Login
              </Link>
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-light)] font-medium transition-colors duration-300"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}

        {verificationStatus === "error" && (
          <>
            <div className="mb-6">
              <FaTimesCircle className="mx-auto text-4xl text-red-500" />
            </div>
            <h1 className="text-2xl font-light text-gray-700 mb-4">
              Verification Failed
            </h1>
            <div className="mb-6">
              <p className="text-gray-500 mb-4">
                {error || "We couldn't verify your email address. This could be because:"}
              </p>
              {!error && (
                <ul className="text-sm text-gray-400 text-left space-y-1">
                  <li>• The verification link has expired</li>
                  <li>• The verification link is invalid</li>
                  <li>• Your email has already been verified</li>
                </ul>
              )}
            </div>
            <div className="space-y-3">
              <button
                onClick={retryVerification}
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors duration-300"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Retrying...
                  </>
                ) : (
                  "Try Again"
                )}
              </button>
              <Link
                to="/admin-login"
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-light)] font-medium transition-colors duration-300"
              >
                Go to Login
              </Link>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400">
          Property Rent Management &copy; 2025
        </div>
      </div>
    </div>
  );
}