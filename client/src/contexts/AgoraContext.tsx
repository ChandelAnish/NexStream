"use client";

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng';

interface AgoraContextType {
  localVideoTrack: ICameraVideoTrack | null;
  localAudioTrack: IMicrophoneAudioTrack | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  isJoined: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  joinChannel: (channelName: string, token?: string) => Promise<void>;
  leaveChannel: () => Promise<void>;
  toggleMute: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
}

const AgoraContext = createContext<AgoraContextType | undefined>(undefined);

export const useAgora = () => {
  const context = useContext(AgoraContext);
  if (!context) {
    throw new Error('useAgora must be used within AgoraProvider');
  }
  return context;
};

interface AgoraProviderProps {
  children: React.ReactNode;
}

export const AgoraProvider = ({ children }: AgoraProviderProps) => {
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const screenTrackRef = useRef<any>(null);

  useEffect(() => {
    const initClient = async () => {
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        
        if (mediaType === 'video') {
          setRemoteUsers((prev) => {
            const existingUser = prev.find((u) => u.uid === user.uid);
            if (existingUser) {
              return prev.map((u) => (u.uid === user.uid ? user : u));
            }
            return [...prev, user];
          });
        }
        
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        }
      });

      client.on('user-left', (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });
    };

    initClient();

    return () => {
      if (clientRef.current) {
        clientRef.current.removeAllListeners();
      }
    };
  }, []);

  const joinChannel = async (channelName: string, token?: string) => {
    if (!clientRef.current) return;

    try {
      const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
      if (!appId) {
        throw new Error('Agora App ID is not configured');
      }

      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      const uid = await clientRef.current.join(
        appId,
        channelName,
        token || null,
        null
      );

      await clientRef.current.publish([audioTrack, videoTrack]);
      setIsJoined(true);
      
      console.log('Joined channel:', channelName, 'with UID:', uid);
    } catch (error) {
      console.error('Failed to join channel:', error);
      throw error;
    }
  };

  const leaveChannel = async () => {
    if (!clientRef.current) return;

    try {
      if (screenTrackRef.current) {
        screenTrackRef.current.close();
        screenTrackRef.current = null;
        setIsScreenSharing(false);
      }

      localAudioTrack?.close();
      localVideoTrack?.close();
      
      await clientRef.current.leave();
      
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setRemoteUsers([]);
      setIsJoined(false);
      setIsMuted(false);
      setIsVideoOff(false);
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

  const toggleMute = async () => {
    if (!localAudioTrack) return;
    
    await localAudioTrack.setEnabled(isMuted);
    setIsMuted(!isMuted);
  };

  const toggleVideo = async () => {
    if (!localVideoTrack) return;
    
    await localVideoTrack.setEnabled(isVideoOff);
    setIsVideoOff(!isVideoOff);
  };

  const toggleScreenShare = async () => {
    if (!clientRef.current) return;

    try {
      if (isScreenSharing && screenTrackRef.current) {
        await clientRef.current.unpublish([screenTrackRef.current]);
        screenTrackRef.current.close();
        screenTrackRef.current = null;
        
        if (localVideoTrack) {
          await clientRef.current.publish([localVideoTrack]);
        }
        
        setIsScreenSharing(false);
      } else {
        const screenTrack = await AgoraRTC.createScreenVideoTrack({});
        screenTrackRef.current = Array.isArray(screenTrack) ? screenTrack[0] : screenTrack;
        
        if (localVideoTrack) {
          await clientRef.current.unpublish([localVideoTrack]);
        }
        
        await clientRef.current.publish([screenTrackRef.current]);
        setIsScreenSharing(true);

        screenTrackRef.current.on('track-ended', () => {
          toggleScreenShare();
        });
      }
    } catch (error) {
      console.error('Failed to toggle screen share:', error);
    }
  };

  const value: AgoraContextType = {
    localVideoTrack,
    localAudioTrack,
    remoteUsers,
    isJoined,
    isMuted,
    isVideoOff,
    isScreenSharing,
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
  };

  return (
    <AgoraContext.Provider value={value}>
      {children}
    </AgoraContext.Provider>
  );
};