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
import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity("Participants")
@Unique(["bookingId", "userId"])
export class Participants {
    @Field(()=>ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(()=>Int)
  @Column({ type: "integer" })
  bookingId: number;

  @Field(()=>Booking)
  @ManyToOne(() => Booking, (booking) => booking.participants)
  @JoinColumn({ name: "bookingId" })
  booking: Booking;

  @Field(()=>Int)
  @Column({ type: "integer" })
  userId: number;

  @Field(()=>User)
  @ManyToOne(() => User, (user) => user.participants)
  @JoinColumn({ name: "userId" })
  user: User;
}