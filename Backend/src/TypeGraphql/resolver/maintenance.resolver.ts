import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../middleware/context.js";
import { MaintinancePayloadType } from "../Types/payload.type.js";
import { MaintenanceType } from "../Types/maintenance.type.js";
import {
  createMaintenance,
  deleteMaintenance,
  roomMaintenance,
} from "../services/maintenance.service.js";

@Resolver()
export class MaintenanceResolver {
  @Query(() => [MaintenanceType])
  async RoomMaintinance(
    @Arg("roomId", () => Int) roomId: number,
    @Ctx() ctx: Context,
  ) {
    return roomMaintenance(ctx, roomId);
  }

  @Mutation(() => MaintinancePayloadType)
  async CreateMaint(
    @Ctx() ctx: Context,
    @Arg("roomId", () => Int) roomId: number,
    @Arg("startTime", () => String) startTime: string,
    @Arg("endTime", () => String) endTime: string,
    @Arg("reason", () => String, { nullable: true }) reason?: string,
  ) {
    return createMaintenance(ctx, { roomId, startTime, endTime, reason });
  }

  @Mutation(() => String)
  async DeleteMain(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: Context,
  ) {
    return deleteMaintenance(ctx, id);
  }
}