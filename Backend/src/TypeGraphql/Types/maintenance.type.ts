import { Field, ID, ObjectType } from "type-graphql";
import { RoomType } from "./room.type.js";

@ObjectType("Maintenance")
export class MaintenanceType {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  roomId: number;

  @Field(() => RoomType)
  room: RoomType;

  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;

  @Field(() => String, { nullable: true })
  reason: string | null;
}