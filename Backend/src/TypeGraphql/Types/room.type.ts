import { Field, ID, Int, ObjectType } from "type-graphql";
import { RoomStatus } from "./enums.type.js";
import { EquipmentType } from "./equipment.type.js";

@ObjectType("Room")
export class RoomType {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  capacity: number;

  @Field(() => Int)
  floor: number;

  @Field(() => String)
  location: string;

  @Field(() => RoomStatus)
  status: RoomStatus;

  @Field(() => Int)
  particiCount: number;

  @Field(() => Int)
  availableSpace: number;

  @Field(() => [EquipmentType])
  equipments: EquipmentType[];
}