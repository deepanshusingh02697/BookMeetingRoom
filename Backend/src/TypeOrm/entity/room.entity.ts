import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { RoomStatus } from "./enums.js";
import { RoomEquipment } from "./room-equipment.entity.js";
import { Booking } from "./booking.entity.js";
import { WaitlistEntry } from "./waitlist-entry.entity.js";
import { Maintenance } from "./maintenance.entity.js";

@Entity("Room")
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  name: string;

  @Column({ type: "integer" })
  capacity: number;

  @Column({ type: "integer" })
  floor: number;

  @Column({ type: "varchar" })
  location: string;

  @Column({
    type: "enum",
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @OneToMany(
    () => RoomEquipment,
    (roomEquipment) => roomEquipment.room
  )
  roomEquipments: RoomEquipment[];

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];

  @OneToMany(() => WaitlistEntry, (entry) => entry.room)
  waitlist: WaitlistEntry[];

  @OneToMany(() => Maintenance, (maintenance) => maintenance.room)
  maintenance: Maintenance[];
}