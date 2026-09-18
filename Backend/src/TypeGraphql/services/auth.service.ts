import bcrypt from "bcrypt";
import type { Response } from "express";
import { createHash, randomBytes } from "node:crypto";
import { PasswordResetToken } from "../../TypeOrm/entity/password-reset-token.entity.js";
import { User } from "../../TypeOrm/entity/user.entity.js";
import { Role } from "../../TypeOrm/entity/enums.js";
import {
  passwordResetToken,
  userRepository,
} from "../../TypeOrm/repositorites/repository.js";
import { AppDataSource } from "../../TypeOrm/config/data-source.js";
import {
  checkemail,
  checkFirstName,
  checkLastName,
  checkPassword,
} from "../../Validation/auth.validation.js";
import { accessCookieOptions, setToken } from "../../utils/jwt-cookie.js";
import { sendResetEmail } from "../../utils/email.js";
import { mapUser } from "./entity.mapper.js";

export type SignUpArgs = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type LogInArgs = {
  email: string;
  password: string;
};

export type AuthPayload = {
  success: boolean;
  msg: string;
  user: ReturnType<typeof mapUser> | null;
};

export type BasicResponse = {
  success: boolean;
  msg: string;
};

export async function signUp(args: SignUpArgs): Promise<AuthPayload> {
  checkFirstName(args.firstname);
  checkLastName(args.lastname);
  checkemail(args.email);
  checkPassword(args.password);

  const email = args.email.toLowerCase().trim();
  const existUser = await userRepository.findOne({ where: { email } });
  if (existUser) {
    throw new Error("Email already exist");
  }

  const hashPassword = await bcrypt.hash(args.password.trim(), 10);
  const user = userRepository.create({
    firstname: args.firstname.trim(),
    lastname: args.lastname.trim(),
    email,
    password: hashPassword,
    role: Role.EMPLOYEE,
  });
  const saved = await userRepository.save(user);

  return { success: true, msg: "user signup successfully", user: mapUser(saved) };
}

export async function logIn(
  args: LogInArgs,
  res: Response,
): Promise<AuthPayload> {
  checkemail(args.email);
  checkPassword(args.password);

  const userExist = await userRepository.findOne({
    where: { email: args.email.toLowerCase().trim() },
  });
  if (!userExist) {
    throw new Error("Email does not exist");
  }
  if (userExist.role !== Role.EMPLOYEE) {
    throw new Error("Not Authenticated");
  }

  const match = await bcrypt.compare(args.password, userExist.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  setToken(res, userExist.id, userExist.role as "EMPLOYEE" | "ADMIN");

  return {
    success: true,
    msg: "Login successfully",
    user: mapUser(userExist),
  };
}

export async function adminLogIn(
  args: LogInArgs,
  res: Response,
): Promise<AuthPayload> {
  const email = checkemail(args.email);
  const password = checkPassword(args.password);

  const admin = await userRepository.findOne({ where: { email } });
  if (!admin || admin.role !== Role.ADMIN) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  setToken(res, admin.id, admin.role as "EMPLOYEE" | "ADMIN");

  return {
    success: true,
    msg: "Admin login successfully",
    user: mapUser(admin),
  };
}

export function logOut(res: Response): AuthPayload {
  res.clearCookie("accessToken", accessCookieOptions);
  return { success: true, msg: "loged out successfully", user: null };
}

export async function forgotPassword(args: { email: string }): Promise<BasicResponse> {
  const email = args.email.toLocaleLowerCase().trim();
  checkemail(email);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    return {
      success: true,
      msg: "If the email exists, a reset link has been sent.",
    };
  }

  await passwordResetToken.delete({ userId: user.id });

  const resetToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(resetToken).digest("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const token = passwordResetToken.create({
    tokenHash,
    userId: user.id,
    expiresAt,
  });
  await passwordResetToken.save(token);

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendResetEmail(user.email, resetUrl);

  return {
    success: true,
    msg: "If the email exists, a reset link has been sent.",
  };
}

export async function resetPassword(args: {
  token: string;
  password: string;
}): Promise<BasicResponse> {
  checkPassword(args.password);

  const tokenHash = createHash("sha256").update(args.token).digest("hex");
  const resetToken = await passwordResetToken.findOne({ where: { tokenHash } });

  if (!resetToken) {
    throw new Error("Invalid or expired reset link");
  }
  if (resetToken.usedAt) {
    throw new Error("Reset link has already been used");
  }
  if (resetToken.expiresAt < new Date()) {
    throw new Error("Reset link has expired");
  }

  const hashedPassword = await bcrypt.hash(args.password, 10);

  await AppDataSource.transaction(async (manager) => {
    await manager.getRepository(User).update(
      { id: resetToken.userId },
      { password: hashedPassword },
    );
    await manager.getRepository(PasswordResetToken).update(
      { id: resetToken.id },
      { usedAt: new Date() },
    );
  });

  return { success: true, msg: "Password reset successfully" };
}