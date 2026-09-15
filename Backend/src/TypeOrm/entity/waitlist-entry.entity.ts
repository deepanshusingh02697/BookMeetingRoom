import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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

import { Room } from "./room.entity.js";
import { User } from "./user.entity.js";

@ObjectType()
@Entity("WaitlistEntry")
@Unique(["roomId", "userId", "startTime", "endTime"])
@Index(["roomId", "startTime", "endTime"])
export class WaitlistEntry {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: "integer" })
  roomId: number;

  @Field(() => Room)
  @ManyToOne(() => Room, (room) => room.waitlist)
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Field(() => Int)
  @Column({ type: "integer" })
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.waitlist)
  @JoinColumn({ name: "userId" })
  user: User;

  @Field(() => GraphQLISODateTime)
  @Column({ type: "timestamp" })
  startTime: Date;

  @Field(() => GraphQLISODateTime)
  @Column({ type: "timestamp" })
  endTime: Date;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;
}