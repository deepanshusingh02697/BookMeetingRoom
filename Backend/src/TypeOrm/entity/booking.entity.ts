import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";

import { Room } from "./room.entity.js";
import { User } from "./user.entity.js";
import { BookingStatus } from "./enums.js";
import { Participants } from "./participants.entity.js";
import { CheckIn } from "./check-in.entity.js";

@Entity("Booking")
@Index(["roomId", "startTime", "endTime"])
@Index(["recurrenceId"])
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  roomId: number;

  @ManyToOne(() => Room, (room) => room.bookings)
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Column({ type: "integer" })
  organizerId: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: "organizerId" })
  organizer: User;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar", nullable: true })
  description: string | null;

  @Column({ type: "timestamp" })
  startTime: Date;

  @Column({ type: "timestamp" })
  endTime: Date;

  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  @Column({ type: "varchar", nullable: true })
  recurrenceId: string | null;

  @OneToMany(() => Participants, (participant) => participant.booking)
  participants: Participants[];

  @OneToOne(() => CheckIn, (checkIn) => checkIn.booking)
  checkIn: CheckIn | null;

  @CreateDateColumn()
  createdAt: Date;
}