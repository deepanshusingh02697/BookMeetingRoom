import { Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt-cookie";

export type Context = {
  userId: number | null;
  req: Request;
  res: Response;
  role: "EMPLOYEE" | "ADMIN" | null;
};

export const createCheckAuth = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> => {
  console.log("COOKIES:", req.cookies);
  let userId: number | null = null;
  let role: Context["role"] = null;

  const accessToken = req.cookies?.accessToken;

  if (accessToken) {
    try {
      const decoded = verifyAccessToken(accessToken);
      userId = decoded.userId;
      role = decoded.role;
    } catch (error) {
      userId = null;
    }
  }
  return { req, res, userId, role };
};
