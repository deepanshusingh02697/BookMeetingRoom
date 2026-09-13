import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

import { Room } from "./room.entity.js";
import { Equipment } from "./equipment.entity.js";

@Entity("RoomEquipment")
@Unique(["roomId", "equipmentId"])
export class RoomEquipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  roomId: number;

  @ManyToOne(() => Room, (room) => room.roomEquipments)
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Column({ type: "integer" })
  equipmentId: number;

  @ManyToOne(
    () => Equipment,
    (equipment) => equipment.roomEquipments
  )
  @JoinColumn({ name: "equipmentId" })
  equipment: Equipment;

  @CreateDateColumn()
  createdAt: Date;
}