import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"], // force WebSocket (skip polling)
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("✅ WebSocket connected to backend");
});

socket.on("disconnect", () => {
  console.log("❌ WebSocket disconnected");
});

export default socket;
