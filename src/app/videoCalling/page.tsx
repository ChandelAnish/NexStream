"use client";
import { useSignal } from "@/contexts/SignalContext";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const router = useRouter()
  const {onlineUsers, call, callCredentials, updateCallStatus, roomName, callResponse} = useSignal();

  const handleCall = (uid: string) => {
    call(uid);
  };

  const handleAnswerCall = () =>{
    updateCallStatus("connected")
    router.push(`/videoCalling/${roomName}`)
  }

  console.log(onlineUsers);

  return (
    <div className="w-full min-h-0 overflow-auto">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-10 pt-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl mb-6 shadow-2xl shadow-purple-500/25">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Video Calling Hub
          </h1>
          <p className="text-xl text-gray-400">Connect with people instantly</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Call Status Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Call Status</p>
                  <p className="text-white text-lg font-semibold">
                    {callResponse ? callResponse : "No connection established"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Room Name Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Room Name</p>
                  <p className="text-white text-lg font-semibold">
                    {roomName || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Online Users Section */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl blur opacity-20"></div>
          <div className="relative bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Online Users</h2>
                  <p className="text-gray-400">Click on any user to start a call</p>
                </div>
              </div>
              
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold">{onlineUsers.length} Online</span>
                </div>
              </div>
            </div>

            {/* Users List */}
            {onlineUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {onlineUsers.map((item, index) => (
                  <div
                    key={item}
                    onClick={() => handleCall(item)}
                    className="group relative cursor-pointer transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                    <div className="relative bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 group-hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300">
                      <div className="text-center">
                        {/* Avatar */}
                        <div className="relative mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300">
                            <span className="text-xl font-bold text-white">
                              {item.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {/* Online indicator */}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-gray-700 rounded-full">
                            <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        
                        {/* User Info */}
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                          {item}
                        </h3>
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <p className="text-green-400 text-sm font-medium">Available</p>
                        </div>
                        
                        {/* Call Button */}
                        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>Call</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-700/50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No users online</h3>
                <p className="text-gray-400">Users will appear here when they come online</p>
              </div>
            )}
          </div>
        </div>

        {/* Incoming Call Modal */}
        {callCredentials?.callStatus === "ringing" && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-75"></div>
              <div className="relative bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={() => updateCallStatus("rejected")}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="text-center">
                  {/* Animated Call Icon */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                      <svg className="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    {/* Ripple Effects */}
                    <div className="absolute inset-0 rounded-2xl border-4 border-green-500/30 animate-ping"></div>
                    <div className="absolute inset-0 rounded-2xl border-4 border-blue-500/20 animate-ping" style={{animationDelay: '0.5s'}}></div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">Incoming Call</h3>
                  <p className="text-gray-400 mb-8">Someone is calling you</p>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleAnswerCall}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Answer</span>
                    </button>
                    
                    <button
                      onClick={() => updateCallStatus("rejected")}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animation-delay-2s {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}