import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../middleware/context.js";
import { EquipmentPayloadType } from "../Types/payload.type.js";
import { EquipmentType } from "../Types/equipment.type.js";
import {
  createEquipment,
  editEquipment,
  getEquipments,
} from "../services/equipment.service.js";

@Resolver()
export class EquipmentResolver {
  @Query(() => [EquipmentType])
  async GetEquipments(@Ctx() ctx: Context) {
    return getEquipments(ctx);
  }

  @Mutation(() => EquipmentPayloadType)
  async CreateEquipment(
    @Arg("name", () => String) name: string,
    @Ctx() ctx: Context,
  ) {
    return createEquipment(ctx, name);
  }

  @Mutation(() => EquipmentPayloadType)
  async EditEquipment(
    @Ctx() ctx: Context,
    @Arg("equipmentId", () => Int) equipmentId: number,
    @Arg("name", () => String, { nullable: true }) name?: string,
  ) {
    return editEquipment(ctx, { equipmentId, name });
  }
}