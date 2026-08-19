import { Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt-cookie";
import { Server } from "socket.io";
import { prisma } from "../lib/prisma";

export type Context = {
  userId: number | null;
  req: Request;
  res: Response;
  role: "EMPLOYEE" | "ADMIN" | null;
  io: Server;
};

export const createCheckAuth =
  (io: Server) =>async ({ req, res }: { req: Request; res: Response }):Promise<Context> => {
    let userId: number | null = null;
    let role: Context["role"] = null;

    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
      try {
        const decoded = verifyAccessToken(accessToken);
        userId = decoded.userId;
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            role: true,
          },
        });
        if (user) {
          role = user.role;
        } else {
          userId = null;
          role = null;
        }
      } catch (_error) {
        userId = null;
        role = null;
      }
    }
    return { req, res, userId, role, io };
  };
