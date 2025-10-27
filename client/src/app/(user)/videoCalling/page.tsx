"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Users } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Page() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");

  const handleJoinRoom = () => {
    if (roomName.trim()) {
      router.push(`/videoCalling/${roomName.trim()}`);
    }
  };

  const handleCreateRoom = () => {
    const newRoomName = `room-${Date.now()}`;
    router.push(`/videoCalling/${newRoomName}`);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto"
    >
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-8 h-8 text-cyan-400" />
          <h2 className="text-3xl font-bold text-white">Group Video Call</h2>
        </div>
        <p className="text-slate-400 mb-6">
          Create a new room or join an existing one.
        </p>
        <div className="space-y-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              placeholder="Enter room name..."
              className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleJoinRoom}
              disabled={!roomName.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Phone className="w-5 h-5" />
              <span>Join</span>
            </button>
          </div>
          <button
            onClick={handleCreateRoom}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Create New Room</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}