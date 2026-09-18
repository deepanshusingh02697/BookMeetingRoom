import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../middleware/context.js";
import { WaitListPayloadType } from "../Types/payload.type.js";
import { WaitlistEntryType } from "../Types/waitlist-entry.type.js";
import {
  joinWaitlist,
  leaveWaitlist,
  myWaitlist,
} from "../services/waitlist.service.js";

@Resolver()
export class WaitlistResolver {
  @Query(() => [WaitlistEntryType])
  async MyWaitlist(@Ctx() ctx: Context) {
    return myWaitlist(ctx);
  }

  @Mutation(() => WaitListPayloadType)
  async JoinWaitlist(
    @Arg("roomId", () => Int) roomId: number,
    @Arg("startTime", () => String) startTime: string,
    @Arg("endTime", () => String) endTime: string,
    @Ctx() ctx: Context,
  ) {
    return joinWaitlist(ctx, { roomId, startTime, endTime });
  }

  @Mutation(() => String)
  async LeaveWaitlist(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: Context,
  ) {
    return leaveWaitlist(ctx, id);
  }
}