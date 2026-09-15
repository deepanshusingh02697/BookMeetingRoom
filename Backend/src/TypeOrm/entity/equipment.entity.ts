import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomEquipment } from "./room-equipment.entity.js";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity("Equipment")
export class Equipment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: "varchar", unique: true })
  name: string;

  @Field(() => [RoomEquipment])
  @OneToMany(() => RoomEquipment,(roomEquipment) => roomEquipment.equipment)
  roomEquipments: RoomEquipment[];
}