import jwt from "jsonwebtoken";
import type { Response } from "express";
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
if (!ACCESS_SECRET) {
  throw new Error("Secret not provided key for generating access and refresh token");
}
type Role = "EMPLOYEE" | "ADMIN";
const signAccessToken = (userId: number, role: Role) => {
  return jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: "7d" });
};

export const accessCookieOptions = {
  httpOnly: true,
  secure: true,//false
  sameSite: "lax" as const,//"none"
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};
export const setToken = (res: Response, userId: number, role: Role) => {
  const accessToken = signAccessToken(userId, role);
  res.cookie("accessToken", accessToken, accessCookieOptions);
};

export const verifyAccessToken = (token: string): { userId: number; role: Role } => {
  return jwt.verify(token, ACCESS_SECRET) as { userId: number; role: Role };
};