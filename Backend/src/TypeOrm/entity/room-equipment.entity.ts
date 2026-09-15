import {
  Column,
  CreateDateColumn,
  Entity,
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
import { Equipment } from "./equipment.entity.js";

@ObjectType()
@Entity("RoomEquipment")
@Unique(["roomId", "equipmentId"])
export class RoomEquipment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: "integer" })
  roomId: number;

  @Field(() => Room)
  @ManyToOne(() => Room, (room) => room.roomEquipments)
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Field(() => Int)
  @Column({ type: "integer" })
  equipmentId: number;

  @Field(() => Equipment)
  @ManyToOne(
    () => Equipment,
    (equipment) => equipment.roomEquipments
  )
  @JoinColumn({ name: "equipmentId" })
  equipment: Equipment;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;
}