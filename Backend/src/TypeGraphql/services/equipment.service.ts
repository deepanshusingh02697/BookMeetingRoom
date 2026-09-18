import { Not } from "typeorm";
import { Context } from "../../middleware/context.js";
import { equipmentRepository } from "../../TypeOrm/repositorites/repository.js";
import { isAdmin, isAuth } from "../../Validation/auth.validation.js";
import { checkName } from "../../Validation/room.validation.js";
import { mapEquipment } from "./entity.mapper.js";

export async function getEquipments(ctx: Context) {
  isAuth(ctx);
  const equipments = await equipmentRepository.find({ order: { id: "ASC" } });
  return equipments.map(mapEquipment);
}

export async function createEquipment(ctx: Context, name: string) {
  isAdmin(ctx);
  const validatedName = checkName(name);
  const equipment = equipmentRepository.create({ name: validatedName });
  const saved = await equipmentRepository.save(equipment);

  return {
    success: true,
    msg: "equipment created successfully",
    equipment: mapEquipment(saved),
  };
}

export async function editEquipment(
  ctx: Context,
  args: { equipmentId: number; name?: string },
) {
  isAdmin(ctx);
  const equip = await equipmentRepository.findOne({
    where: { id: args.equipmentId },
  });
  if (!equip) {
    throw new Error("Equipment does not exist");
  }
  if (args.name?.trim() === undefined) {
    throw new Error("Equipment name is required");
  }

  const name = checkName(args.name);
  const existingEquipment = await equipmentRepository.findOne({
    where: { name, id: Not(args.equipmentId) },
  });
  if (existingEquipment) {
    throw new Error("Equipment name already exists");
  }

  equip.name = name;
  const saved = await equipmentRepository.save(equip);

  return {
    success: true,
    msg: "Equipment updated successfully",
    equipment: mapEquipment(saved),
  };
}