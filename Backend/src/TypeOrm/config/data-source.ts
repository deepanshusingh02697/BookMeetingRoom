import { DataSource } from "typeorm";
import { User } from "../entity/user.entity.js";
import { Booking } from "../entity/booking.entity.js";
import { Participants } from "../entity/participants.entity.js";
import { CheckIn } from "../entity/check-in.entity.js";
import { Equipment } from "../entity/equipment.entity.js";
import { Maintenance } from "../entity/maintenance.entity.js";
import { PasswordResetToken } from "../entity/password-reset-token.entity.js";
import { Room } from "../entity/room.entity.js";
import { RoomEquipment } from "../entity/room-equipment.entity.js";
import { WaitlistEntry } from "../entity/waitlist-entry.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL!,
  synchronize: false, //only during development
  logging: false,
  entities: [
    User,
    PasswordResetToken,
    Room,
    Equipment,
    RoomEquipment,
    Booking,
    Participants,
    CheckIn,
    WaitlistEntry,
    Maintenance,
  ],
});
