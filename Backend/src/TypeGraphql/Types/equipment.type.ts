import { Field, ID, ObjectType } from "type-graphql";
import { RoomType } from "./room.type.js";

@ObjectType("Equipment")
export class EquipmentType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => [RoomType])
  rooms: RoomType[];
}