import { Field, ID, ObjectType } from "type-graphql";
import { BookingType } from "./booking.type.js";
import { UserType } from "./user.type.js";

@ObjectType("CheckIn")
export class CheckInType {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  bookingId: number;

  @Field(() => ID)
  checkInBy: number;

  @Field(() => BookingType)
  booking: BookingType;

  @Field(() => UserType)
  user: UserType;

  @Field(() => String)
  checkedInAt: string;
}