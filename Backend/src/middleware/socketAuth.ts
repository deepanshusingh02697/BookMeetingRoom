import { Socket } from "socket.io";
import { parseCookie } from "cookie";
import { verifyAccessToken } from "../utils/jwt-cookie";

export const socketAuth = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const cookies = parseCookie(socket.handshake.headers.cookie || "");
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      return next(new Error("Not authenticated"));
    }
    const decoded = verifyAccessToken(accessToken);
    socket.data.userId = decoded.userId;
    socket.data.role = decoded.role;
    next();
  } catch {
    next(new Error("Invalid or expired access token"));
  }
};
