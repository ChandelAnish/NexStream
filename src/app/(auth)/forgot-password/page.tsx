"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { FirebaseError } from "firebase/app"; // Import from firebase/app instead
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
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // First check if the user exists with this email
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      
      // If the array is empty, no user exists with this email
      if (!signInMethods.length) {
        setError("No user found with this email address");
        setIsLoading(false);
        return;
      }
      
      // User exists, proceed with sending reset email
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
      // Attempt to sign in with the email and the new password
      await signInWithEmailAndPassword(auth, email, newPassword);
      // Redirect to dashboard or home page after successful login
      router.push("/dashboard"); // Change this to your app's home route
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
    <div className="min-h-screen w-full flex items-center justify-center bg-teal-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl flex overflow-hidden rounded-lg shadow-lg"
      >
        <div className="w-1/6 bg-teal-800"></div>
        <div className="w-4/6 bg-white px-24 py-20">
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center text-teal-800 mb-2"
          >
            Forgot password
          </motion.h1>

          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-600 text-center mb-16"
          >
            Input your email to recover password
          </motion.p>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 text-sm text-center mb-4"
            >
              {successMessage}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center mb-4"
            >
              {error}
            </motion.div>
          )}
          <div className="flex flex-col gap-16">
            {/* send new password */}
            <div>
              <div className="mb-5">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-1 focus:ring-teal-600 pl-10"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetPassword}
                className="w-full bg-teal-800 text-white py-3 rounded-full hover:bg-teal-700 transition-colors text-center mb-8"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send new Password"}
              </button>
            </div>

            {/* login */}
            <div>
              <div className="mb-5">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-1 focus:ring-teal-600 pl-10"
                    placeholder="New Password From Email"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    readOnly={!emailSent}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                        className="h-5 w-5 text-gray-400"
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
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-teal-800 text-white py-3 rounded-full transition-colors text-center"
                disabled={!emailSent || isSigningIn}
                style={{
                  backgroundColor:
                    emailSent && !isSigningIn ? "#05605e" : "#9DC3C1",
                  cursor: emailSent && !isSigningIn ? "pointer" : "not-allowed",
                }}
              >
                {isSigningIn ? "Signing in..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/6 bg-teal-800"></div>
      </motion.div>
    </div>
  );
}