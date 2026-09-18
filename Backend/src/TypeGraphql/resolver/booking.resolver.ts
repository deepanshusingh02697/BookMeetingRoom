import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../middleware/context.js";
import { BookingPayloadType } from "../Types/payload.type.js";
import { RecurringFreq } from "../Types/enums.type.js";
import { BookingType } from "../Types/booking.type.js";
import {
  adminCalender,
  bookingDetails,
  cancelBooking,
  cancelRecurringBooking,
  createBooking,
  myBookings,
  myMeetings,
  recurringBookingGroup,
} from "../services/booking.service.js";

@Resolver()
export class BookingResolver {
  @Query(() => [BookingType])
  async MyBookings(@Ctx() ctx: Context) {
    return myBookings(ctx);
  }

  @Query(() => [BookingType])
  async MyMeetings(@Ctx() ctx: Context) {
    return myMeetings(ctx);
  }

  @Query(() => BookingType, { nullable: true })
  async BookingDetails(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: Context,
  ) {
    return bookingDetails(ctx, id);
  }

  @Query(() => [BookingType])
  async RecurringBookingGroup(
    @Arg("recurrenceId", () => String) recurrenceId: string,
    @Ctx() ctx: Context,
  ) {
    return recurringBookingGroup(ctx, recurrenceId);
  }

  @Query(() => [BookingType])
  async AdminCalender(
    @Arg("startDate", () => String) startDate: string,
    @Arg("endDate", () => String) endDate: string,
    @Ctx() ctx: Context,
  ) {
    return adminCalender(ctx, { startDate, endDate });
  }

  @Mutation(() => BookingPayloadType)
  async CreateBooking(
    @Ctx() ctx: Context,
    @Arg("roomId", () => Int) roomId: number,
    @Arg("title", () => String) title: string,
    @Arg("startTime", () => String) startTime: string,
    @Arg("endTime", () => String) endTime: string,
    @Arg("description", () => String, { nullable: true }) description?: string,
    @Arg("participantUserIds", () => [Int], { nullable: true })
    participantUserIds?: number[],
    @Arg("recurringFreq", () => RecurringFreq, { nullable: true })
    recurringFreq?: RecurringFreq,
    @Arg("recurrenceEndDate", () => String, { nullable: true }) recurrenceEndDate?: string,
  ) {
    return createBooking(ctx, {
      roomId,
      title,
      description,
      startTime,
      endTime,
      participantUserIds,
      recurringFreq,
      recurrenceEndDate,
    });
  }

  @Mutation(() => BookingPayloadType)
  async CancelBooking(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: Context,
  ) {
    return cancelBooking(ctx, id);
  }

  @Mutation(() => String)
  async CancelRecurringBooking(
    @Arg("recurId", () => String) recurId: string,
    @Ctx() ctx: Context,
  ) {
    return cancelRecurringBooking(ctx, recurId);
  }
}