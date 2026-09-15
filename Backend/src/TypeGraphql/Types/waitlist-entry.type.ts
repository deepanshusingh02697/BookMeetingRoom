import { Field, ID, ObjectType } from "type-graphql";
import { RoomType } from "./room.type.js";
import { UserType } from "./user.type.js";

@ObjectType("WaitlistEntry")
export class WaitlistEntryType {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  roomId: number;

  @Field(() => ID)
  userId: number;

  @Field(() => RoomType)
  room: RoomType;

  @Field(() => UserType)
  user: UserType;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field()
  createdAt: string;
}