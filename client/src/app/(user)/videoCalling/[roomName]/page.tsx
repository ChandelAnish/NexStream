"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAgora } from '@/contexts/AgoraContext';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  MonitorOff,
  Copy,
  Check,
  Users,
} from 'lucide-react';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';

export default function VideoRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomName = params.roomName as string;
  
  const {
    localVideoTrack,
    remoteUsers,
    isMuted,
    isVideoOff,
    isScreenSharing,
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
  } = useAgora();

  const localVideoRef = useRef<HTMLDivElement>(null);
  const screenShareRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (roomName) {
      joinChannel(roomName);
    }

    return () => {
      leaveChannel();
    };
  }, [roomName]);

  useEffect(() => {
    if (localVideoTrack && localVideoRef.current && !isScreenSharing) {
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack, isScreenSharing]);

  const handleLeave = async () => {
    await leaveChannel();
    router.push('/videoCalling');
  };

  const handleCopyRoomName = () => {
    navigator.clipboard.writeText(roomName);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const RemoteVideo = ({ user }: { user: IAgoraRTCRemoteUser }) => {
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (user.videoTrack && videoRef.current) {
        user.videoTrack.play(videoRef.current);
      }

      return () => {
        if (user.videoTrack) {
          user.videoTrack.stop();
        }
      };
    }, [user]);

    return (
      <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video">
        <div ref={videoRef} className="w-full h-full" />
        {!user.videoTrack && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-white">
                  {String(user.uid).charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
          <span className="text-white text-sm font-medium">
            User {user.uid}
          </span>
        </div>
      </div>
    );
  };

  // Determine layout based on screen sharing
  const renderLayout = () => {
    if (isScreenSharing) {
      // Google Meet style: Screen share takes main area, participants in sidebar
      return (
        <div className="flex gap-4 h-[calc(100vh-200px)]">
          {/* Main screen share area */}
          <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden">
            <div ref={screenShareRef} className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Monitor className="w-16 h-16 text-cyan-400 mx-auto mb-3" />
                <p className="text-white text-lg font-medium">Sharing your screen</p>
              </div>
            </div>
          </div>

          {/* Sidebar with participants */}
          <div className="w-80 space-y-3 overflow-y-auto">
            {/* Local video thumbnail */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video"
            >
              <div ref={localVideoRef} className="w-full h-full" />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <VideoOff className="w-12 h-12 text-slate-600" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md">
                <span className="text-white text-xs font-medium">You</span>
              </div>
            </motion.div>

            {/* Remote users */}
            {remoteUsers.map((user) => (
              <motion.div
                key={user.uid}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <RemoteVideo user={user} />
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    // Normal grid layout when not screen sharing
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video"
        >
          <div ref={localVideoRef} className="w-full h-full" />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <VideoOff className="w-16 h-16 text-slate-600" />
            </div>
          )}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
            <span className="text-white text-sm font-medium">You</span>
          </div>
        </motion.div>

        {remoteUsers.map((user) => (
          <motion.div
            key={user.uid}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <RemoteVideo user={user} />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl px-4 py-2 border border-slate-700/50">
              <h1 className="text-white font-semibold text-lg">Room: {roomName}</h1>
            </div>
            <button
              onClick={handleCopyRoomName}
              className="bg-slate-800/50 backdrop-blur-lg rounded-xl px-3 py-2 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
              title="Copy room name"
            >
              {isCopied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-lg rounded-xl px-4 py-2 border border-slate-700/50">
            <Users className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-medium">
              {remoteUsers.length + 1} {remoteUsers.length === 0 ? 'participant' : 'participants'}
            </span>
          </div>
        </motion.div>

        {/* Video Layout */}
        {renderLayout()}

        {/* Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-4 border border-slate-700/50 shadow-2xl">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMute}
                className={`p-4 rounded-xl transition-all ${
                  isMuted
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-4 rounded-xl transition-all ${
                  isVideoOff
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
              >
                {isVideoOff ? (
                  <VideoOff className="w-6 h-6 text-white" />
                ) : (
                  <Video className="w-6 h-6 text-white" />
                )}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-4 rounded-xl transition-all ${
                  isScreenSharing
                    ? 'bg-cyan-500 hover:bg-cyan-600'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
              >
                {isScreenSharing ? (
                  <MonitorOff className="w-6 h-6 text-white" />
                ) : (
                  <Monitor className="w-6 h-6 text-white" />
                )}
              </button>

              <div className="w-px h-8 bg-slate-600" />

              <button
                onClick={handleLeave}
                className="p-4 rounded-xl bg-red-500 hover:bg-red-600 transition-all"
                title="Leave call"
              >
                <PhoneOff className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}