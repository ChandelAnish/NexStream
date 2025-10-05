// contexts/SignalContext.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { realtimeDB } from "../../firebase/config"; // Import your auth instance
import {
  ref,
  set,
  onValue,
  onDisconnect,
  DataSnapshot,
  update,
  remove,
  get,
} from "firebase/database";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

// Define the shape of our authentication context
interface CallCredentials {
  callStatus: string;
  caller: string;
  roomName: string;
  callInitiatedAt: string;
}

interface SignalContextType {
  onlineUsers: string[];
  call: (uid: string) => void;
  callCredentials: CallCredentials | null;
  updateCallStatus: (calleeAnswer: string) => void;
  roomName: string | null;
  callResponse: string | null;
  ringingCallee: (roomName: string) => void;
}

// Create the context
const SignalContext = createContext<SignalContextType | null>(null);

export function SignalProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const router = useRouter();

  const statusRef = ref(realtimeDB, "/status");
  const userStatusRef = ref(realtimeDB, `/status/${auth.user?.uid}`); // Creates a reference in your Firebase Realtime Database at the path /status/{uid}, where uid is the currently logged-in user's unique ID.
  const connectedRef = ref(realtimeDB, ".info/connected");
  const currentUserCallRef = ref(realtimeDB, `/status/${auth.user?.uid}/call`);

  const [callCredentials, setCallCredentials] =
    useState<CallCredentials | null>(null);
  const [callResponse, setCallResponse] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);

  /*
            This creates a reference to a special, hidden path in Firebase called: .info/connected
            This path is:
                -> Read-only
                -> Special — not part of your app’s normal data
                -> Used to track whether the client is currently connected to Firebase’s servers
                -> Firebase automatically keeps this path updated.
                -> When the app is disconnected (e.g., network failure, tab close, offline), it becomes false.
                -> When your app is connected to Firebase, .info/connected becomes true.
      */

  // setting the current user online or offline.
  useEffect(() => {
    if (auth) {
      console.log("current user: ", auth.user?.uid);

      // setUserReference(usersRef)

      const handleConnection = (snap: DataSnapshot) => {
        // This callback runs every time the connection status changes.
        if (snap.val() === true) {
          // snap.val() --> returns the value stored at the Firebase location you're listening to.
          /*
        snap is short for snapshot, and it refers to a DataSnapshot object in Firebase Realtime Database. This object represents the data at a specific location in your database at the time of the event.

        In your code, snap is passed automatically by Firebase when the value at .info/connected changes.
        */

          // Setup disconnect
          onDisconnect(userStatusRef).set({
            // onDisconnect() tells Firebase: "When this user unexpectedly closes the app (or loses internet), automatically mark them offline."
            // onDisconnect(...) is "scheduled" during the connection phase. When the client disconnects, Firebase itself executes the onDisconnect(...) action — your code doesn’t need to run anymore.
            state: "offline",
            last_changed: new Date().toLocaleString(),
          });

          // Set to online
          set(userStatusRef, {
            state: "online",
            last_changed: new Date().toLocaleString(),
          });
        }
        setLoading(false);
      };

      onValue(connectedRef, handleConnection); // We start listening to changes in .info/connected. Every time the user's connection changes, handleConnection runs and it passes in a DataSnapshot object (snap)

      // handle online users
      onValue(statusRef, (snapshot) => {
        const data = snapshot.val();
        const online = [];

        for (const uid in data) {
          if (data[uid].state === "online" && uid != auth.user?.uid) {
            online.push(uid);
          }
        }

        setOnlineUsers(online);
      });

      // handle incoming call
      onValue(currentUserCallRef, (snapshot) => {
        if (snapshot.exists()) {
          console.log("incoming call");
          const data = snapshot.val();
          setCallResponse(data.callStatus);
          setCallCredentials(data);
          setRoomName(data.roomName);
        }
      });

      return () => {
        // Clean up if needed
        set(userStatusRef, {
          state: "offline",
          last_changed: new Date().toLocaleString(),
        });
        setLoading(false);
      };
    }
  }, 
  
  
  []);

  // ringing user
  const ringingCallee = (roomName: string) => {
    const caller = roomName.split("-")[0];
    const callee = roomName.split("-")[1];
    const userCallRef = ref(realtimeDB, `/status/${callee}/call`);
    set(userCallRef, {
      callStatus: "ringing",
      caller,
      roomName,
      callInitiatedAt: new Date().toLocaleString(),
    });
  };

  // calling a user
  const call = (uid: string) => {
    const caller = auth.user?.uid;
    const callee = uid;
    const userCallRef = ref(realtimeDB, `/status/${callee}/call`);
    const roomName = `${caller}-${callee}`;
    setRoomName(roomName);

    set(userCallRef, {
      callStatus: "initiated",
      caller,
      roomName,
      callInitiatedAt: new Date().toLocaleString(),
    });

    router.push(`/videoCalling/${roomName}`);

    // listen to the user response to the call
    onValue(userCallRef, (snapshot) => {
      if (snapshot.exists()) {
        const callStatus = snapshot.val().callStatus;
        setCallResponse(callStatus);
        // console.log(callStatus);
        if (callStatus === "rejected" || callStatus === "disconnected") {
          router.push(`/videoCalling`);
          setRoomName(null);
          remove(userCallRef);
        }
        setCallResponse(callStatus);
      } else {
        router.push(`/videoCalling`);
        setRoomName(null);
      }
    });
  };

  // update Call Status
  const updateCallStatus = async (calleeAnswer: string) => {
    const snapshot = await get(currentUserCallRef);
    if (snapshot.exists()) {
      // update the call status
      update(currentUserCallRef, {
        callStatus: calleeAnswer,
      });
      setCallResponse(calleeAnswer);
      console.log("call status updated");

      // actions according to call state
      if (calleeAnswer === "rejected") {
        setCallResponse("rejected");
        setRoomName(null);
        remove(currentUserCallRef);
      } else if (calleeAnswer === "disconnected") {
        setCallResponse("disconnected");
        setRoomName(null);
        remove(currentUserCallRef);
        router.push(`/videoCalling`);
      }
    } else {
      setCallResponse("disconnected");
      setRoomName(null);
      router.push(`/videoCalling`);
    }
  };

  // Create the value for our context
  const value = {
    onlineUsers: onlineUsers,
    call,
    callCredentials,
    roomName,
    updateCallStatus,
    callResponse,
    ringingCallee
  };

  return (
    <SignalContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </SignalContext.Provider>
  );
}

// Custom hook to use the signal context
export function useSignal() {
  const context = useContext(SignalContext);
  if (!context) {
    throw new Error("useAuth must be used within an SignalProvider");
  }
  return context;
}
