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
import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from "type-graphql";

import { Room } from "./room.entity.js";
import { User } from "./user.entity.js";
import { BookingStatus } from "./enums.js";
import { Participants } from "./participants.entity.js";
import { CheckIn } from "./check-in.entity.js";

registerEnumType(BookingStatus, {
  name: "BookingStatus",
  description: "Status of the booking",
});

@ObjectType()
@Entity("Booking")
@Index(["roomId", "startTime", "endTime"])
@Index(["recurrenceId"])
export class Booking {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: "integer" })
  roomId: number;

  @Field(() => Room)
  @ManyToOne(() => Room, (room) => room.bookings)
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Field(() => Int)
  @Column({ type: "integer" })
  organizerId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: "organizerId" })
  organizer: User;

  @Field(() => String)
  @Column({ type: "varchar" })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  description: string | null;

  @Field(() => GraphQLISODateTime)
  @Column({ type: "timestamp" })
  startTime: Date;

  @Field(() => GraphQLISODateTime)
  @Column({ type: "timestamp" })
  endTime: Date;

  @Field(() => BookingStatus)
  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  recurrenceId: string | null;

  @Field(() => [Participants])
  @OneToMany(() => Participants, (participant) => participant.booking)
  participants: Participants[];

  @Field(() => CheckIn, { nullable: true })
  @OneToOne(() => CheckIn, (checkIn) => checkIn.booking)
  checkIn: CheckIn | null;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;
}