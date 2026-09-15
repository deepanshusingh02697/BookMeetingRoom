import { Field, ID, ObjectType } from "type-graphql";
import { BookingType } from "./booking.type.js";
import { UserType } from "./user.type.js";

@ObjectType("Participant")
export class ParticipantType {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  bookingId: number;

  @Field(() => ID)
  userId: number;

  @Field(() => BookingType)
  booking: BookingType;

  @Field(() => UserType)
  user: UserType;
}