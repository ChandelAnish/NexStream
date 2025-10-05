"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ref,
  set,
  onValue,
  push,
  onDisconnect,
  serverTimestamp,
  DataSnapshot,
  remove,
  DatabaseReference,
} from "firebase/database";
import { realtimeDB } from "../../../../firebase/config";
import { useSignal } from "@/contexts/SignalContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Video, VideoOff, Phone, StopCircle, 
  User, Clock, AlertTriangle 
} from "lucide-react";
import { IoMdRecording } from "react-icons/io";

type AlertType = {
  message: string;
  type: "info" | "success" | "error";
  id: string;
};

const RoomPage: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef(new MediaStream());
  const isInitiator = useRef(false);
  const [roomRef, setRoomRef] = useState<DatabaseReference | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);

  const { callResponse, updateCallStatus, ringingCallee } = useSignal();
  const router = useRouter();

  // Show alert function
  const showAlert = (message: string, type: "info" | "success" | "error") => {
    const id = Math.random().toString(36).substring(2, 9);
    setAlerts((prev) => [...prev, { message, type, id }]);
    
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 5000);
  };

  // Format time function
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours > 0 ? String(hours).padStart(2, '0') : null,
      String(minutes).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  useEffect(() => {
    if (
      callResponse === "rejected" ||
      callResponse === "disconnected" ||
      callResponse === null
    ) {
      console.log(callResponse ? callResponse : "No connection established");
      router.push(`/videoCalling`);
    } else {
      // console.log(callResponse);
      const roomRef = ref(realtimeDB, `rooms/${roomName}`);
      setRoomRef(roomRef);
      // const offerRef = ref(realtimeDB, `rooms/${roomName}/offer`);
      const answerRef = ref(realtimeDB, `rooms/${roomName}/answer`);
      const callerCandidatesRef = ref(
        realtimeDB,
        `rooms/${roomName}/callerCandidates`
      );
      const calleeCandidatesRef = ref(
        realtimeDB,
        `rooms/${roomName}/calleeCandidates`
      );

      const setupConnection = async () => {
        peerConnection.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            const candidatesRef = isInitiator.current
              ? callerCandidatesRef
              : calleeCandidatesRef;
            push(candidatesRef, event.candidate.toJSON());
          }
        };

        peerConnection.current.ontrack = (event) => {
          // console.log("Remote track received:", event.streams[0]);
          event.streams[0].getTracks().forEach((track) => {
            // console.log("Adding remote track to stream:", track.kind);
            remoteStream.current.addTrack(track);
          });
          setIsRemoteConnected(true);
          
          // Start the meeting duration timer when connection is established
          if (!durationInterval.current) {
            durationInterval.current = setInterval(() => {
              setMeetingDuration((prev) => prev + 1);
            }, 1000);
          }
        };

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream.current;
        }
      };

      const openUserMedia = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          localStream.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          stream.getTracks().forEach((track) => {
            peerConnection.current?.addTrack(track, stream);
          });
        } catch (err) {
          console.error("Error accessing media devices:", err);
          showAlert("Failed to access camera or microphone", "error");
        }
      };

      const start = async () => {
        const snapshot: DataSnapshot = await new Promise((resolve) =>
          onValue(roomRef, resolve, { onlyOnce: true })
        );

        if (!snapshot.exists()) {
          isInitiator.current = true;

          await setupConnection();
          await openUserMedia();

          const offer = await peerConnection.current!.createOffer();
          await peerConnection.current!.setLocalDescription(offer);
          await set(roomRef, {
            offer,
            createdAt: serverTimestamp(),
          });

          onValue(answerRef, async (answerSnap) => {
            if (
              answerSnap.exists() &&
              peerConnection.current?.signalingState !== "closed"
            ) {
              const answer = new RTCSessionDescription(answerSnap.val());
              await peerConnection.current?.setRemoteDescription(answer);
            }
          });
          ringingCallee(roomName)
          console.log("ready")
        } else {
          await setupConnection();
          await openUserMedia();
          const roomData = snapshot.val();
          const offer = roomData.offer;
          await peerConnection.current!.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          const answer = await peerConnection.current!.createAnswer();
          await peerConnection.current!.setLocalDescription(answer);
          await set(answerRef, answer);
        }

        onValue(callerCandidatesRef, (snapshot) => {
          snapshot.forEach((child) => {
            const candidate = new RTCIceCandidate(child.val());
            peerConnection.current?.addIceCandidate(candidate);
          });
        });

        onValue(calleeCandidatesRef, (snapshot) => {
          snapshot.forEach((child) => {
            const candidate = new RTCIceCandidate(child.val());
            peerConnection.current?.addIceCandidate(candidate);
          });
        });

        onDisconnect(roomRef).remove();

        onValue(roomRef, (snapshot) => {
          if (!snapshot.exists()) {
            console.log("Room was removed (disconnected).");
            if (isRecording) {
              stopRecording();
            }
            updateCallStatus("disconnected");
          }
        });
      };

      start();
    }

    return () => {
      peerConnection.current?.close();
      peerConnection.current = null;
      localStream.current?.getTracks().forEach((track) => track.stop());
      stopRecording();
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, [roomName]);

  const handleEndCall = () => {
    if (isRecording) {
      stopRecording();
    }
    updateCallStatus("disconnected");
    if (roomRef) {
      remove(roomRef);
      console.log("Room was removed (disconnected).");
    }
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      const audioTracks = localStream.current.getAudioTracks();

      // Get the new state (opposite of current state)
      const newMuteState = !isAudioMuted;

      // Enable/disable the tracks based on mute state
      audioTracks.forEach((track) => {
        track.enabled = !newMuteState; // enabled = true when not muted
      });

      // Update the state
      setIsAudioMuted(newMuteState);

      // Find the sender in the peer connection that corresponds to the audio track
      if (peerConnection.current) {
        const senders = peerConnection.current.getSenders();
        senders.forEach((sender) => {
          if (sender.track && sender.track.kind === "audio") {
            sender.track.enabled = !newMuteState; // enabled = true when not muted
          }
        });
      }
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTracks = localStream.current.getVideoTracks();

      // Get the new state (opposite of current state)
      const newVideoOffState = !isVideoOff;

      // Enable/disable the tracks based on video off state
      videoTracks.forEach((track) => {
        track.enabled = !newVideoOffState; // enabled = true when video is on
      });

      // Update the state
      setIsVideoOff(newVideoOffState);

      // Find the sender in the peer connection that corresponds to the video track
      if (peerConnection.current) {
        const senders = peerConnection.current.getSenders();
        senders.forEach((sender) => {
          if (sender.track && sender.track.kind === "video") {
            sender.track.enabled = !newVideoOffState; // enabled = true when video is on
          }
        });
      }
    }
  };

  const startRecording = () => {
    if (!localStream.current && !remoteStream.current) return;

    // Create a new stream that combines both local and remote audio
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    // Add local audio tracks
    if (localStream.current) {
      const localAudioSource = audioContext.createMediaStreamSource(
        localStream.current
      );
      localAudioSource.connect(destination);
    }

    // Add remote audio tracks
    const remoteAudioSource = audioContext.createMediaStreamSource(
      remoteStream.current
    );
    remoteAudioSource.connect(destination);

    // Create a MediaRecorder to record the combined audio
    audioChunks.current = [];
    mediaRecorder.current = new MediaRecorder(destination.stream);

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create a download link for the audio recording
      const downloadLink = document.createElement("a");
      downloadLink.href = audioUrl;
      downloadLink.download = `call-recording-${roomName}-${new Date().toISOString()}.wav`;
      downloadLink.click();

      // Clean up
      audioChunks.current = [];
      setIsRecording(false);
      
      showAlert("Recording downloaded successfully", "success");
    };

    // Start recording
    mediaRecorder.current.start();
    setIsRecording(true);
    showAlert("Recording started", "info");
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      showAlert("Recording stopped", "info");
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-white text-xl font-medium">
            Teleconsultation Room
          </h1>
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
            {roomName}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full">
            <Clock size={16} className="text-gray-300 mr-2" />
            <span className="text-gray-300 text-sm font-medium">
              {formatTime(meetingDuration)}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-6 flex flex-col">
        {/* Alerts */}
        <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-md">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className={`p-4 rounded-lg shadow-lg flex items-center ${
                  alert.type === "error"
                    ? "bg-red-500 text-white"
                    : alert.type === "success"
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {alert.type === "error" ? (
                  <AlertTriangle size={20} className="mr-2" />
                ) : (
                  <AlertTriangle size={20} className="mr-2" />
                )}
                <span>{alert.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Video grid */}
        <div className="relative flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* Local video */}
          <div className="relative h-full min-h-64 rounded-xl overflow-hidden bg-gray-800 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
                <User size={80} className="text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-70 px-3 py-1 rounded-lg text-white text-sm flex items-center">
              <span>You</span>
              {isAudioMuted && <MicOff size={16} className="ml-2 text-red-500" />}
            </div>
          </div>

          {/* Remote video */}
          <div className="relative h-full min-h-64 rounded-xl overflow-hidden bg-gray-800 shadow-lg">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!isRemoteConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <User size={80} className="text-gray-400" />
                </motion.div>
                <p className="mt-4 text-gray-300">Waiting for participant to join...</p>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-70 px-3 py-1 rounded-lg text-white text-sm">
              <span>Participant</span>
            </div>
          </div>
        </div>

        {/* Control bar */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-800 rounded-full flex items-center p-2 shadow-lg">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-2 ${
                isAudioMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {isAudioMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-2 ${
                isVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {isVideoOff ? <VideoOff size={20} className="text-white" /> : <Video size={20} className="text-white" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-2 ${
                isRecording ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {isRecording ? <StopCircle size={20} className="text-white" /> : <IoMdRecording size={20} className="text-white" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleEndCall}
              className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center mx-2"
            >
              <Phone size={24} className="text-white transform rotate-135" />
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomPage;