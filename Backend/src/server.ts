import "dotenv/config";
import "./scheduleJob/scheduler";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { createServer } from "node:http";
import { typeDefs } from "./graphql/Typedefs/typedefs";
import { resolvers } from "./graphql/Resolver/resolvers";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Context, createCheckAuth } from "./middleware/context";
import { socketAuth } from "./middleware/socketAuth";

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 4003;

const httpServer = createServer(app);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bookmeetingroom-client.onrender.com",
    ],
    credentials: true,
  }),
);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://bookmeetingroom-client.onrender.com",
    ],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});
io.use(socketAuth);
io.on("connection", (socket) => {
  const userId = socket.data.userId;
  console.log("Authenticated user connected");
  console.log("Socket ID:", socket.id);
  console.log("User ID:", userId);
  const room = `user:${userId}`;
  socket.join(room);
  console.log(`Socket ${socket.id} joined ${room}`);
  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
  });
});

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, { context: createCheckAuth(io) }),
  );
  httpServer.listen(port, () => {
    console.log(`Server is ready to listen at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Server failed to start ", err);
});
