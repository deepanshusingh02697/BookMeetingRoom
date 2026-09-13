import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

import { Booking } from "./booking.entity.js";
import { User } from "./user.entity.js";

@Entity("Participants")
@Unique(["bookingId", "userId"])
export class Participants {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  bookingId: number;

  @ManyToOne(() => Booking, (booking) => booking.participants)
  @JoinColumn({ name: "bookingId" })
  booking: Booking;

  @Column({ type: "integer" })
  userId: number;

  @ManyToOne(() => User, (user) => user.participants)
  @JoinColumn({ name: "userId" })
  user: User;
}