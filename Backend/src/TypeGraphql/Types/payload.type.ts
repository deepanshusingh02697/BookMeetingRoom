import { Field, ObjectType } from "type-graphql";
import { BookingType } from "./booking.type.js";
import { CheckInType } from "./check-in.type.js";
import { EquipmentType } from "./equipment.type.js";
import { MaintenanceType } from "./maintenance.type.js";
import { RoomType } from "./room.type.js";
import { UserType } from "./user.type.js";
import { WaitlistEntryType } from "./waitlist-entry.type.js";

@ObjectType("AuthPayload")
export class AuthPayloadType {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => UserType, { nullable: true })
  user: UserType | null;
}

@ObjectType("BasicResponse")
export class BasicResponseType {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;
}

@ObjectType("RoomPayload")
export class RoomPayloadType {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => RoomType, { nullable: true })
  room: RoomType | null;
}

@ObjectType("EquipmentPayload")
export class EquipmentPayloadType {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => EquipmentType, { nullable: true })
  equipment: EquipmentType | null;
}

@ObjectType("BookingPayload")
export class BookingPayloadType {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => BookingType, { nullable: true })
  booking: BookingType | null;
}

@ObjectType("CheckInPayload")
export class CheckInPayloadType {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => CheckInType, { nullable: true })
  checkIn: CheckInType | null;
}

@ObjectType("WaitListPayload")
export class WaitListPayloadType {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => WaitlistEntryType, { nullable: true })
  waitlist: WaitlistEntryType | null;
}

@ObjectType("MaintinancePayload")
export class MaintinancePayloadType {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => MaintenanceType, { nullable: true })
  maintinance: MaintenanceType | null;
}