import { Field, Int, ObjectType } from "type-graphql";
import { RoomType } from "./room.type.js";

@ObjectType("RoomUsedStats")
export class RoomUsedStatsType {
  @Field(() => RoomType)
  room: RoomType;

  @Field(() => Int)
  totalBookings: number;

  @Field(() => Int)
  cancelledCount: number;

  @Field(() => Int)
  noShowCount: number;

  @Field(() => Int)
  completedCount: number;
}

@ObjectType("UsageData")
export class UsageDataType {
  @Field(() => Int)
  totalBookings: number;

  @Field(() => Int)
  totalCancelled: number;

  @Field(() => Int)
  totalNoShow: number;

  @Field(() => [RoomUsedStatsType])
  utilizeByRoom: RoomUsedStatsType[];
}