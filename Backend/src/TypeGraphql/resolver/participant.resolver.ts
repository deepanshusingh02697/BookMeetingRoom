import { Arg, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { Context } from "../../middleware/context.js";
import { BookingPayloadType } from "../Types/payload.type.js";
import {
  addParticipant,
  removeParticipant,
} from "../services/participant.service.js";

@Resolver()
export class ParticipantResolver {
  @Mutation(() => BookingPayloadType)
  async AddParticipant(
    @Arg("bookingId", () => Int) bookingId: number,
    @Arg("userId", () => Int) userId: number,
    @Ctx() ctx: Context,
  ) {
    return addParticipant(ctx, { bookingId, userId });
  }

  @Mutation(() => BookingPayloadType)
  async RemoveParticipant(
    @Arg("bookingId", () => Int) bookingId: number,
    @Arg("userId", () => Int) userId: number,
    @Ctx() ctx: Context,
  ) {
    return removeParticipant(ctx, { bookingId, userId });
  }
}