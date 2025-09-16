"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../../../../firebase/config";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      
      if (!signInMethods.length) {
        setError("No user found with this email address");
        setIsLoading(false);
        return;
      }
      
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      setSuccessMessage("Password reset email sent successfully!");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-email") {
          setError("Please enter a valid email address");
        } else {
          setError("Failed to send password reset email. Please try again.");
        }
      } else {
        setError("Failed to send password reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (isSigningIn || !emailSent || !newPassword) return;

    setIsSigningIn(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, newPassword);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/wrong-password") {
          setError(
            "Incorrect password. Please make sure you entered the new password from your email."
          );
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many failed login attempts. Please try again later.");
        } else {
          setError(
            "Failed to sign in. Please check your credentials and try again."
          );
        }
      } else {
        setError(
          "Failed to sign in. Please check your credentials and try again."
        );
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
      >
        {/* Gaming Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-center text-white mb-2"
        >
          Reset Password
        </motion.h1>

        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-slate-400 text-center mb-8"
        >
          Enter your email to recover your password
        </motion.p>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 text-sm text-center mb-4 bg-green-900/20 border border-green-800/50 rounded-lg p-3"
          >
            {successMessage}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm text-center mb-4 bg-red-900/20 border border-red-800/50 rounded-lg p-3"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Send Reset Email Section */}
          <div>
            <div className="relative mb-4">
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 pl-12"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Email"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-slate-400">or</span>
            </div>
          </div>

          {/* Continue with New Password Section */}
          <div>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 pl-12 pr-12 ${
                  !emailSent ? "opacity-50 cursor-not-allowed" : ""
                }`}
                placeholder="New Password From Email"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                readOnly={!emailSent}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-slate-400 hover:text-slate-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-slate-400 hover:text-slate-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </div>
            </div>

            <button
              onClick={handleContinue}
              className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                emailSent && !isSigningIn
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700 transform hover:scale-[1.02]"
                  : "bg-slate-600/50 text-slate-400 cursor-not-allowed"
              }`}
              disabled={!emailSent || isSigningIn}
            >
              {isSigningIn ? "Signing in..." : "Continue"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}