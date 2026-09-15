import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Room } from "./room.entity.js";
import { Field, GraphQLISODateTime, ID, Int } from "type-graphql";

@Entity("Maintenance")
@Index(["roomId", "startTime", "endTime"])
export class Maintenance {
  @Field(()=>ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(()=>Int)
  @Column({ type: "integer" })
  roomId: number;

  @Field(()=>Room)
  @ManyToOne(() => Room, (room) => room.maintenance)
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Field(()=>GraphQLISODateTime)
  @Column({ type: "timestamp" })
  startTime: Date;

  @Field(()=>GraphQLISODateTime)
  @Column({ type: "timestamp" })
  endTime: Date;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  reason: string | null;
}