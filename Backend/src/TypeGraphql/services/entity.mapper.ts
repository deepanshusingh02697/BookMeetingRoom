import {
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from "typeorm";
import { Booking } from "../../TypeOrm/entity/booking.entity.js";
import { BookingStatus } from "../../TypeOrm/entity/enums.js";
import { CheckIn } from "../../TypeOrm/entity/check-in.entity.js";
import { Equipment } from "../../TypeOrm/entity/equipment.entity.js";
import { Maintenance } from "../../TypeOrm/entity/maintenance.entity.js";
import { Room } from "../../TypeOrm/entity/room.entity.js";
import { User } from "../../TypeOrm/entity/user.entity.js";
import { WaitlistEntry } from "../../TypeOrm/entity/waitlist-entry.entity.js";
import {
  bookingRepository,
  participantRepository,
  roomEquipmentRepository,
} from "../../TypeOrm/repositorites/repository.js";

export type UserShape = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EquipmentShape = {
  id: number;
  name: string;
  rooms: unknown[];
};

export type ParticipantShape = {
  id: number;
  bookingId: number;
  userId: number;
  booking: unknown;
  user: unknown;
};

export type RoomShape = {
  id: number;
  name: string;
  capacity: number;
  floor: number;
  location: string;
  status: string;
  particiCount: number;
  availableSpace: number;
  equipments: EquipmentShape[];
};

export type CheckInShape = {
  id: number;
  bookingId: number;
  checkInBy: number;
  booking: unknown;
  user: unknown;
  checkedInAt: Date;
};

export type BookingShape = {
  id: number;
  roomId: number;
  organizerId: number;
  room: unknown;
  organizer: unknown;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  status: string;
  recurrenceId: string | null;
  participants: ParticipantShape[];
  checkIn: CheckInShape | null;
  createdAt: Date;
};

export type WaitlistEntryShape = {
  id: number;
  roomId: number;
  userId: number;
  room: unknown;
  user: unknown;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
};

export function mapUser(user: User): UserShape {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function getRoomEquipments(roomId: number): Promise<EquipmentShape[]> {
  const roomEquipments = await roomEquipmentRepository.find({
    where: { roomId },
    relations: { equipment: true },
  });
  return roomEquipments.map((re) => ({
    id: re.equipment.id,
    name: re.equipment.name,
    rooms: [],
  }));
}

export async function mapRoom(room: Room): Promise<RoomShape> {
  const now = new Date();
  const equipments = await getRoomEquipments(room.id);
  const activeBooking = await bookingRepository.findOne({
    where: {
      roomId: room.id,
      status: BookingStatus.CONFIRMED,
      startTime: LessThanOrEqual(now),
      endTime: MoreThan(now),
    },
  });
  let particiCount = 0;
  let availableSpace = room.capacity;
  if (activeBooking) {
    const parCount = await participantRepository.count({
      where: { bookingId: activeBooking.id },
    });
    particiCount = 1 + parCount;
    availableSpace = Math.max(room.capacity - particiCount, 0);
  }
  return {
    id: room.id,
    name: room.name,
    capacity: room.capacity,
    floor: room.floor,
    location: room.location,
    status: room.status,
    particiCount,
    availableSpace,
    equipments,
  };
}

export async function mapBooking(booking: Booking): Promise<BookingShape> {
  const room = booking.room ? await mapRoom(booking.room) : null;
  const organizer = booking.organizer ? mapUser(booking.organizer) : null;
  const participants: ParticipantShape[] = (booking.participants ?? []).map(
    (p) => ({
      id: p.id,
      bookingId: p.bookingId,
      userId: p.userId,
      booking: null,
      user: p.user ? mapUser(p.user) : null,
    }),
  );
  return {
    id: booking.id,
    roomId: booking.roomId,
    organizerId: booking.organizerId,
    room,
    organizer,
    title: booking.title,
    description: booking.description,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
    recurrenceId: booking.recurrenceId,
    participants,
    checkIn: booking.checkIn ? await mapCheckIn(booking.checkIn) : null,
    createdAt: booking.createdAt,
  };
}

export async function mapCheckIn(
  checkIn: CheckIn,
  booking?: unknown,
): Promise<CheckInShape> {
  return {
    id: checkIn.id,
    bookingId: checkIn.bookingId,
    checkInBy: checkIn.checkInBy,
    booking: booking ?? null,
    user: checkIn.user ? mapUser(checkIn.user) : null,
    checkedInAt: checkIn.checkedInAt,
  };
}

export async function mapWaitlistEntry(
  entry: WaitlistEntry,
): Promise<WaitlistEntryShape> {
  return {
    id: entry.id,
    roomId: entry.roomId,
    userId: entry.userId,
    room: entry.room ? await mapRoom(entry.room) : null,
    user: entry.user ? mapUser(entry.user) : null,
    startTime: entry.startTime,
    endTime: entry.endTime,
    createdAt: entry.createdAt,
  };
}

export async function mapMaintenance(
  maintenance: Maintenance,
): Promise<{
  id: number;
  roomId: number;
  room: unknown;
  startTime: Date;
  endTime: Date;
  reason: string | null;
}> {
  return {
    id: maintenance.id,
    roomId: maintenance.roomId,
    room: maintenance.room ? await mapRoom(maintenance.room) : null,
    startTime: maintenance.startTime,
    endTime: maintenance.endTime,
    reason: maintenance.reason,
  };
}

export function mapEquipment(equipment: Equipment): {
  id: number;
  name: string;
  rooms: unknown[];
} {
  return {
    id: equipment.id,
    name: equipment.name,
    rooms: [],
  };
}