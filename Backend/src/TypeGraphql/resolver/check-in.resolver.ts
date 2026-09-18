import { Arg, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { Context } from "../../middleware/context.js";
import { CheckInPayloadType } from "../Types/payload.type.js";
import { checkInToBooking } from "../services/check-in.service.js";

@Resolver()
export class CheckInResolver {
  @Mutation(() => CheckInPayloadType)
  async CheckInToBooking(
    @Arg("bookingId", () => Int) bookingId: number,
    @Ctx() ctx: Context,
  ) {
    return checkInToBooking(ctx, bookingId);
  }
}