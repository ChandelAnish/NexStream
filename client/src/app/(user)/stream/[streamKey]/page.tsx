// app/stream/[streamKey]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { io, Socket } from "socket.io-client";

// Interface for a chat message
interface ChatMessage {
  username: string;
  text: string;
}

interface StreamInfo {
  id: string;
  streamKey: string;
  viewers: number;
  duration: number;
  bitrate: number;
  fps: number;
  thumbnail: string;
  hlsUrl: string;
  resolutions: Array<{
    name: string;
    url: string;
  }>;
}

export default function StreamPage() {
  const params = useParams();
  const streamKey = params.streamKey as string;
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1); // -1 for auto
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- CHAT STATE ---
  const socketRef = useRef<Socket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState(
    `Guest${Math.floor(Math.random() * 1000)}`
  );
  // --- END CHAT STATE ---

  // Effect for fetching stream metadata (runs periodically)
  useEffect(() => {
    if (!streamKey) return;

    const fetchStreamInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/streams/${streamKey}`
        );
        if (!response.ok) {
          throw new Error("Stream not found or has ended.");
        }
        const data: StreamInfo = await response.json();
        setStreamInfo(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load stream details."
        );
        // Stop polling if the stream is not found
        clearInterval(interval);
      }
    };

    fetchStreamInfo();
    const interval = setInterval(fetchStreamInfo, 5000); // Update stats every 5 seconds

    return () => clearInterval(interval);
  }, [streamKey]);

  // Effect for initializing and destroying the HLS player (runs only once)
  useEffect(() => {
    if (!streamKey || !videoRef.current) return;

    const video = videoRef.current;
    const hlsUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/hls/${streamKey}/master.m3u8`;

    // Ensure we only initialize HLS once
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        // Optimized configuration for low-latency and stability
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        startLevel: -1, // Start with auto quality
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => {
          console.log("Autoplay was prevented:", err);
        });
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error(
                "Fatal network error encountered, trying to recover",
                data
              );
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error(
                "Fatal media error encountered, trying to recover",
                data
              );
              hls.recoverMediaError();
              break;
            default:
              console.error("An unrecoverable error occurred", data);
              setError("Failed to load the stream. It may have ended.");
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support for Safari
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((err) => {
          console.log("Autoplay was prevented:", err);
        });
        setIsLoading(false);
      });
    } else {
      setError("HLS is not supported in this browser");
    }

    // Cleanup function to destroy HLS instance on component unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamKey]); // Only re-run if the streamKey changes (i.e., navigating to a new stream)

  // --- CHAT EFFECT ---
  // Effect for initializing and destroying the Socket.IO connection
  useEffect(() => {
    if (!streamKey || !process.env.NEXT_PUBLIC_API_URL) return;

    // Connect to the socket server
    const socket = io(process.env.NEXT_PUBLIC_API_URL);
    socketRef.current = socket;

    // Join the specific stream's chat room
    socket.emit("join_room", streamKey);

    // Listen for incoming messages
    socket.on("receive_message", (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.emit("leave_room", streamKey);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [streamKey]);

  // Effect for auto-scrolling the chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  // --- END CHAT EFFECT ---

  // Effect for handling quality changes
  useEffect(() => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = selectedQuality;
    }
  }, [selectedQuality]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [
      h > 0 ? h : null,
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  // Function to send a chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current) {
      const messageData: ChatMessage = {
        username: username,
        text: newMessage.trim(),
      };

      // Emit the message to the server
      socketRef.current.emit("send_message", {
        streamKey,
        message: messageData,
      });

      // Clear the input field
      setNewMessage("");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Stream Error</h1>
          <p className="text-white text-lg">{error}</p>
          <Link
            href="/"
            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-75">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="text-white mt-4">Loading stream...</p>
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                className="w-full aspect-video"
                controls
                autoPlay
                muted
                playsInline // Important for mobile autoplay
              />

              <div className="absolute top-4 left-4 flex items-center space-x-4 z-20">
                <div className="bg-red-600 px-3 py-1 rounded text-white font-semibold">
                  LIVE
                </div>
                <div className="bg-black bg-opacity-50 px-3 py-1 rounded text-white flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {streamInfo?.viewers ?? 0}
                </div>
                <div className="bg-black bg-opacity-50 px-3 py-1 rounded text-white">
                  {formatDuration(streamInfo?.duration ?? 0)}
                </div>
              </div>

              {streamInfo && streamInfo.resolutions.length > 0 && (
                <div className="absolute top-4 right-4 z-20">
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(Number(e.target.value))}
                    className="bg-black bg-opacity-50 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value={-1}>Auto</option>
                    {streamInfo.resolutions.map((res, index) => (
                      <option key={res.name} value={index}>
                        {res.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="mt-3 bg-gray-800 rounded-lg p-5">
              <h1 className="text-2xl font-bold text-white mb-4">
                Stream: {streamKey}
              </h1>
              {streamInfo && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-300">
                  {/* Info panels */}
                </div>
              )}
            </div>
          </div>

          {/* --- UPDATED CHAT UI --- */}
          <div className="xl:col-span-1">
            <div className="bg-gray-800 rounded-lg flex flex-col min-h-[500px] md:min-h-[600px] max-h-[500px] md:max-h-[600px] xl:h-full">
              <h2 className="text-xl font-bold text-white p-4 border-b border-gray-700">
                Stream Chat
              </h2>
              {/* Username Input */}
              <div className="p-4 border-b border-gray-700 flex-shrink-0">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300"
                >
                  Nickname
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                  maxLength={20}
                />
              </div>
              {/* Message List */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 space-y-2 overflow-y-auto"
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className="text-gray-200 text-sm break-words"
                  >
                    <span
                      className="font-bold"
                      style={{
                        color: `hsl(${
                          msg.username
                            .split("")
                            .reduce((a, b) => a + b.charCodeAt(0), 0) % 360
                        }, 70%, 70%)`,
                      }}
                    >
                      {msg.username}:
                    </span>{" "}
                    <span>{msg.text}</span>
                  </div>
                ))}
              </div>
              {/* Message Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-700 flex-shrink-0"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 min-w-0 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={!newMessage.trim() || !username.trim()}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* --- END UPDATED CHAT UI --- */}
        </div>
      </div>
    </div>
  );
}