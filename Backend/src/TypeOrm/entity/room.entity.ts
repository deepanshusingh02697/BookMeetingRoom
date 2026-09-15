import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import {
  Field,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from "type-graphql";

import { RoomStatus } from "./enums.js";
import { RoomEquipment } from "./room-equipment.entity.js";
import { Booking } from "./booking.entity.js";
import { WaitlistEntry } from "./waitlist-entry.entity.js";
import { Maintenance } from "./maintenance.entity.js";

registerEnumType(RoomStatus, {
  name: "RoomStatus",
  description: "Status of the meeting room",
});

@ObjectType()
@Entity("Room")
export class Room {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: "varchar", unique: true })
  name: string;

  @Field(() => Int)
  @Column({ type: "integer" })
  capacity: number;

  @Field(() => Int)
  @Column({ type: "integer" })
  floor: number;

  @Field(() => String)
  @Column({ type: "varchar" })
  location: string;

  @Field(() => RoomStatus)
  @Column({
    type: "enum",
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @Field(() => [RoomEquipment])
  @OneToMany(
    () => RoomEquipment,
    (roomEquipment) => roomEquipment.room
  )
  roomEquipments: RoomEquipment[];

  @Field(() => [Booking])
  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];

  @Field(() => [WaitlistEntry])
  @OneToMany(() => WaitlistEntry, (entry) => entry.room)
  waitlist: WaitlistEntry[];

  @Field(() => [Maintenance])
  @OneToMany(
    () => Maintenance,
    (maintenance) => maintenance.room
  )
  maintenance: Maintenance[];
}