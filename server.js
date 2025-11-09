// server.js


import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import taskRoutes from "./routes/taskRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import axios from "axios";
// correct relative path


// Load environment variables
dotenv.config();

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.send("Trello Real-time API is running 🚀");
});

// WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible everywhere
app.set("socketio", io);

// Example: fetch Trello boards (for testing)
app.get("/test-boards", async (req, res) => {
  try {
    const url = `https://api.trello.com/1/members/me/boards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("get boards error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
