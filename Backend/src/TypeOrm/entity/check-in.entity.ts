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

import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from "type-graphql";

import { Booking } from "./booking.entity.js";
import { User } from "./user.entity.js";

@ObjectType()
@Entity("CheckIn")
@Unique(["bookingId"])
export class CheckIn {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: "integer" })
  bookingId: number;

  @Field(() => Booking)
  @OneToOne(() => Booking, (booking) => booking.checkIn)
  @JoinColumn({ name: "bookingId" })
  booking: Booking;

  @Field(() => Int)
  @Column({ type: "integer" })
  checkInBy: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.checkIns)
  @JoinColumn({ name: "checkInBy" })
  user: User;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  checkedInAt: Date;
}