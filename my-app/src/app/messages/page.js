"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { FaUserCircle } from "react-icons/fa"; // Importing Font Awesome icon
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function MessagingApp() {
  // State Variables
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [room, setRoom] = useState("");
  const [userList, setUserList] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);

  // Refs
  const socketRef = useRef(null);
  //for scrolling
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
          setChatUsers(res.data); // Change if needed
        })
        .catch((err) => console.error(err));
    }
  }, [sender]);

  // Set up socket connection and room joining
  useEffect(() => {
    if (!room) return;
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.emit("join_room", room);

    socket.on("receive_message", ({ message, sender }) => {
      setMessages((prev) => [
        ...prev,
        { text: message, user: sender, time: new Date().toLocaleTimeString() },
      ]);
    });

    return () => {
      socket.disconnect();
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

  // Mark message as seen if received and update status
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.user !== sender && !lastMessage.seen) {
        socketRef.current.emit("message_seen", {
          timestamp: lastMessage.timestamp,
          room,
        });

        lastMessage.seen = true;
        sendSeenStatusToBackend(lastMessage.timestamp);
      }
    }
  }, [messages]);

  // Emit seen status to backend
  const sendSeenStatusToBackend = async (timestamp) => {
    const recipient =
      searchParams.get("recipient") || localStorage.getItem("chatWith");
    if (!timestamp || !room || !sender || !recipient) {
      console.warn("Missing data for seen update:", {
        timestamp,
        room,
        sender,
        recipient,
      });
      return;
    }

    try {
      await axios.post("http://localhost:5000/message/seen", {
        timestamp,
        room,
        sender,
        recipient,
      });

      socketRef.current.emit("seen_status_updated", { timestamp });
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  // Listen for received messages and update messages state
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on(
      "receive_message",
      ({ message, sender, timestamp }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: message,
            user: sender,
            timestamp,
            time: new Date(timestamp).toLocaleTimeString(),
            seen: false,
          },
        ]);
      }
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive_message");
      }
    };
  }, []);

  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* Sidebar */}
      {sender && chatUsers.length > 0 && (
        <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-md z-30 overflow-y-auto">
          {chatUsers.map((user) => (
            <button
              key={user}
              className="w-full text-left p-2 hover:bg-blue-100"
              onClick={() => {
                localStorage.setItem("chatWith", user);
                const newUrl = `?recipient=${user}`; // Fixed the template string
                router.push(newUrl);
                const newRoom = [sender, user].sort().join("_");
                setRoom(newRoom);

                setTimeout(() => {
                  fetchChatHistory(sender, user);
                }, 100);
              }}
            >
              {user}
            </button>
          ))}
        </div>
      )}

      {/* Main Chat UI */}
      <div
        className={`flex-1 p-4 ml-0 md:ml-64 w-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : ""
        }`}
      >
        <div className="flex flex-col h-full">
          <div
            className="flex-1 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 p-4 rounded-lg shadow-lg overflow-auto mb-4"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            <div className="space-y-2">
              {messages.map((msg, index) => {
                const isSender = msg.user === sender;
                const getDateString = (timestamp) => {
                  if (!timestamp) return "";
                  const date = new Date(
                    typeof timestamp === "number" && timestamp < 1e12
                      ? timestamp * 1000 // If in seconds, convert to ms
                      : timestamp
                  );
                  return isNaN(date.getTime()) ? "" : date.toDateString();
                };

                const currentDate = getDateString(msg.timestamp);
                const previousDate =
                  index > 0
                    ? getDateString(messages[index - 1].timestamp)
                    : null;

                const showDateSeparator =
                  index === 0 || currentDate !== previousDate;

                return (
                  <div key={index}>
                    {/* Date Separator */}
                    {showDateSeparator && currentDate && (
                      <div className="text-center text-gray-500 text-sm my-4">
                        {new Date(msg.timestamp).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`flex items-start space-x-3 ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Avatar for Sender/Receiver */}
                      {!isSender && (
                        <FaUserCircle className="w-8 h-8 text-gray-600" />
                      )}

                      <div
                        className={`p-3 rounded-xl shadow mb-2 max-w-[70%] ${
                          isSender
                            ? "bg-blue-500 text-white ml-auto"
                            : "bg-gray-200 text-gray-900 mr-auto"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="block text-xs text-right">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Scroll trigger */}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Message Input */}
          <div className="flex items-center space-x-3">
            <textarea
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
