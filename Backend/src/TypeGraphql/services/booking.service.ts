import { randomUUID } from "node:crypto";
import { In, LessThan, MoreThan, MoreThanOrEqual } from "typeorm";
import type { EntityManager } from "typeorm";
import { Context } from "../../middleware/context.js";
import { Booking } from "../../TypeOrm/entity/booking.entity.js";
import { BookingStatus, RoomStatus } from "../../TypeOrm/entity/enums.js";
import { Maintenance } from "../../TypeOrm/entity/maintenance.entity.js";
import { Participants } from "../../TypeOrm/entity/participants.entity.js";
import { Room } from "../../TypeOrm/entity/room.entity.js";
import {
  bookingRepository,
  roomRepository,
} from "../../TypeOrm/repositorites/repository.js";
import { AppDataSource } from "../../TypeOrm/config/data-source.js";
import {
  buildRecurDates,
  cancelBooking as validateCancelBooking,
  checkTime,
  checkTitle,
} from "../../Validation/booking.validation.js";
import { isAdmin, isAuth } from "../../Validation/auth.validation.js";
import { convertWeightlist } from "./waitlist.service.js";
import { mapBooking } from "./entity.mapper.js";

export const BOOKING_RELATIONS = {
  room: true,
  organizer: true,
  participants: { user: true },
  checkIn: { user: true },
} as const;

export async function loadBookingById(id: number): Promise<Booking> {
  const booking = await bookingRepository.findOne({
    where: { id },
    relations: BOOKING_RELATIONS,
  });
  if (!booking) {
    throw new Error("Booking does not exist");
  }
  return booking;
}

async function assertNoOverlap(
  manager: EntityManager,
  roomId: number,
  start: Date,
  end: Date,
): Promise<void> {
  const overlap = await manager.getRepository(Booking).findOne({
    where: {
      roomId,
      status: BookingStatus.CONFIRMED,
      startTime: LessThan(end),
      endTime: MoreThan(start),
    },
  });
  if (overlap) {
    throw new Error("Room already booked for this time");
  }

  const maint = await manager.getRepository(Maintenance).findOne({
    where: {
      roomId,
      startTime: LessThan(end),
      endTime: MoreThan(start),
    },
  });
  if (maint) {
    throw new Error(
      `Room is under maintenance from ${maint.startTime.toLocaleString()} to ${maint.endTime.toLocaleString()}`,
    );
  }
}

export async function myBookings(ctx: Context) {
  isAuth(ctx);
  const bookings = await bookingRepository.find({
    where: { organizerId: ctx.userId! },
    relations: BOOKING_RELATIONS,
    order: { startTime: "DESC" },
  });
  return Promise.all(bookings.map(mapBooking));
}

export async function myMeetings(ctx: Context) {
  isAuth(ctx);
  const now = new Date();
  const bookings = await bookingRepository.find({
    where: [
      {
        organizerId: ctx.userId!,
        status: BookingStatus.CONFIRMED,
        endTime: MoreThanOrEqual(now),
      },
      {
        participants: { userId: ctx.userId! },
        status: BookingStatus.CONFIRMED,
        endTime: MoreThanOrEqual(now),
      },
    ],
    relations: BOOKING_RELATIONS,
    order: { startTime: "ASC" },
  });
  return Promise.all(bookings.map(mapBooking));
}

export async function bookingDetails(ctx: Context, id: number) {
  isAuth(ctx);
  const booking = await bookingRepository.findOne({
    where: { id },
    relations: BOOKING_RELATIONS,
  });
  if (!booking) {
    throw new Error("Booking does not exist");
  }

  const organiser = booking.organizerId === ctx.userId;
  const admin = ctx.role === "ADMIN";
  const participant = booking.participants.some(
    (p) => p.userId === ctx.userId,
  );

  if (!organiser && !participant && !admin) {
    throw new Error("You are not allowed to view this booking");
  }

  return mapBooking(booking);
}

export async function recurringBookingGroup(
  ctx: Context,
  recurrenceId: string,
) {
  isAuth(ctx);
  const bookings = await bookingRepository.find({
    where: { recurrenceId },
    relations: BOOKING_RELATIONS,
    order: { startTime: "ASC" },
  });
  if (bookings.length === 0) {
    throw new Error("recurring bookings does not exist");
  }

  const admin = ctx.role === "ADMIN";
  const organiser = bookings.some((booking) => booking.organizerId === ctx.userId);
  const participant = bookings.some((booking) =>
    booking.participants.some(
      (participant) => participant.userId === ctx.userId,
    ),
  );

  if (!admin && !organiser && !participant) {
    throw new Error("You are not allowed to view this recurring booking");
  }

  return Promise.all(bookings.map(mapBooking));
}

export async function adminCalender(
  ctx: Context,
  args: { startDate: string; endDate: string },
) {
  isAdmin(ctx);
  const start = new Date(args.startDate);
  const end = new Date(args.endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date range");
  }
  if (start >= end) {
    throw new Error("Invalid date range");
  }

  const bookings = await bookingRepository.find({
    where: {
      startTime: LessThan(end),
      endTime: MoreThan(start),
    },
    relations: BOOKING_RELATIONS,
    order: { startTime: "ASC" },
  });

  return Promise.all(bookings.map(mapBooking));
}

export async function createBooking(
  ctx: Context,
  args: {
    roomId: number;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    participantUserIds?: number[];
    recurringFreq?: string;
    recurrenceEndDate?: string;
  },
) {
  isAuth(ctx);
  const { start, end } = checkTime(args.startTime, args.endTime);
  const title = checkTitle(args.title);

  const room = await roomRepository.findOne({ where: { id: args.roomId } });
  if (!room) {
    throw new Error("Room does not exit for creating booking");
  }
  if (room.status !== RoomStatus.AVAILABLE) {
    throw new Error("room is not available");
  }

  const totalPeople = 1 + (args.participantUserIds?.length ?? 0);
  if (totalPeople > room.capacity) {
    throw new Error("people can not be greater than room capcity");
  }

  const participantUserIds = args.participantUserIds ?? [];

  if (args.recurringFreq) {
    if (!args.recurrenceEndDate) {
      throw new Error("recurrence end date required");
    }
    const recuEndDate = new Date(args.recurrenceEndDate);
    const freq: "DAILY" | "WEEKLY" =
      args.recurringFreq === "WEEKLY" ? "WEEKLY" : "DAILY";
    const occur = buildRecurDates(start, end, freq, recuEndDate);
    for (let i = 0; i < occur.length; i++) {
      for (let j = i + 1; j < occur.length; j++) {
        const first = occur[i];
        const second = occur[j];
        if (first.start < second.end && first.end > second.start) {
          throw new Error("recuring booking overlap");
        }
      }
    }

    const recurrenceId = randomUUID();
    const created = await AppDataSource.transaction(
      "SERIALIZABLE",
      async (manager) => {
        for (const occ of occur) {
          await assertNoOverlap(manager, args.roomId, occ.start, occ.end);
        }
        const createdBookings: Booking[] = [];
        for (const occ of occur) {
          const booking = manager.getRepository(Booking).create({
            roomId: args.roomId,
            organizerId: ctx.userId!,
            title,
            description: args.description?.trim(),
            startTime: occ.start,
            endTime: occ.end,
            recurrenceId,
          });
          createdBookings.push(
            await manager.getRepository(Booking).save(booking),
          );
        }
        if (participantUserIds.length > 0) {
          const rows = [];
          for (const booking of createdBookings) {
            for (const userId of participantUserIds) {
              rows.push({ bookingId: booking.id, userId });
            }
          }
          await manager.getRepository(Participants).insert(rows);
        }
        return createdBookings;
      },
    );

    const fullBookings = await Promise.all(
      created.map((booking) => loadBookingById(booking.id)),
    );

    if (participantUserIds.length > 0 && fullBookings.length > 0) {
      for (const userId of participantUserIds) {
        ctx.io.to(`user:${userId}`).emit("notify", {
          message: `You are added to "${fullBookings[0].title}".`,
          bookingId: fullBookings[0].id,
        });
      }
    }

    return {
      success: true,
      msg: `${fullBookings.length} recurring bookings created successfully`,
      booking: fullBookings.length > 0 ? await mapBooking(fullBookings[0]) : null,
    };
  }

  const saved = await AppDataSource.transaction(
    "SERIALIZABLE",
    async (manager) => {
      await assertNoOverlap(manager, args.roomId, start, end);

      const booking = manager.getRepository(Booking).create({
        roomId: args.roomId,
        organizerId: ctx.userId!,
        title,
        description: args.description?.trim(),
        startTime: start,
        endTime: end,
      });
      const newBooking = await manager.getRepository(Booking).save(booking);

      if (participantUserIds.length > 0) {
        const rows = participantUserIds.map((userId) => ({
          bookingId: newBooking.id,
          userId,
        }));
        await manager.getRepository(Participants).insert(rows);
      }

      return newBooking;
    },
  );

  const full = await loadBookingById(saved.id);

  if (participantUserIds.length > 0) {
    for (const userId of participantUserIds) {
      ctx.io.to(`user:${userId}`).emit("notify", {
        message: `You are added to "${full.title}".`,
        bookingId: full.id,
      });
    }
  }

  return {
    success: true,
    msg: "booking created successfully",
    booking: await mapBooking(full),
  };
}

export async function cancelBooking(ctx: Context, id: number) {
  isAuth(ctx);
  const booking = await bookingRepository.findOne({ where: { id } });
  if (!booking) {
    throw new Error("booking does not exist");
  }

  const organiser = booking.organizerId === ctx.userId;
  const admin = ctx.role === "ADMIN";
  if (!organiser && !admin) {
    throw new Error("Not allowed to cancel booking");
  }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error("Only confirmed bookings can be cancel");
  }

  validateCancelBooking(booking.startTime);

  booking.status = BookingStatus.CANCELLED;
  const saved = await bookingRepository.save(booking);
  const full = await loadBookingById(saved.id);

  await convertWeightlist(full.roomId, full.startTime, full.endTime, ctx);

  return {
    success: true,
    msg: "booking cancel successfully",
    booking: await mapBooking(full),
  };
}

export async function cancelRecurringBooking(ctx: Context, recurId: string) {
  isAuth(ctx);
  const bookings = await bookingRepository.find({
    where: { recurrenceId: recurId },
  });
  if (bookings.length === 0) {
    throw new Error("recurring bookings does not exist");
  }

  const organizer = bookings[0].organizerId === ctx.userId;
  const admin = ctx.role === "ADMIN";
  if (!organizer && !admin) {
    throw new Error("Not allowed to cancel booking");
  }

  const bookingToCancel = bookings.filter((bk) => {
    if (bk.status !== BookingStatus.CONFIRMED) {
      return false;
    }
    if (bk.startTime <= new Date()) {
      return true;
    }
    try {
      validateCancelBooking(bk.startTime);
      return true;
    } catch {
      return false;
    }
  });

  if (bookingToCancel.length === 0) {
    return "recurring booking cancel successfully";
  }

  await bookingRepository.update(
    {
      id: In(bookingToCancel.map((bk) => bk.id)),
      status: BookingStatus.CONFIRMED,
    },
    { status: BookingStatus.CANCELLED },
  );

  for (const bk of bookingToCancel) {
    await convertWeightlist(bk.roomId, bk.startTime, bk.endTime, ctx);
  }

  return "recurring booking cancel successfully";
}