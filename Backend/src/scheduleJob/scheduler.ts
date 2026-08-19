import cron from "node-cron";
import { releaseBookings } from "./releaseBbooking";

cron.schedule("* * * * *", async () => {
  try {
    await releaseBookings();
  } catch (error) {
    console.error("failed to release bookings:", error);
  }
});
