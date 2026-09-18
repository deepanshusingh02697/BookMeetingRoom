import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from "typeorm";
import { Context } from "../../middleware/context.js";
import { Booking } from "../../TypeOrm/entity/booking.entity.js";
import { BookingStatus, RoomStatus } from "../../TypeOrm/entity/enums.js";
import { Maintenance } from "../../TypeOrm/entity/maintenance.entity.js";
import { Room } from "../../TypeOrm/entity/room.entity.js";
import { WaitlistEntry } from "../../TypeOrm/entity/waitlist-entry.entity.js";
import {
  bookingRepository,
  maintenanceRepository,
  roomRepository,
  waitlistEntryRepository,
} from "../../TypeOrm/repositorites/repository.js";
import { AppDataSource } from "../../TypeOrm/config/data-source.js";
import { checkTime } from "../../Validation/booking.validation.js";
import { isAuth } from "../../Validation/auth.validation.js";
import { mapWaitlistEntry } from "./entity.mapper.js";

export async function myWaitlist(ctx: Context) {
  isAuth(ctx);
  const entries = await waitlistEntryRepository.find({
    where: { userId: ctx.userId! },
    relations: { room: true, user: true },
    order: { createdAt: "ASC" },
  });
  return Promise.all(entries.map(mapWaitlistEntry));
}

export async function joinWaitlist(
  ctx: Context,
  args: { roomId: number; startTime: string; endTime: string },
) {
  isAuth(ctx);
  const { start, end } = checkTime(args.startTime, args.endTime);

  const room = await roomRepository.findOne({ where: { id: args.roomId } });
  if (!room) {
    throw new Error("room does not exist");
  }

  const overlapping = await bookingRepository.findOne({
    where: {
      roomId: args.roomId,
      status: BookingStatus.CONFIRMED,
      startTime: LessThan(end),
      endTime: MoreThan(start),
    },
  });
  if (!overlapping) {
    throw new Error("no need to join waitlist, room is free");
  }

  const maint = await maintenanceRepository.findOne({
    where: {
      roomId: args.roomId,
      startTime: LessThan(end),
      endTime: MoreThan(start),
    },
  });
  if (maint) {
    throw new Error("Room is under maintenance for this time");
  }

  const checkExist = await waitlistEntryRepository.findOne({
    where: {
      roomId: args.roomId,
      userId: ctx.userId!,
      startTime: start,
      endTime: end,
    },
  });
  if (checkExist) {
    throw new Error("already exist in the waitlist");
  }

  const entry = waitlistEntryRepository.create({
    roomId: args.roomId,
    userId: ctx.userId!,
    startTime: start,
    endTime: end,
  });
  const saved = await waitlistEntryRepository.save(entry);
  const full = await waitlistEntryRepository.findOne({
    where: { id: saved.id },
    relations: { room: true, user: true },
  });
  if (!full) {
    throw new Error("waitlist entry does not exist");
  }

  return {
    success: true,
    msg: "joined waitlist successfully",
    waitlist: await mapWaitlistEntry(full),
  };
}

export async function leaveWaitlist(ctx: Context, id: number) {
  isAuth(ctx);
  const checkExist = await waitlistEntryRepository.findOne({ where: { id } });
  if (!checkExist) {
    throw new Error("waitlist entry does not exist");
  }
  if (checkExist.userId !== ctx.userId) {
    throw new Error("Not allowed to leave");
  }
  await waitlistEntryRepository.delete({ id });
  return "removed from waitlist successfully";
}

export const convertWeightlist = async (
  roomId: number,
  start: Date,
  end: Date,
  ctx: Pick<Context, "io">,
) => {
  const result = await AppDataSource.transaction(async (manager) => {
    const room = await manager.getRepository(Room).findOne({
      where: { id: roomId },
    });
    if (!room || room.status !== RoomStatus.AVAILABLE) {
      return null;
    }

    const waitlistLine = await manager.getRepository(WaitlistEntry).findOne({
      where: {
        roomId,
        startTime: MoreThanOrEqual(start),
        endTime: LessThanOrEqual(end),
      },
      order: { createdAt: "ASC" },
    });
    if (!waitlistLine) {
      return null;
    }

    const bokOverlap = await manager.getRepository(Booking).findOne({
      where: {
        roomId,
        status: BookingStatus.CONFIRMED,
        startTime: LessThan(waitlistLine.endTime),
        endTime: MoreThan(waitlistLine.startTime),
      },
    });
    if (bokOverlap) {
      return null;
    }

    const mainOverlap = await manager.getRepository(Maintenance).findOne({
      where: {
        roomId,
        startTime: LessThan(waitlistLine.endTime),
        endTime: MoreThan(waitlistLine.startTime),
      },
    });
    if (mainOverlap) {
      return null;
    }

    const created = manager.getRepository(Booking).create({
      roomId,
      organizerId: waitlistLine.userId,
      title: "Auto assign booking",
      startTime: waitlistLine.startTime,
      endTime: waitlistLine.endTime,
    });
    const newbookig = await manager.getRepository(Booking).save(created);
    await manager
      .getRepository(WaitlistEntry)
      .delete({ id: waitlistLine.id });

    return { newbookig, userId: waitlistLine.userId };
  });

  if (result) {
    ctx.io.to(`user:${result.userId}`).emit("notify", {
      message: "Room has been book from waitlist",
      bookingId: result.newbookig.id,
    });
  }

  return result?.newbookig ?? null;
};