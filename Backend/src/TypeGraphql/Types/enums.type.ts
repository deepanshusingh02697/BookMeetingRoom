import { registerEnumType } from "type-graphql";

export enum Role {
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN",
}

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  DISABLED = "DISABLED",
}

export enum BookingStatus {
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
}

export enum RecurringFreq {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
}

registerEnumType(Role, { name: "Role" });
registerEnumType(RoomStatus, { name: "RoomStatus" });
registerEnumType(BookingStatus, { name: "BookingStatus" });
registerEnumType(RecurringFreq, { name: "RecurringFreq" });