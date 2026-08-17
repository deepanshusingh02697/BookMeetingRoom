import { Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt-cookie";
import { Server } from "socket.io";

export type Context = {
  userId: number | null;
  req: Request;
  res: Response;
  role: "EMPLOYEE" | "ADMIN" | null;
  io:Server;
};

export const createCheckAuth = (io:Server)=>async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> => {
  let userId: number | null = null;
  let role: Context["role"] = null;

  const accessToken = req.cookies?.accessToken;

  if (accessToken) {
    try {
      const decoded = verifyAccessToken(accessToken);
      userId = decoded.userId;
      role = decoded.role;
    } catch (_error) {
      userId = null;
    }
  }
  return { req, res, userId, role,io };
};
