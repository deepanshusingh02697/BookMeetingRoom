import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Role } from "./enums.js";
import { Booking } from "./booking.entity.js";
import { Participants } from "./participants.entity.js";
import { WaitlistEntry } from "./waitlist-entry.entity.js";
import { CheckIn } from "./check-in.entity.js";
import { PasswordResetToken } from "./password-reset-token.entity.js";

@Entity("User")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  firstname: string;

  @Column({ type: "varchar" })
  lastname: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.EMPLOYEE,
  })
  role: Role;

  @OneToMany(() => Booking, (booking) => booking.organizer)
  bookings: Booking[];

  @OneToMany(() => Participants, (participant) => participant.user)
  participants: Participants[];

  @OneToMany(() => WaitlistEntry, (entry) => entry.user)
  waitlist: WaitlistEntry[];

  @OneToMany(() => CheckIn, (checkIn) => checkIn.user)
  checkIns: CheckIn[];

  @OneToMany(() => PasswordResetToken, (token) => token.user)
  passwordResetTokens: PasswordResetToken[];
}