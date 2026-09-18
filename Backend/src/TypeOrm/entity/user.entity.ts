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
import { Field, GraphQLISODateTime, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity("User")
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(()=>String)
  @Column({ type: "varchar" })
  firstname: string;

  @Field(()=>String)
  @Column({ type: "varchar" })
  lastname: string;

  @Field(()=>String)
  @Column({ type: "varchar", unique: true })
  email: string;

  // Don't expose password in GraphQL
  @Column({ type: "varchar" })
  password: string;

  @Field(()=>GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @Field(()=>GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(()=>Role)
  @Column({
    type: "enum",
    enum: Role,
    default: Role.EMPLOYEE,
  })
  role: Role;

  @Field(()=>[Booking])
  @OneToMany(() => Booking, (booking) => booking.organizer)
  bookings: Booking[];

  @Field(()=>[Participants])
  @OneToMany(() => Participants, (participant) => participant.user)
  participants: Participants[];

  @Field(()=>[WaitlistEntry])
  @OneToMany(() => WaitlistEntry, (entry) => entry.user)
  waitlist: WaitlistEntry[];

  @Field(()=>[CheckIn])
  @OneToMany(() => CheckIn, (checkIn) => checkIn.user)
  checkIns: CheckIn[];

  @Field(()=>[PasswordResetToken])
  @OneToMany(() => PasswordResetToken, (token) => token.user)
  passwordResetTokens: PasswordResetToken[];
}