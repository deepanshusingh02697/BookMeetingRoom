import "dotenv/config";
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

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 4003;

const httpServer = createServer(app);
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});
io.on("connection", (socket) => {
  console.log("User connected via socket");
  console.log("Socket id : ", socket.id);
  socket.on("joinUser", (userId: number) => {
    const room = `user:${userId}`;
    socket.join(room);
    console.log(
      `socket, socketId : ${socket.id} joined pariticipant: ${room}`);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
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
