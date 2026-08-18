import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  RoomStatus,
} from "../generated/prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("Adm123@&", 10);
  const employeePassword = await bcrypt.hash("Emp123@&", 10);
  const _admin = await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {},
    create: {
      firstname: "Admin",
      lastname: "User",
      email: "admin@gmail.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  const _employee1 = await prisma.user.upsert({
    where: {
      email: "ram@gmail.com",
    },
    update: {},
    create: {
      firstname: "Ram",
      lastname: "Kumar",
      email: "ram@gmail.com",
      password: employeePassword,
      role: Role.EMPLOYEE,
    },
  });

  const _employee2 = await prisma.user.upsert({
    where: {
      email: "rohan@gmail.com",
    },
    update: {},
    create: {
      firstname: "Rohan",
      lastname: "Kumar",
      email: "rohan@gmail.com",
      password: employeePassword,
      role: Role.EMPLOYEE,
    },
  });
  const room1 = await prisma.room.upsert({
    where: {
      name: "Conference Room A",
    },
    update: {},
    create: {
      name: "Conference Room A",
      capacity: 10,
      floor: 1,
      location: "Building A",
      status: RoomStatus.AVAILABLE,
    },
  });

  const _room2 = await prisma.room.upsert({
    where: {
      name: "Meeting Room B",
    },
    update: {},
    create: {
      name: "Meeting Room B",
      capacity: 6,
      floor: 2,
      location: "Building B",
      status: RoomStatus.AVAILABLE,
    },
  });
  const projector = await prisma.equipment.upsert({
    where: {
      name: "Projector",
    },
    update: {},
    create: {
      name: "Projector",
    },
  });

  const whiteboard = await prisma.equipment.upsert({
    where: {
      name: "Whiteboard",
    },
    update: {},
    create: {
      name: "Whiteboard",
    },
  });
  await prisma.roomEquipment.upsert({
    where: {
      roomId_equipmentId: {
        roomId: room1.id,
        equipmentId: projector.id,
      },
    },
    update: {},
    create: {
      roomId: room1.id,
      equipmentId: projector.id,
    },
  });

  await prisma.roomEquipment.upsert({
    where: {
      roomId_equipmentId: {
        roomId: room1.id,
        equipmentId: whiteboard.id,
      },
    },
    update: {},
    create: {
      roomId: room1.id,
      equipmentId: whiteboard.id,
    },
  });
}

main()
  .catch((_error) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
