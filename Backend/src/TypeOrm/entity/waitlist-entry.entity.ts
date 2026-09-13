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

import { Room } from "./room.entity.js";
import { User } from "./user.entity.js";

@Entity("WaitlistEntry")
@Unique(["roomId", "userId", "startTime", "endTime"])
@Index(["roomId", "startTime", "endTime"])
export class WaitlistEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  roomId: number;

  @ManyToOne(() => Room, (room) => room.waitlist)
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Column({ type: "integer" })
  userId: number;

  @ManyToOne(() => User, (user) => user.waitlist)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "timestamp" })
  startTime: Date;

  @Column({ type: "timestamp" })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}