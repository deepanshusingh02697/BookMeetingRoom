import { Context } from "../../middleware/context.js";
import { Role } from "../../TypeOrm/entity/enums.js";
import { userRepository } from "../../TypeOrm/repositorites/repository.js";
import { isAuth } from "../../Validation/auth.validation.js";
import { mapUser } from "./entity.mapper.js";

export async function getCurrentUser(userId: number) {
  const user = await userRepository.findOne({ where: { id: userId } });
  return user ? mapUser(user) : null;
}

export async function getEmployees(ctx: Context) {
  isAuth(ctx);
  const users = await userRepository.find({
    where: { role: Role.EMPLOYEE },
    order: { firstname: "ASC" },
  });
  return users.map(mapUser);
}