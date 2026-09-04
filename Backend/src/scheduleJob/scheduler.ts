import cron from "node-cron";
import { releaseBookings } from "./releaseBbooking";
import { Server } from "socket.io";

export const startScheduler = (io: Server) => {
  cron.schedule("* * * * *", async () => {
    try {
      await releaseBookings(io);
    } catch (error) {
      console.error("failed to release bookings:", error);
    }
  });
};
