import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { Context } from "../../middleware/context.js";
import { BookingStatus } from "../../TypeOrm/entity/enums.js";
import { bookingRepository } from "../../TypeOrm/repositorites/repository.js";
import { checkTime } from "../../Validation/booking.validation.js";
import { isAdmin } from "../../Validation/auth.validation.js";
import { mapRoom } from "./entity.mapper.js";

export async function usedAnalytics(
  ctx: Context,
  args: { startDate: string; endDate: string },
) {
  isAdmin(ctx);
  const { start, end } = checkTime(args.startDate, args.endDate);

  const bookings = await bookingRepository.find({
    where: {
      startTime: MoreThanOrEqual(start),
      endTime: LessThanOrEqual(end),
    },
    relations: { room: true },
  });

  const roomThingsMap = new Map<
    number,
    {
      room: NonNullable<(typeof bookings)[number]["room"]>;
      totalBookings: number;
      cancelledCount: number;
      noShowCount: number;
      completedCount: number;
    }
  >();
  let totalCancel = 0;
  let totalNoshow = 0;

  for (const booking of bookings) {
    if (!roomThingsMap.has(booking.roomId)) {
      roomThingsMap.set(booking.roomId, {
        room: booking.room,
        totalBookings: 0,
        cancelledCount: 0,
        noShowCount: 0,
        completedCount: 0,
      });
    }
    const stat = roomThingsMap.get(booking.roomId)!;
    stat.totalBookings += 1;
    if (booking.status === BookingStatus.CANCELLED) {
      stat.cancelledCount += 1;
      totalCancel += 1;
    }
    if (booking.status === BookingStatus.NO_SHOW) {
      stat.noShowCount += 1;
      totalNoshow += 1;
    }
    if (booking.status === BookingStatus.COMPLETED) {
      stat.completedCount += 1;
    }
  }

  const utilizeByRoom = await Promise.all(
    Array.from(roomThingsMap.values()).map(async (stat) => ({
      room: await mapRoom(stat.room),
      totalBookings: stat.totalBookings,
      cancelledCount: stat.cancelledCount,
      noShowCount: stat.noShowCount,
      completedCount: stat.completedCount,
    })),
  );

  return {
    totalBookings: bookings.length,
    totalCancelled: totalCancel,
    totalNoShow: totalNoshow,
    utilizeByRoom,
  };
}