// A single shared Socket.IO client instance for the entire frontend.
import { io } from "socket.io-client";

// Backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Create shared client
const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;