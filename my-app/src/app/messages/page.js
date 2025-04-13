"use client";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // Using an icon for the avatar

export default function MessagingApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState(""); // For handling message input
  const [messages, setMessages] = useState([]); // For storing sent messages

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        time: new Date().toLocaleTimeString(), // Add the current time for each message
        user: "User 1", // You can dynamically assign this based on the active user
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(""); // Clear the input field after sending
    }
  };

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim()) {
      handleSendMessage(); // Call send message when Enter is pressed
      e.preventDefault(); // Prevent adding a new line in the input field
    }
  };

  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* Sidebar (Users) */}
      <div
        className={`bg-gray-100 w-64 p-4 border-r absolute md:relative z-30 h-full transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Users</h3>
        <div className="space-y-2">
          <button className="w-full text-left p-2 bg-white rounded shadow hover:bg-blue-100">
            User 1
          </button>
          <button className="w-full text-left p-2 bg-white rounded shadow hover:bg-blue-100">
            User 2
          </button>
          <button className="w-full text-left p-2 bg-white rounded shadow hover:bg-blue-100">
            User 3
          </button>
        </div>
      </div>

      {/* Messaging Interface */}
      <div
        className={`flex-1 p-4 ml-0 md:ml-64 w-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : ""
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Message Area */}
          <div
            className="flex-1 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 p-4 rounded-lg shadow-lg overflow-auto mb-4"
            style={{ maxHeight: "calc(100vh - 200px)" }} // Prevents scrolling the whole page
          >
            {/* Render messages */}
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {/* User Avatar (Icon placeholder) */}
                  <FaUserCircle className="w-8 h-8 text-gray-600" />
                  {/* Message and Time */}
                  <div className="bg-white p-2 rounded shadow mb-2 max-w-[300px]" style={{ wordBreak: "break-word" }}>
                    <div className="font-semibold text-gray-700">{msg.user}</div>
                    <div>{msg.text}</div>
                    <div className="text-sm text-gray-500 mt-1">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input and Send Button */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={handleKeyDown} // Listen for Enter key
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-[#3498DB] text-white rounded-lg hover:bg-[#2980B9] transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden absolute top-4 left-4 z-40">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-800 focus:outline-none bg-white p-1 rounded shadow"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}