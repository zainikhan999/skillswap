import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { connectDB } from "./utils/features.js";
import { corsOptions } from "./constants/config.js";
import authRoutes from "./routes/user.js";
import { errorMiddleware } from "./middleware/error.js"; // Import your error middleware
import Message from "./Model/Message.js";
import ChatRoom from "./Model/ChatRoom.js";
import Notification from "./Model/Notification.js";
dotenv.config();
const envMode = process.env.NODE_ENV || "DEVELOPMENT";
const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);
//explain each line by line in detail
const app = express(); //create express app
const server = createServer(app); //create http server
const io = new Server(server, {
  cors: corsOptions, //enable cors
});
app.use(cors(corsOptions)); //

app.use(express.json());
app.use("/api", authRoutes);

// ________________________________________________Socketio Connection_____________________________________________
io.on("connection", (socket) => {
  console.log("User connected");

  // Join a specific room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Receive message event
  // socket.on("message", ({ room, message, sender, recipient }) => {
  //   const timestamp = new Date().toISOString(); // Generate timestamp
  //   console.log(`Message sent at: ${timestamp}`); // Check the timestamp
  //   io.to(room).emit("receive_message", { message, sender, timestamp });
  // });

  // Handle seen status update
  socket.on("seen_status_updated", ({ room, timestamp }) => {
    console.log(
      `Message with timestamp ${timestamp} is now seen in room: ${room}`
    );

    // Broadcast the seen status to everyone in the room
    io.to(room).emit("seen_status_updated", { timestamp });
  });
  socket.on("message", async ({ room, message, sender, recipient }) => {
    const timestamp = new Date().toISOString();
    io.to(room).emit("receive_message", { message, sender, timestamp });

    // Add this log:
    console.log("Incoming socket message:", {
      room,
      sender,
      recipient,
      message,
    });

    try {
      const newNotification = new Notification({
        recipient: recipient,
        sender: sender,
        message: `New message from ${sender}`,
        timestamp: timestamp,
        isSeen: false,
      });

      console.log("Saving notification:", newNotification);

      await newNotification.save();

      io.to(recipient).emit("receive_notification", newNotification);
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });

  // When a user opens the chat and sees the messages
  socket.on("message_seen", async ({ timestamp, room }) => {
    try {
      const message = await Message.findOneAndUpdate(
        { timestamp },
        { $set: { seen: true } },
        { new: true }
      );

      if (message) {
        io.to(room).emit("message_seen_updated", { timestamp });
      }
    } catch (err) {
      console.error("Error updating seen status:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Save chat room and message
app.post("/message", async (req, res) => {
  try {
    const { room, sender, recipient, message } = req.body;

    if (!room || !sender || !recipient || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Save chat room if it doesn't exist
    const existingRoom = await ChatRoom.findOne({ roomId: room });
    if (!existingRoom) {
      await ChatRoom.create({
        roomId: room,
        participants: [sender, recipient],
        serviceId: "default", // You can set this dynamically if needed
      });
    }

    // Save message
    const savedMessage = await Message.create({
      chatroomId: room,
      sender,
      receiver: recipient,
      message,
    });

    res.status(201).json({ success: true, message: savedMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/chats/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const messages = await Message.find({
      $or: [{ sender: username }, { receiver: username }],
    });

    const chatUsers = new Set();

    messages.forEach((msg) => {
      if (msg.sender !== username) chatUsers.add(msg.sender);
      if (msg.receiver !== username) chatUsers.add(msg.receiver);
    });

    res.json([...chatUsers]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch chat users" });
  }
});
app.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 }); // updated sort field too

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch chat history" });
  }
});

app.post("/message/seen", (req, res) => {
  const { timestamp } = req.body;
  if (!timestamp) {
    return res.status(400).json({ error: "Timestamp is required" });
  }

  // message model with a 'seen' field
  Message.updateOne(
    { timestamp }, // Find the message by timestamp (or unique ID)
    { $set: { seen: true } } // Set the 'seen' field to true
  )
    .then(() => {
      res.status(200).json({ message: "Message status updated to seen" });
    })
    .catch((err) => {
      console.error("Error updating message status:", err);
      res.status(500).json({ error: "Failed to update message status" });
    });
});

// error middle ware at the end
app.use(errorMiddleware);
server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
export { envMode };
