"use client";

import { useSignal } from "@/contexts/SignalContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to get user UID
import { motion } from "framer-motion";
import {
  User,
  Clipboard,
  Check,
  PhoneForwarded,
  Phone,
  PhoneIncoming,
  PhoneOff,
  X,
  Search,
  Globe,
} from "lucide-react";

// Stagger animation variants (from dashboard)
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Page() {
  const router = useRouter();
  const {
    onlineUsers,
    call,
    callCredentials,
    updateCallStatus,
    // callResponse and roomName are no longer used in the UI
  } = useSignal();
  const { user } = useAuth(); // Get the currently authenticated user

  const [callUid, setCallUid] = useState(""); // State for the input field
  const [isCopied, setIsCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const handleCall = (uid: string) => {
    if (uid) {
      call(uid);
    }
  };

  const handleAnswerCall = () => {
    updateCallStatus("connected");
    // We get roomName from callCredentials, not context state
    if (callCredentials?.roomName) {
      router.push(`/videoCalling/${callCredentials.roomName}`);
    }
  };

  const handleRejectCall = () => {
    updateCallStatus("rejected");
  };

  const handleCopyToClipboard = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Filter online users based on search term and exclude self
  const filteredUsers = onlineUsers.filter(
    (uid) =>
      uid !== user?.uid && // Don't show self
      uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Wrapper for side-by-side cards */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Card for This User's ID */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 lg:w-1/2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Your User ID</h2>
              </div>
              <button
                onClick={handleCopyToClipboard}
                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Clipboard className="w-4 h-4" />
                )}
                <span>{isCopied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <p className="font-mono text-base text-cyan-400 p-4 bg-slate-900 rounded-lg break-all">
              {user?.uid || "Loading..."}
            </p>
          </div>

          {/* Card to Call by UID */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 lg:w-1/2">
            <div className="flex items-center space-x-3 mb-4">
              <PhoneForwarded className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">
                Call a User by ID
              </h2>
            </div>
            <p className="text-slate-400 mb-4">
              Paste another user&apos;s ID below to start a call.
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                value={callUid}
                onChange={(e) => setCallUid(e.target.value)}
                placeholder="Enter user ID..."
                className="flex-grow bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                onClick={() => handleCall(callUid)}
                disabled={!callUid.trim()}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Phone className="w-5 h-5" />
                <span>Call</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card for Online Users (Full width below) */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Online Users</h2>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user ID..."
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <Search className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Scrollable User List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-4 bg-slate-900 rounded-lg"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                    <span className="font-mono text-slate-300 text-sm break-all">
                      {item}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCall(item)}
                    title={`Call ${item}`}
                    className="flex-shrink-0 ml-4 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-1.5"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">
                {onlineUsers.length > 0
                  ? "No users match your search."
                  : "No other users are currently online."}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Incoming Call Modal (Unchanged) */}
      {callCredentials?.callStatus === "ringing" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700/50"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleRejectCall}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-6 h-6" />
              <span className="sr-only">Close modal</span>
            </button>

            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center animate-pulse">
                <PhoneIncoming className="w-8 h-8 text-cyan-400" />
              </div>

              {/* Text */}
              <h3 className="mb-2 text-2xl font-bold text-white">
                Incoming Call
              </h3>
              <p className="mb-6 text-lg text-slate-300 break-words">
                <strong className="font-mono text-cyan-400">
                  {callCredentials.caller ? callCredentials.caller : "Someone"}
                </strong>{" "}
                is calling.
              </p>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRejectCall}
                  className="flex-1 px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <PhoneOff className="w-5 h-5" />
                    <span>Reject</span>
                  </div>
                </button>
                <button
                  onClick={handleAnswerCall}
                  className="flex-1 px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Answer</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
