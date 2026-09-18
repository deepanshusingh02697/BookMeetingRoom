import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { createServer } from "node:http";
import { typeDefs } from "./graphql/Typedefs/typedefs.js";
import { resolvers } from "./graphql/Resolver/resolvers.js";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Context, createCheckAuth } from "./middleware/context.js";
import { socketAuth } from "./middleware/socketAuth.js";
import { startScheduler } from "./scheduleJob/scheduler.js";
import { AppDataSource } from "./TypeOrm/config/data-source.js";
import { buildSchema } from "type-graphql";
import { AuthResolver } from "./TypeGraphql/resolver/auth.resolver.js";
import { UserResolver } from "./TypeGraphql/resolver/user.resolver.js";
import { RoomResolver } from "./TypeGraphql/resolver/room.resolver.js";
import { EquipmentResolver } from "./TypeGraphql/resolver/equipment.resolver.js";
import { BookingResolver } from "./TypeGraphql/resolver/booking.resolver.js";
import { ParticipantResolver } from "./TypeGraphql/resolver/participant.resolver.js";
import { CheckInResolver } from "./TypeGraphql/resolver/check-in.resolver.js";
import { WaitlistResolver } from "./TypeGraphql/resolver/waitlist.resolver.js";
import { MaintenanceResolver } from "./TypeGraphql/resolver/maintenance.resolver.js";
import { AnalyticsResolver } from "./TypeGraphql/resolver/analytics.resolver.js";

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
// startScheduler(io);

/* const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
}); */

async function startServer() {
/*   await server.start();
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, { context: createCheckAuth(io) }),
  );
  httpServer.listen(port, () => {
    console.log(`Server is ready to listen at http://localhost:${port}`);
  }); */
  await AppDataSource.initialize();
  console.log("Database Connected");

  const schema = await buildSchema({
    resolvers: [
      AuthResolver,
      UserResolver,
      RoomResolver,
      EquipmentResolver,
      BookingResolver,
      ParticipantResolver,
      CheckInResolver,
      WaitlistResolver,
      MaintenanceResolver,
      AnalyticsResolver,
    ],
  })
  const server = new ApolloServer<Context>({schema})

  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: createCheckAuth(io),
    }),
  );

  startScheduler(io);

  httpServer.listen(port, () => {
    console.log(`Server is ready to listen at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Server failed to start ", error);
  console.error(error);

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  }

  process.exit(1);
});
