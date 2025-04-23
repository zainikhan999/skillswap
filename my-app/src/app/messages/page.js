"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaUserCircle, FaArrowLeft, FaTimes } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useSocket } from "../contexts/SocketContext"; // Import the custom hook for socket
export default function MessagingApp() {
  // State Variables
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [room, setRoom] = useState("");
  const [userList, setUserList] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [swapAccepted, setSwapAccepted] = useState(false); // New state to track swap acceptance

  // Refs
  const { socket, socketRef } = useSocket(); // Use the socket context
  const messagesEndRef = useRef(null); // For scrolling

  // Router and URL Search Params
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch Chat History
  const fetchChatHistory = async (user1, user2) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/messages/${user1}/${user2}`
      );
      const formattedMessages = res.data.map((msg) => ({
        text: msg.message,
        user: msg.sender,
        time: new Date(msg.timestamp).toLocaleTimeString(),
        timestamp: msg.timestamp,
        seen: msg.seen,
      }));

      setMessages(formattedMessages);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  // Initialize Sender and Room from Local Storage or URL Params
  useEffect(() => {
    let parsedUser = null;
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        parsedUser = JSON.parse(storedUser);
        setSender(parsedUser.userName);
      }
    }

    const recipientFromURL = searchParams.get("recipient");
    if (parsedUser) {
      let recipient = recipientFromURL;
      if (!recipient) {
        recipient = localStorage.getItem("chatWith");
      } else {
        localStorage.setItem("chatWith", recipientFromURL);
      }
      if (recipient) {
        const roomName = [parsedUser.userName, recipient].sort().join("_");
        setRoom(roomName);
      }
    }
  }, [searchParams]);

  // Fetch Chat Users from Backend based on sender
  useEffect(() => {
    if (sender) {
      axios
        .get(`http://localhost:5000/chats/${sender}`)
        .then((res) => {
          console.log("Fetched chat users:", res.data);
          setChatUsers(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [sender]);

  // Set up socket connection and room joining
  useEffect(() => {
    if (!room) return;

    socket.emit("join_room", room);

    const handleMessage = ({ message, sender, timestamp }) => {
      setMessages((prev) => [
        ...prev,
        { text: message, user: sender, time: timestamp, timestamp },
      ]);
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [room]);

  // Fetch chat history when room and sender are set
  useEffect(() => {
    const recipient =
      searchParams.get("recipient") || localStorage.getItem("chatWith");
    if (room && sender && recipient) {
      fetchChatHistory(sender, recipient);
    }
  }, [room, sender]);

  // Handle Send Message to Backend
  const sendMessageToBackend = async ({ room, message, sender, recipient }) => {
    try {
      await axios.post("http://localhost:5000/message", {
        room,
        message,
        sender,
        recipient,
      });
    } catch (error) {
      console.error("Error sending message to backend:", error);
    }
  };

  // Handle sending message via socket and backend
  const handleSendMessage = async () => {
    if (message.trim() && socketRef.current) {
      const recipient =
        searchParams.get("recipient") || localStorage.getItem("chatWith");
      if (!recipient || !sender) return;

      const roomName = [sender, recipient].sort().join("_");

      socketRef.current.emit("join_room", roomName);

      try {
        // Send message to backend first
        await sendMessageToBackend({
          room: roomName,
          message,
          sender,
          recipient,
        });

        // Emit the message to the socket after backend confirmation
        socketRef.current.emit("message", {
          room: roomName,
          message,
          sender,
          recipient,
        });

        setRoom(roomName);
        setMessage(""); // Clear the input after sending
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Handle keydown event to send message on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim()) {
      handleSendMessage();
      e.preventDefault();
    }
  };

  // Handle swap button click
  const handleSwapAcceptance = async () => {
    router.push("/acceptswap");
  };

  // Get recipient from search params or local storage
  const recipient =
    searchParams.get("recipient") || localStorage.getItem("chatWith");
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isValidTimestamp = (timestamp) => {
    const date = new Date(
      typeof timestamp === "number" && timestamp < 1e12
        ? timestamp * 1000
        : timestamp
    );
    return !isNaN(date.getTime()) ? date : null;
  };

  function getFormattedDate(timestamp) {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return null;

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="h-screen flex overflow-hidden relative bg-white">
      {/* Sidebar */}
      {sender && chatUsers.length > 0 && (
        <div
          className={`absolute top-0 left-0 h-full w-64 bg-white shadow-2xl z-30 overflow-y-auto transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:block`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
            {/* Back arrow button (optional functionality, e.g. go to home or toggle) */}
            <button
              className="text-xl text-green-600 lg:hidden"
              onClick={() => {
                // Optional: Add back logic here
                setSidebarOpen(false);
              }}
            >
              <FaArrowLeft />
            </button>

            <span className="text-lg font-semibold text-gray-800">Chats</span>

            {/* Close (X) button */}
            <button
              className="text-xl text-red-500 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          {chatUsers.map((user) => (
            <div
              key={user}
              className="w-full text-left px-4 py-3 hover:bg-green-100 cursor-pointer flex items-center gap-3 transition-all"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("chatWith", user);
                }
                const newUrl = `?recipient=${user}`;
                router.push(newUrl);
                const newRoom = [sender, user].sort().join("_");
                setRoom(newRoom);
                setTimeout(() => fetchChatHistory(sender, user), 100);
              }}
            >
              <FaUserCircle className="text-green-500 text-2xl" />
              <div className="text-gray-800 font-medium">{user}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Panel */}
      <div className="flex-1 p-4 lg:ml-64 transition-all duration-300 ease-in-out mt-[-30px] h-[95%]">
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center bg-green-500 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center gap-4">
              {/* Hamburger Button (only visible on small screens) */}
              <button
                className="lg:hidden text-2xl text-white hover:scale-110 transition-transform"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
              >
                <FaBars />
              </button>
              {/* Recipient Name */}
              <div className="text-xl font-semibold text-white">
                {recipient}
              </div>
            </div>
            {!swapAccepted && (
              <button
                onClick={handleSwapAcceptance}
                style={{
                  backgroundColor: "white",
                  color: "#047857", // Tailwind's green-700 hex
                  padding: "0.5rem 1rem", // Equivalent to px-4 py-2
                  borderRadius: "9999px", // Fully rounded (rounded-full)
                  border: "1px solid #D1D5DB", // Tailwind's gray-300
                  fontSize: "0.875rem", // text-sm
                  fontWeight: 500,
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F3F4F6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                Accept Swap
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 bg-gradient-to-r from-green-50 via-green-100 to-green-200 rounded-b-xl shadow-inner overflow-y-auto">
            <div className="space-y-3">
              {messages.map((msg, index) => {
                const isSender = msg.user === sender;
                const currentDate = getFormattedDate(msg.timestamp);
                const previousDate =
                  index > 0
                    ? getFormattedDate(messages[index - 1].timestamp)
                    : null;
                const showDateSeparator =
                  index === 0 || currentDate !== previousDate;

                return (
                  <div key={index}>
                    {showDateSeparator && currentDate && (
                      <div className="text-center text-sm text-gray-500 my-3">
                        {currentDate}
                      </div>
                    )}
                    <div
                      className={`flex items-start gap-2 ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isSender && (
                        <FaUserCircle className="text-gray-600 text-2xl" />
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm break-words ${
                          isSender
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        {msg.text}
                        <div className="text-xs mt-1 text-right opacity-70">
                          {msg.timestamp &&
                            new Date(msg.timestamp).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "numeric",
                              }
                            )}
                        </div>
                      </div>
                      {isSender && (
                        <FaUserCircle className="text-gray-600 text-2xl" />
                      )}
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="flex items-center gap-3 p-4 border-t bg-white">
            <textarea
              className="flex-1 p-3 rounded-2xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition-all text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
