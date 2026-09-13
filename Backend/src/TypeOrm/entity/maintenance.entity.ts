import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Room } from "./room.entity.js";

@Entity("Maintenance")
@Index(["roomId", "startTime", "endTime"])
export class Maintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  roomId: number;

  @ManyToOne(() => Room, (room) => room.maintenance)
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Column({ type: "timestamp" })
  startTime: Date;

  @Column({ type: "timestamp" })
  endTime: Date;

  @Column({ type: "varchar", nullable: true })
  reason: string | null;
}