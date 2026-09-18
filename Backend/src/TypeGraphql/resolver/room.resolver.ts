import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../middleware/context.js";
import { RoomPayloadType } from "../Types/payload.type.js";
import { RoomStatus } from "../Types/enums.type.js";
import { RoomType } from "../Types/room.type.js";
import {
  addEquipmentToRoom,
  createRoom,
  disableRoom,
  enableRoom,
  getRoomDetails,
  getRooms,
  removeEquipmentFromRoom,
  searchRooms,
  updateRoom,
} from "../services/room.service.js";

@Resolver()
export class RoomResolver {
  @Query(() => [RoomType])
  async GetRooms(@Ctx() ctx: Context) {
    return getRooms(ctx);
  }

  @Query(() => RoomType)
  async GetRoomDetails(
    @Arg("roomId", () => Int) roomId: number,
    @Ctx() ctx: Context,
  ) {
    return getRoomDetails(ctx, roomId);
  }

  @Query(() => [RoomType])
  async SearchRooms(
    @Ctx() ctx: Context,
    @Arg("startTime", () => String) startTime: string,
    @Arg("endTime", () => String) endTime: string,
    @Arg("capacity", () => Int, { nullable: true }) capacity?: number,
    @Arg("floor", () => Int, { nullable: true }) floor?: number,
    @Arg("equipmentIds", () => [Int], { nullable: true })
    equipmentIds?: number[],
    @Arg("status", () => RoomStatus, { nullable: true })
    status?: "AVAILABLE" | "DISABLED",
  ) {
    return searchRooms(ctx, {
      startTime,
      endTime,
      capacity,
      floor,
      equipmentIds,
      status,
    });
  }

  @Mutation(() => RoomPayloadType)
  async CreateRoom(
    @Arg("name", () => String) name: string,
    @Arg("capacity", () => Int) capacity: number,
    @Arg("floor", () => Int) floor: number,
    @Arg("location", () => String) location: string,
    @Ctx() ctx: Context,
  ) {
    return createRoom(ctx, { name, capacity, floor, location });
  }

  @Mutation(() => RoomPayloadType)
  async UpdateRoom(
    @Ctx() ctx: Context,
    @Arg("id", () => Int) id: number,
    @Arg("name", () => String, { nullable: true }) name?: string,
    @Arg("capacity", () => Int, { nullable: true }) capacity?: number,
    @Arg("floor", () => Int, { nullable: true }) floor?: number,
    @Arg("location", () => String, { nullable: true }) location?: string,
  ) {
    return updateRoom(ctx, { id, name, capacity, floor, location });
  }

  @Mutation(() => RoomPayloadType)
  async DisableRoom(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: Context,
  ) {
    return disableRoom(ctx, id);
  }

  @Mutation(() => RoomPayloadType)
  async EnableRoom(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: Context,
  ) {
    return enableRoom(ctx, id);
  }

  @Mutation(() => RoomPayloadType)
  async AddEquipmentToRoom(
    @Arg("roomId", () => Int) roomId: number,
    @Arg("equipmentId", () => Int) equipmentId: number,
    @Ctx() ctx: Context,
  ) {
    return addEquipmentToRoom(ctx, { roomId, equipmentId });
  }

  @Mutation(() => RoomPayloadType)
  async RemoveEquipmentFromRoom(
    @Arg("roomId", () => Int) roomId: number,
    @Arg("equipmentId", () => Int) equipmentId: number,
    @Ctx() ctx: Context,
  ) {
    return removeEquipmentFromRoom(ctx, { roomId, equipmentId });
  }
}