import { prisma } from "../lib/prisma";
import { checkIn_Min } from "../Validation/booking.validation";
import { convertWeightlist } from "../utils/WatilistConvert";
import { Server } from "socket.io";

export const releaseBookings = async (io: Server) => {
  const now = new Date();
  const deadline = new Date(now.getTime() - checkIn_Min * 60 * 1000);
  const bookingsToRelease = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      startTime: { lte: deadline },
      checkIn: null,
    },
    select: {
      id: true,
      roomId: true,
      startTime: true,
      endTime: true,
    },
  });
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
  for (const booking of bookingsToRelease) {
    await convertWeightlist(booking.roomId, booking.startTime, booking.endTime, {
      io,
    });
  }
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
