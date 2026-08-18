import { io } from "socket.io-client";

// export const socket = io("http://localhost:4002", {
export const socket = io("https://bookmeetingroom-73rz.onrender.com", {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: true,
});
