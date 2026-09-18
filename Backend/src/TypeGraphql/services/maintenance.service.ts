import { LessThan, MoreThan } from "typeorm";
import { Context } from "../../middleware/context.js";
import { BookingStatus } from "../../TypeOrm/entity/enums.js";
import {
  bookingRepository,
  maintenanceRepository,
  roomRepository,
} from "../../TypeOrm/repositorites/repository.js";
import { checkTime } from "../../Validation/booking.validation.js";
import { isAdmin, isAuth } from "../../Validation/auth.validation.js";
import { mapMaintenance } from "./entity.mapper.js";

export async function roomMaintenance(ctx: Context, roomId: number) {
  isAuth(ctx);
  const list = await maintenanceRepository.find({
    where: { roomId },
    order: { startTime: "ASC" },
  });
  return Promise.all(list.map(mapMaintenance));
}

export async function createMaintenance(
  ctx: Context,
  args: {
    roomId: number;
    startTime: string;
    endTime: string;
    reason?: string;
  },
) {
  isAdmin(ctx);
  const { start, end } = checkTime(args.startTime, args.endTime);

  const room = await roomRepository.findOne({ where: { id: args.roomId } });
  if (!room) {
    throw new Error("Room does not exist");
  }

  const bookingExst = await bookingRepository.findOne({
    where: {
      roomId: args.roomId,
      status: BookingStatus.CONFIRMED,
      startTime: LessThan(end),
      endTime: MoreThan(start),
    },
  });
  if (bookingExst) {
    throw new Error("booking is present for this time");
  }

  const maintExist = await maintenanceRepository.findOne({
    where: {
      roomId: args.roomId,
      startTime: LessThan(end),
      endTime: MoreThan(start),
    },
  });
  if (maintExist) {
    throw new Error("miantenance already created");
  }

  const created = maintenanceRepository.create({
    roomId: args.roomId,
    startTime: start,
    endTime: end,
    reason: args.reason?.trim(),
  });
  const saved = await maintenanceRepository.save(created);
  const full = await maintenanceRepository.findOne({
    where: { id: saved.id },
    relations: { room: true },
  });
  if (!full) {
    throw new Error("maintenece does not exist");
  }

  return {
    success: true,
    msg: "maintence created successfully",
    maintinance: await mapMaintenance(full),
  };
}

export async function deleteMaintenance(ctx: Context, id: number) {
  isAdmin(ctx);
  const maint = await maintenanceRepository.findOne({ where: { id } });
  if (!maint) {
    throw new Error("maintenece does not exist");
  }
  await maintenanceRepository.delete({ id });
  return "maintence deleted successfuly";
}