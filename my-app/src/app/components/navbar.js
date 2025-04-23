"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { FiBell } from "react-icons/fi"; // Using Feather icon from React Icons

export default function Navbar() {
  const { socket } = useSocket();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = ({ notification, count }) => {
      console.log("Notification received:", notification);
      setNotificationCount(count);
    };

    socket.on("receive_notification", handleNotification);
    return () => socket.off("receive_notification", handleNotification);
  }, [socket]);

  return (
    <nav className="navbar fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 bg-white text-gray-800 shadow-md z-50">
      <div className="navbar__logo text-lg font-semibold">Skill Swap</div>
      <div className="navbar__notifications relative">
        <FiBell className="text-gray-700 text-xl" />
        {notificationCount > 0 && (
          <span className="notification__badge absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {notificationCount}
          </span>
        )}
      </div>
    </nav>
  );
}
