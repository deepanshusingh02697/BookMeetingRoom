import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { Context } from "../middleware/context";

type NotificationContext = Pick<Context, "io">;

export const convertWeightlist = async (
  roomId: number,
  start: Date,
  end: Date,
  ctx: NotificationContext,
) => {
  const result = await prisma.$transaction(
    async (tx) => {
      const room = await tx.room.findUnique({ where: { id: roomId } });
      if (!room || room.status !== "AVAILABLE") {
        return null;
      }
      const waitlistLine = await tx.waitlistEntry.findFirst({
        where: {
          roomId,
          startTime: { gte: start },
          endTime: { lte: end },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      if (!waitlistLine) return null;
      const bokOverlap = await tx.booking.findFirst({
        where: {
          roomId,
          status: "CONFIRMED",
          startTime: { lt: waitlistLine.endTime },
          endTime: { gt: waitlistLine.startTime },
        },
      });
      if (bokOverlap) {
        return null;
      }
      const mainOverlap = await tx.maintenance.findFirst({
        where: {
          roomId,
          startTime: { lt: waitlistLine.endTime },
          endTime: { gt: waitlistLine.startTime },
        },
      });
      if (mainOverlap) {
        return null;
      }
      const newbookig = await tx.booking.create({
        data: {
          roomId,
          organizerId: waitlistLine.userId,
          title: "Auto assign booking",
          startTime: waitlistLine.startTime,
          endTime: waitlistLine.endTime,
        },
      });
      await tx.waitlistEntry.delete({
        where: {
          id: waitlistLine.id,
        },
      });
      return {
        newbookig,
        userId: waitlistLine.userId,
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
  if(result){
    ctx.io.to(`user:${result.userId}`).emit("notify",{
      message:"Room has been book from waitlist",
      bookingId:result.newbookig.id
    });
  }
  return result?.newbookig ?? null;
};
