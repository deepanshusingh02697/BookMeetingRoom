import { Ctx, Query, Resolver } from "type-graphql";
import { Context } from "../../middleware/context.js";
import { UserType } from "../Types/user.type.js";
import { getEmployees, getCurrentUser } from "../services/user.service.js";

@Resolver()
export class UserResolver {
  @Query(() => UserType)
  async CurrUser(@Ctx() ctx: Context) {
    return getCurrentUser(ctx.userId!);
  }

  @Query(() => [UserType])
  async Users(@Ctx() ctx: Context) {
    return getEmployees(ctx);
  }
}