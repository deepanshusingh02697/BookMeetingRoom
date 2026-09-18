import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Context } from "../../middleware/context.js";
import {
  AuthPayloadType,
  BasicResponseType,
} from "../Types/payload.type.js";
import {
  adminLogIn,
  forgotPassword,
  logIn,
  logOut,
  resetPassword,
  signUp,
} from "../services/auth.service.js";

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthPayloadType)
  async SignUp(
    @Arg("firstname", () => String) firstname: string,
    @Arg("lastname", () => String) lastname: string,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
  ) {
    return signUp({ firstname, lastname, email, password });
  }

  @Mutation(() => AuthPayloadType)
  async LogIn(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: Context,
  ) {
    return logIn({ email, password }, ctx.res);
  }

  @Mutation(() => AuthPayloadType)
  async AdminLogIn(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: Context,
  ) {
    return adminLogIn({ email, password }, ctx.res);
  }

  @Mutation(() => AuthPayloadType)
  async LogOut(@Ctx() ctx: Context) {
    return logOut(ctx.res);
  }

  @Mutation(() => BasicResponseType)
  async ForgotPassword(@Arg("email", () => String) email: string) {
    return forgotPassword({ email });
  }

  @Mutation(() => BasicResponseType)
  async ResetPassword(
    @Arg("token", () => String) token: string,
    @Arg("password", () => String) password: string,
  ) {
    return resetPassword({ token, password });
  }
}