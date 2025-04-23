"use-client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// Create a context for the socket connection
export const SocketContext = createContext();

// Hook to use the socket context
export const useSocket = () => useContext(SocketContext);

// Socket Provider component
export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null); // Reference to store socket instance
  const [socket, setSocket] = useState(null); // Socket state

  useEffect(() => {
    // Initialize socket connection on mount
    const socketInstance = io("http://localhost:5000"); // Replace with your backend URL
    socketRef.current = socketInstance;
    setSocket(socketInstance); // Set socket state

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Provide socket instance through context
  return (
    <SocketContext.Provider value={{ socket, socketRef }}>
      {children}
    </SocketContext.Provider>
  );
};
