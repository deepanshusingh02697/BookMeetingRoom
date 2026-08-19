import { prisma } from "../lib/prisma";
import { checkIn_Min } from "../Validation/booking.validation";

export const releaseBookings = async () => {
  const now = new Date();
  const deadline = new Date(now.getTime() - checkIn_Min * 60 * 1000);
  await prisma.booking.updateMany({
    where: {
      status: "CONFIRMED",
      startTime: { lte: deadline },
      checkIn: null,
    },
    data: {
      status: "NO_SHOW",
    },
  });
  await prisma.booking.updateMany({
    where: {
      status: "CONFIRMED",
      endTime: { lte: now },
      checkIn: { isNot: null },
    },
    data: {
      status: "COMPLETED",
    },
  });
};
