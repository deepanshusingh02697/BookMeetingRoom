import { GraphQLError } from "graphql/error";
import { LessThan, MoreThan, MoreThanOrEqual } from "typeorm";
import { Context } from "../../middleware/context.js";
import { Room } from "../../TypeOrm/entity/room.entity.js";
import { BookingStatus, RoomStatus } from "../../TypeOrm/entity/enums.js";
import {
  bookingRepository,
  equipmentRepository,
  maintenanceRepository,
  roomEquipmentRepository,
  roomRepository,
} from "../../TypeOrm/repositorites/repository.js";
import { checkTime } from "../../Validation/booking.validation.js";
import { isAdmin, isAuth } from "../../Validation/auth.validation.js";
import {
  checkCapacity,
  checkFloor,
  checkLocation,
  checkName,
} from "../../Validation/room.validation.js";
import { mapRoom } from "./entity.mapper.js";

export type SearchRoomsArgs = {
  startTime: string;
  endTime: string;
  capacity?: number;
  floor?: number;
  equipmentIds?: number[];
  status?: "AVAILABLE" | "DISABLED";
};

export type RoomArgs = {
  name: string;
  capacity: number;
  floor: number;
  location: string;
};

export async function getRooms(ctx: Context) {
  isAuth(ctx);
  const rooms = await roomRepository.find({ order: { id: "ASC" } });
  return Promise.all(rooms.map(mapRoom));
}

export async function getRoomDetails(ctx: Context, roomId: number) {
  isAuth(ctx);
  const room = await roomRepository.findOne({ where: { id: roomId } });
  if (!room) {
    throw new Error("Room not found");
  }
  return mapRoom(room);
}

export async function searchRooms(ctx: Context, args: SearchRoomsArgs) {
  isAuth(ctx);
  const { start, end } = checkTime(args.startTime, args.endTime);

  const rooms = await roomRepository.find({
    where: {
      status:
        args.status === "DISABLED"
          ? RoomStatus.DISABLED
          : RoomStatus.AVAILABLE,
      ...(args.capacity !== undefined
        ? { capacity: MoreThanOrEqual(args.capacity) }
        : {}),
      ...(args.floor !== undefined ? { floor: args.floor } : {}),
    },
    relations: { roomEquipments: { equipment: true } },
  });

  const availableRooms: Room[] = [];
  for (const room of rooms) {
    if (args.equipmentIds?.length) {
      const existingIds = new Set(
        room.roomEquipments.map((re) => re.equipmentId),
      );
      if (!args.equipmentIds.every((id) => existingIds.has(id))) {
        continue;
      }
    }
    const overlapBooking = await bookingRepository.findOne({
      where: {
        roomId: room.id,
        status: BookingStatus.CONFIRMED,
        startTime: LessThan(end),
        endTime: MoreThan(start),
      },
    });
    if (overlapBooking) {
      continue;
    }
    const overlapMaint = await maintenanceRepository.findOne({
      where: {
        roomId: room.id,
        startTime: LessThan(end),
        endTime: MoreThan(start),
      },
    });
    if (overlapMaint) {
      continue;
    }
    availableRooms.push(room);
  }

  return Promise.all(availableRooms.map(mapRoom));
}

export async function createRoom(ctx: Context, args: RoomArgs) {
  isAdmin(ctx);
  const name = checkName(args.name);
  const capacity = checkCapacity(args.capacity);
  const floor = checkFloor(args.floor);
  const location = checkLocation(args.location);

  const existingRoom = await roomRepository.findOne({ where: { name } });
  if (existingRoom) {
    throw new GraphQLError("room already exist", {
      extensions: { code: "BAD_INPUT", field: "name" },
    });
  }

  const room = roomRepository.create({ name, capacity, floor, location });
  const saved = await roomRepository.save(room);

  return { success: true, msg: "room created", room: await mapRoom(saved) };
}

export async function updateRoom(
  ctx: Context,
  args: {
    id: number;
    name?: string;
    capacity?: number;
    floor?: number;
    location?: string;
  },
) {
  isAdmin(ctx);
  const room = await roomRepository.findOne({ where: { id: args.id } });
  if (!room) {
    throw new Error("room does not exist");
  }

  if (args.name !== undefined) {
    room.name = checkName(args.name.trim());
  }
  if (args.capacity !== undefined) {
    room.capacity = checkCapacity(args.capacity);
  }
  if (args.floor !== undefined) {
    room.floor = checkFloor(args.floor);
  }
  if (args.location !== undefined) {
    room.location = checkLocation(args.location);
  }

  const saved = await roomRepository.save(room);

  return { success: true, msg: "room updated", room: await mapRoom(saved) };
}

export async function disableRoom(ctx: Context, id: number) {
  isAdmin(ctx);
  const room = await roomRepository.findOne({ where: { id } });
  if (!room) {
    throw new Error("room does not exist");
  }
  room.status = RoomStatus.DISABLED;
  const saved = await roomRepository.save(room);

  return {
    success: true,
    msg: "room disable successfully",
    room: await mapRoom(saved),
  };
}

export async function enableRoom(ctx: Context, id: number) {
  isAdmin(ctx);
  const room = await roomRepository.findOne({ where: { id } });
  if (!room) {
    throw new Error("room does not exist");
  }
  room.status = RoomStatus.AVAILABLE;
  const saved = await roomRepository.save(room);

  return {
    success: true,
    msg: "room enable successfully",
    room: await mapRoom(saved),
  };
}

export async function addEquipmentToRoom(
  ctx: Context,
  args: { roomId: number; equipmentId: number },
) {
  isAdmin(ctx);
  const roomExist = await roomRepository.findOne({
    where: { id: args.roomId },
  });
  if (!roomExist) {
    throw new Error("Room does not exist");
  }

  const eqExist = await equipmentRepository.findOne({
    where: { id: args.equipmentId },
  });
  if (!eqExist) {
    throw new Error("Equipment does not exist");
  }

  const checkeq = await roomEquipmentRepository.findOne({
    where: { roomId: args.roomId, equipmentId: args.equipmentId },
  });
  if (checkeq) {
    throw new Error("equipment is already added");
  }

  const rel = roomEquipmentRepository.create({
    roomId: args.roomId,
    equipmentId: args.equipmentId,
  });
  await roomEquipmentRepository.save(rel);

  const room = await roomRepository.findOne({
    where: { id: args.roomId },
  });
  if (!room) {
    throw new Error("Room does not exist");
  }

  return {
    success: true,
    msg: "equipment added successfully",
    room: await mapRoom(room),
  };
}

export async function removeEquipmentFromRoom(
  ctx: Context,
  args: { roomId: number; equipmentId: number },
) {
  isAdmin(ctx);
  const checkData = await roomEquipmentRepository.findOne({
    where: { roomId: args.roomId, equipmentId: args.equipmentId },
  });
  if (!checkData) {
    throw new Error("Equipment is not assigned to this room");
  }

  await roomEquipmentRepository.delete({
    roomId: args.roomId,
    equipmentId: args.equipmentId,
  });

  const room = await roomRepository.findOne({ where: { id: args.roomId } });
  if (!room) {
    throw new Error("Room does not exist");
  }

  return {
    success: true,
    msg: "equipment removed succcessfully",
    room: await mapRoom(room),
  };
}