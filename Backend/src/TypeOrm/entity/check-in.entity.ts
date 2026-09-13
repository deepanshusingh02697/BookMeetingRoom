import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

import { Booking } from "./booking.entity.js";
import { User } from "./user.entity.js";

@Entity("CheckIn")
@Unique(["bookingId"])
export class CheckIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  bookingId: number;

  @OneToOne(() => Booking, (booking) => booking.checkIn)
  @JoinColumn({ name: "bookingId" })
  booking: Booking;

  @Column({ type: "integer" })
  checkInBy: number;

  @ManyToOne(() => User, (user) => user.checkIns)
  @JoinColumn({ name: "checkInBy" })
  user: User;

  @CreateDateColumn()
  checkedInAt: Date;
}