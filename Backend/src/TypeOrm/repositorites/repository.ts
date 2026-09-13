import { AppDataSource } from "../config/data-source.js";
import { Booking } from "../entity/booking.entity.js";
import { CheckIn } from "../entity/check-in.entity.js";
import { Equipment } from "../entity/equipment.entity.js";
import { Maintenance } from "../entity/maintenance.entity.js";
import { Participants } from "../entity/participants.entity.js";
import { PasswordResetToken } from "../entity/password-reset-token.entity.js";
import { RoomEquipment } from "../entity/room-equipment.entity.js";
import { Room } from "../entity/room.entity.js";
import { User } from "../entity/user.entity.js";
import { WaitlistEntry } from "../entity/waitlist-entry.entity.js";

export const userRepository = AppDataSource.getRepository(User);

export const passwordResetToken = AppDataSource.getRepository(PasswordResetToken)

export const bookingRepository= AppDataSource.getRepository(Booking)

export const equipmentRepository = AppDataSource.getRepository(Equipment)

export const maintenanceRepository = AppDataSource.getRepository(Maintenance)

export const participantRepository = AppDataSource.getRepository(Participants)
// Repository
export const roomRepository  = AppDataSource.getRepository(Room)

export const roomEquipmentRepository  = AppDataSource.getRepository(RoomEquipment)

export const checkInRepository = AppDataSource.getRepository(CheckIn)

export const waitlistEntryRepository = AppDataSource.getRepository(WaitlistEntry)
