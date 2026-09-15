import { Field, ID, ObjectType } from "type-graphql";
import { BookingStatus } from "./enums.type.js";
import { RoomType } from "./room.type.js";
import { UserType } from "./user.type.js";
import { ParticipantType } from "./participant.type.js";
import { CheckInType } from "./check-in.type.js";

@ObjectType("Booking")
export class BookingType {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  roomId: number;

  @Field(() => ID)
  organizerId: number;

  @Field(() => RoomType)
  room: RoomType;

  @Field(() => UserType)
  organizer: UserType;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string | null;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field(() => BookingStatus)
  status: BookingStatus;

  @Field({ nullable: true })
  recurrenceId: string | null;

  @Field(() => [ParticipantType])
  participants: ParticipantType[];

  @Field(() => CheckInType, { nullable: true })
  checkIn: CheckInType | null;

  @Field()
  createdAt: string;
}