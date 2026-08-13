import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import {
  checkemail,
  checkFirstName,
  checkLastName,
  checkPassword,
  isAdmin,
  isAuth,
} from "../../Validation/auth.validation";
import { Context } from "../../middleware/context";
import { accessCookieOptions, setToken } from "../../utils/jwt-cookie";
import { GraphQLError } from "graphql/error";
import {
  checkCapacity,
  checkFloor,
  checkLocation,
  checkName,
} from "../../Validation/room.validation";
import {
  buildRecurDates,
  checkIn_Min,
  checkInAllow,
  checkTime,
  checkTitle,
} from "../../Validation/booking.validation";
import { convertWeightlist } from "../../utils/WatilistConvert";
import { randomUUID } from "node:crypto";
import { Prisma } from "../../../generated/prisma/client";

export const resolvers = {
  Query: {
    MyBookings: async (_parent: unknown, _args: unknown, ctx: Context) => {
      isAuth(ctx);
      return prisma.booking.findMany({
        where: { organizerId: ctx.userId! },
        include: {
          room: true,
          organizer: true,
          participants: {
            include: { user: true },
          },
          checkIn: { include: { user: true } },
        },
        orderBy: { startTime: "desc" },
      });
    },
    BookingDetails: async (
      _parent: unknown,
      args: { id: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const booking = await prisma.booking.findUnique({
        where: { id: args.id },
        include: {
          room: true,
          organizer: true,
          participants: { include: { user: true } },
          checkIn: { include: { user: true } },
        },
      });

      if (!booking) {
        throw new Error("Booking does not exist");
      }

      const organiser = booking.organizerId === ctx.userId;
      const admin = ctx.role === "ADMIN";

      if (!organiser && !admin) {
        throw new Error("You are not allowed to view this booking");
      }
      return booking;
    },

    MyWaitlist: async (_parent: unknown, _args: unknown, ctx: Context) => {
      isAuth(ctx);
      return prisma.waitlistEntry.findMany({
        where: { userId: ctx.userId! },
        include: { room: true, user: true },
        orderBy: { createdAt: "asc" },
      });
    },

    RecurringBookingGroup: async (
      _parent: unknown,
      args: { recurrenceId: string },
      ctx: Context,
    ) => {
      isAuth(ctx);
      return prisma.booking.findMany({
        where: { recurrenceId: args.recurrenceId },
        include: {
          room: true,
          organizer: true,
          participants: { include: { user: true } },
          checkIn: { include: { user: true } },
        },
        orderBy: { startTime: "asc" },
      });
    },

    AdminCalender: async (
      _parent: unknown,
      args: { startDate: string; endDate: string },
      ctx: Context,
    ) => {
      isAdmin(ctx);
      const { start, end } = checkTime(args.startDate, args.endDate);

      return prisma.booking.findMany({
        where: {
          startTime: { gte: start },
          endTime: { lte: end },
        },
        include: {
          room: true,
          organizer: true,
          participants: { include: { user: true } },
          checkIn: { include: { user: true } },
        },
        orderBy: { startTime: "asc" },
      });
    },
    UsedAnalytics: async (
      _parent: unknown,
      args: { startDate: string; endDate: string },
      ctx: Context,
    ) => {
      isAdmin(ctx);
      const { start, end } = checkTime(args.startDate, args.endDate);
      const bookings = await prisma.booking.findMany({
        where: {
          startTime: { gte: start },
          endTime: { lte: end },
        },
        include: {
          room: true,
        },
      });

      const roomThingsMap = new Map();
      let totalCancel = 0;
      let totalNoshow = 0;
      for (const booking of bookings) {
        if (!roomThingsMap.has(booking.roomId)) {
          roomThingsMap.set(booking.roomId, {
            room: booking.room,
            totalBookings: 0,
            cancelledCount: 0,
            noShowCount: 0,
            completedCount: 0,
          });
        }
        const stat = roomThingsMap.get(booking.roomId)!;
        stat.totalBookings += 1;
        if (booking.status === "CANCELLED") {
          stat.cancelledCount += 1;
          totalCancel += 1;
        }
        if (booking.status === "NO_SHOW") {
          stat.noShowCount += 1;
          totalNoshow += 1;
        }
        if (booking.status === "COMPLETED") {
          stat.completedCount += 1;
        }
      }
      console.log("value for the room things : ", roomThingsMap);
      return {
        totalBookings: bookings.length,
        totalCancelled: totalCancel,
        totalNoShow: totalNoshow,
        utilizeByRoom: Array.from(roomThingsMap.values()),
      };
    },
    RoomMaintinance: async (
      _parent: unknown,
      args: { roomId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);
      return prisma.maintenance.findMany({
        where: { roomId: args.roomId },
        orderBy: { startTime: "asc" },
      });
    },
    SearchRooms: async (
      _parent: unknown,
      args: {
        startTime: string;
        endTime: string;
        capacity?: number;
        floor?: number;
        equipmentIds?: number[];
        status?: "AVAILABLE" | "DISABLED";
      },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const { start, end } = checkTime(args.startTime, args.endTime);
      const rooms = await prisma.room.findMany({
        where: {
          status: args.status ?? "AVAILABLE",
          ...(args.capacity !== undefined && {
            capacity: { gte: args.capacity },
          }),
          ...(args.floor !== undefined && { floor: args.floor }),
          ...(args.equipmentIds?.length && {
            AND: args.equipmentIds.map((equipmentId) => ({
              roomEquipments: {
                some: {
                  equipmentId: equipmentId,
                },
              },
            })),
          }),
          bookings: {
            none: {
              status: "CONFIRMED",
              startTime: {lt: end},
              endTime: {gt: start},
            },
          },
          maintenance: {
            none: {
              startTime: {
                lt: end,
              },
              endTime: {
                gt: start,
              },
            },
          },
        },
      });
      return rooms
    },
  },
  Mutation: {
    SignUp: async (
      _parent: unknown,
      args: {
        firstname: string;
        lastname: string;
        email: string;
        password: string;
      },
      _ctx: unknown,
    ) => {
      checkFirstName(args.firstname);
      checkLastName(args.lastname);
      checkemail(args.email);
      checkPassword(args.password);

      const existUser = await prisma.user.findUnique({
        where: { email: args.email },
      });

      if (existUser) throw new Error("Email already exist");

      const hashPassword = await bcrypt.hash(args.password.trim(), 10);

      const user = await prisma.user.create({
        data: {
          firstname: args.firstname.trim(),
          lastname: args.lastname.trim(),
          email: args.email.toLowerCase().trim(),
          password: hashPassword,
        },
      });
      const { password: _, ...safeUser } = user;

      return { success: true, msg: "user signup successfully", user: safeUser };
    },
    LogIn: async (
      _parent: unknown,
      args: { email: string; password: string },
      ctx: Context,
    ) => {
      checkemail(args.email);
      checkPassword(args.password);
      const userExist = await prisma.user.findUnique({
        where: { email: args.email.toLowerCase().trim() },
      });
      if (!userExist) throw new Error("Email does not exist");

      if (userExist.role !== "EMPLOYEE") {
        throw new Error("Not Authenticated");
      }
      const match = await bcrypt.compare(args.password, userExist.password);
      if (!match) throw new Error("Invalid credentials");

      setToken(ctx.res, userExist.id, userExist.role);

      return { success: true, msg: "Login successfully", user: userExist };
    },
    AdminLogIn: async (
      _parent: unknown,
      args: { email: string; password: string },
      ctx: Context,
    ) => {
      const email = checkemail(args.email);
      const password = checkPassword(args.password);

      const admin = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!admin || admin.role !== "ADMIN") {
        throw new Error("Invalid credentials");
      }
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        throw new Error("Invalid credentials");
      }
      setToken(ctx.res, admin.id, admin.role);
      const { password: _, ...safeUser } = admin;
      return {
        success: true,
        msg: "Admin login successfully",
        user: safeUser,
      };
    },
    LogOut: async (_parent: unknown, _args: unknown, ctx: Context) => {
      if (!ctx.userId) {
        throw new Error("Not authenticated to logout");
      }
      ctx.res.clearCookie("accessToken", accessCookieOptions);
      return { success: true, msg: "loged out successfully" };
    },

    AddParticipant: async (
      _parent: unknown,
      args: { bookingId: number; userId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const booking = await prisma.booking.findUnique({
        where: { id: args.bookingId },
        include: { participants: true, room: true },
      });
      if (!booking) {
        throw new Error("Booking does not exist");
      }
      const organizer = booking.organizerId === ctx.userId;
      const admin = ctx.role === "ADMIN";
      if (!organizer && !admin) {
        throw new Error("not allow to add participants");
      }
      if (booking.status !== "CONFIRMED") {
        throw new Error("can't add participant");
      }
      const userExist = await prisma.user.findUnique({
        where: { id: args.userId },
      });
      if (!userExist) {
        throw new Error("user does not exist");
      }
      const alreadyParticipant = await prisma.participants.findUnique({
        where: {
          bookingId_userId: {
            bookingId: args.bookingId,
            userId: args.userId,
          },
        },
      });
      if (alreadyParticipant) {
        throw new Error("user is already a participant for this booking");
      }
      const totalPeople = 1 + booking.participants.length + 1;
      if (totalPeople > booking.room.capacity) {
        throw new Error("people can't be greater than the room capacity");
      }
      await prisma.participants.create({
        data: {
          bookingId: args.bookingId,
          userId: args.userId,
        },
      });
      const updatedBooking = await prisma.booking.findUnique({
        where: { id: args.bookingId },
        include: {
          room: true,
          organizer: true,
          participants: { include: { user: true } },
          checkIn: { include: { user: true } },
        },
      });
      return {
        success: true,
        msg: "Participant added successfully",
        booking: updatedBooking,
      };
    },
    RemoveParticipant: async (
      _parent: unknown,
      args: { bookingId: number; userId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const booking = await prisma.booking.findUnique({
        where: { id: args.bookingId },
      });
      if (!booking) {
        throw new Error("Booking does not exist");
      }

      const organizer = booking.organizerId === ctx.userId;
      const admin = ctx.role === "ADMIN";

      if (!organizer && !admin) {
        throw new Error("Not authenticated to remove participat");
      }

      const existingParticipant = await prisma.participants.findUnique({
        where: {
          bookingId_userId: {
            bookingId: args.bookingId,
            userId: args.userId,
          },
        },
      });
      if (!existingParticipant) {
        throw new Error("user is not participant");
      }
      await prisma.participants.delete({
        where: {
          bookingId_userId: {
            bookingId: args.bookingId,
            userId: args.userId,
          },
        },
      });
      const updatedBooking = await prisma.booking.findUnique({
        where: { id: args.bookingId },
        include: {
          room: true,
          organizer: true,
          participants: { include: { user: true } },
          checkIn: { include: { user: true } },
        },
      });
      return {
        success: true,
        msg: "Participant removed successfully",
        booking: updatedBooking,
      };
    },

    CreateRoom: async (
      _parent: unknown,
      args: {
        name: string;
        capacity: number;
        floor: number;
        location: string;
      },
      ctx: Context,
    ) => {
      isAdmin(ctx);
      const name = checkName(args.name);
      const capacity = checkCapacity(args.capacity);
      const floor = checkFloor(args.floor);
      const location = checkLocation(args.location);

      const existingRoom = await prisma.room.findUnique({ where: { name } });
      if (existingRoom) {
        throw new GraphQLError("room already exist", {
          extensions: {
            code: "BAD_INPUT",
            field: "name",
          },
        });
      }
      const room = await prisma.room.create({
        data: {
          name,
          capacity,
          floor,
          location,
        },
      });
      return {
        success: true,
        msg: "room created",
        room,
      };
    },
    UpdateRoom: async (
      _parent: unknown,
      args: {
        id: string;
        name?: string;
        capacity?: number;
        floor?: number;
        location?: string;
      },
      ctx: Context,
    ) => {
      isAdmin(ctx);
      const updateRoom = await prisma.room.update({
        where: {
          id: Number(args.id),
        },
        data: {
          ...(args.name !== undefined && { name: args.name.trim() }),
          ...(args.capacity !== undefined && { capacity: args.capacity }),
          ...(args.floor !== undefined && { floor: args.floor }),
          ...(args.location !== undefined && { location: args.location }),
        },
      });
      return {
        success: true,
        msg: "room updated",
        room: updateRoom,
      };
    },
    DisableRoom: async (
      _parent: unknown,
      args: { id: number },
      ctx: Context,
    ) => {
      isAdmin(ctx);
      const room = await prisma.room.findUnique({ where: { id: args.id } });
      if (!room) {
        throw new Error("room does not exist");
      }
      const udpateroom = await prisma.room.update({
        where: {
          id: args.id,
        },
        data: {
          status: "DISABLED",
        },
      });
      return {
        success: true,
        msg: "room disable successfully",
        room: udpateroom,
      };
    },
    EnableRoom: async (
      _parent: unknown,
      args: { id: number },
      ctx: Context,
    ) => {
      isAdmin(ctx);
      const room = await prisma.room.findUnique({ where: { id: args.id } });
      if (!room) {
        throw new Error("room does not exist");
      }
      const udpateRoom = await prisma.room.update({
        where: { id: args.id },
        data: { status: "AVAILABLE" },
      });
      return {
        success: true,
        msg: "room enable successfully",
        room: udpateRoom,
      };
    },

    CreateEquipment: async (
      _parent: unknown,
      args: {
        name: string;
      },
      ctx: Context,
    ) => {
      isAdmin(ctx);
      const name = checkName(args.name);
      const equipment = await prisma.equipment.create({
        data: {
          name,
        },
      });
      return {
        success: true,
        msg: "equipment created successfully",
        equipment,
      };
    },
    AddEquipmentToRoom: async (
      _parent: unknown,
      args: {
        roomId: number;
        equipmentId: number;
      },
      ctx: Context,
    ) => {
      isAdmin(ctx);
      const roomExist = await prisma.room.findUnique({
        where: {
          id: args.roomId,
        },
      });
      if (!roomExist) {
        throw new Error("Room does not exist");
      }
      const eqExist = await prisma.equipment.findUnique({
        where: {
          id: args.equipmentId,
        },
      });

      if (!eqExist) {
        throw new Error("Equipment does not exist");
      }
      const checkeq = await prisma.roomEquipment.findUnique({
        where: {
          roomId_equipmentId: {
            roomId: args.roomId,
            equipmentId: args.equipmentId,
          },
        },
      });
      if (checkeq) {
        throw new Error("equipment is already added");
      }
      await prisma.roomEquipment.create({
        data: {
          roomId: args.roomId,
          equipmentId: args.equipmentId,
        },
      });

      const room = await prisma.room.findUnique({
        where: {
          id: args.roomId,
        },
        include: {
          roomEquipments: {
            include: {
              equipment: true,
            },
          },
        },
      });

      return {
        success: true,
        msg: "equipment added successfully",
        room,
      };
    },
    RemoveEquipmentFromRoom: async (
      _parent: unknown,
      args: {
        roomId: number;
        equipmentId: number;
      },
      ctx: Context,
    ) => {
      isAdmin(ctx);
      const checkData = await prisma.roomEquipment.findUnique({
        where: {
          roomId_equipmentId: {
            roomId: args.roomId,
            equipmentId: args.equipmentId,
          },
        },
      });
      console.log(checkData);
      if (!checkData) {
        throw new Error("Equipment is not assigned to this room");
      }
      await prisma.roomEquipment.delete({
        where: {
          roomId_equipmentId: {
            roomId: args.roomId,
            equipmentId: args.equipmentId,
          },
        },
      });
      const room = await prisma.room.findUnique({
        where: {
          id: args.roomId,
        },
        include: {
          roomEquipments: {
            include: {
              equipment: true,
            },
          },
        },
      });
      return {
        success: true,
        msg: "equipment removed succcessfully",
        room,
      };
    },

    CreateBooking: async (
      _parent: unknown,
      args: {
        roomId: number;
        title: string;
        description?: string;
        startTime: string;
        endTime: string;
        participantUserIds?: number[];
        recurringFreq?: "DAILY" | "WEEKLY";
        recurrenceEndDate?: string;
      },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const { start, end } = checkTime(args.startTime, args.endTime);
      const title = checkTitle(args.title);
      const room = await prisma.room.findUnique({ where: { id: args.roomId } });
      if (!room) {
        throw new Error("Room does not exit for creating booking");
      }
      if (room.status !== "AVAILABLE") {
        throw new Error("room is not available");
      }
      const totalPeople = 1 + (args.participantUserIds?.length ?? 0);
      if (totalPeople > room.capacity) {
        throw new Error(
          "people can not be greater than room capcity",
        );
      }
      if (args.recurringFreq) {
        if (!args.recurrenceEndDate) {
          throw new Error(
            "recurrence end date required",
          );
        }
        const recuEndDate = new Date(args.recurrenceEndDate);
        const occur = buildRecurDates(
          start,
          end,
          args.recurringFreq,
          recuEndDate,
        );
        console.log("occurence booking : ", occur);
        const recurrenceId = randomUUID();
        const bookings = await prisma.$transaction(
          async (tx) => {
            for (const occ of occur) {
              const overlap = await tx.booking.findFirst({
                where: {
                  roomId: args.roomId,
                  status: "CONFIRMED",
                  startTime: { lt: occ.end },
                  endTime: { gt: occ.start },
                },
              });
              if (overlap) {
                throw new Error(
                  `Room is already booked on Date ${occ.start.toDateString()}`,
                );
              }
            }
            const created = [];
            for (let occ of occur) {
              const newBooking = await tx.booking.create({
                data: {
                  roomId: args.roomId,
                  organizerId: ctx.userId!,
                  title,
                  description: args.description?.trim(),
                  startTime: occ.start,
                  endTime: occ.end,
                  isRecurring: true,
                  recurrenceId,
                  recurrenceRule: {
                    frequency: args.recurringFreq,
                    endDate: args.recurrenceEndDate,
                  },
                },
                include: {
                  room: true,
                  organizer: true,
                  participants: { include: { user: true } },
                  checkIn: { include: { user: true } },
                },
              });
              created.push(newBooking);
            }
            if (args.participantUserIds && args.participantUserIds.length > 0) {
              for (let booking of created) {
                await tx.participants.createMany({
                  data: args.participantUserIds.map((userId) => ({
                    bookingId: booking.id,
                    userId,
                  })),
                });
              }
            }
            const finalBookings = await Promise.all(
              created.map((bk) =>
                tx.booking.findUnique({
                  where: { id: bk.id },
                  include: {
                    room: true,
                    organizer: true,
                    participants: { include: { user: true } },
                    checkIn: { include: { user: true } },
                  },
                }),
              ),
            );
            return finalBookings;
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
        return {
          success: true,
          msg: `${bookings.length} recurring bookings created successfully`,
          booking: bookings[0],
        };
      }

      const booking = await prisma.$transaction(
        async (tx) => {
          const overlap = await tx.booking.findFirst({
            where: {
              roomId: args.roomId,
              status: "CONFIRMED",
              startTime: { lt: end },
              endTime: { gt: start },
            },
          });
          if (overlap) {
            throw new Error("Room already booked for this time");
          }
          const newbooking = await tx.booking.create({
            data: {
              roomId: args.roomId,
              organizerId: ctx.userId!,
              title,
              description: args.description?.trim(),
              startTime: start,
              endTime: end,
            },
            include: {
              room: true,
              organizer: true,
              participants: { include: { user: true } },
              checkIn: { include: { user: true } },
            },
          });
          if (args.participantUserIds && args.participantUserIds.length > 0) {
            await tx.participants.createMany({
              data: args.participantUserIds.map((userId) => ({
                bookingId: newbooking.id,
                userId,
              })),
            });
          }
          return tx.booking.findUnique({
            where: { id: newbooking.id },
            include: {
              room: true,
              organizer: true,
              participants: { include: { user: true } },
              checkIn: { include: { user: true } },
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return {
        success: true,
        msg: "booking created successfully",
        booking,
      };
    },
    CancelBooking: async (
      _parent: unknown,
      args: { id: number },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const booking = await prisma.booking.findUnique({
        where: { id: args.id },
      });
      if (!booking) {
        throw new Error("booking does not exist");
      }
      const organiser = booking.organizerId === ctx.userId;
      const admin = ctx.role === "ADMIN";

      if (!organiser && !admin) {
        throw new Error("Not allowed to cancel booking");
      }
      const cancel = await prisma.booking.update({
        where: { id: args.id },
        data: { status: "CANCELLED" },
        include: {
          room: true,
          organizer: true,
          participants: { include: { user: true } },
          checkIn: { include: { user: true } },
        },
      });

      await convertWeightlist(cancel.roomId, cancel.startTime, cancel.endTime);

      return {
        success: true,
        msg: "booking cancel successfully",
        booking: cancel,
      };
    },
    CancelRecurringBooking: async (
      _parent: unknown,
      args: { recurId: string },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const bookings = await prisma.booking.findMany({
        where: { recurrenceId: args.recurId },
      });
      if (bookings.length === 0) {
        throw new Error("recurring bookings does not exist");
      }
      const organizer = bookings[0].organizerId === ctx.userId;
      const admin = ctx.role === "ADMIN";

      if (!organizer && !admin) {
        throw new Error("Not allowed to cancel booking");
      }

      await prisma.booking.updateMany({
        where: { recurrenceId: args.recurId, status: "CONFIRMED" },
        data: { status: "CANCELLED" },
      });
      const bookingToCancel = bookings.filter((bk) => bk.status === "CONFIRMED");
      for (const bk of bookingToCancel) {
        await convertWeightlist(
          bk.roomId,
          bk.startTime,
          bk.endTime,
        );
      }
      return "recurring booking cancel successfully";
    },

    JoinWaitlist: async (
      _parent: unknown,
      args: { roomId: number; startTime: string; endTime: string },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const { start, end } = checkTime(args.startTime, args.endTime);

      const room = await prisma.room.findUnique({
        where: { id: args.roomId },
      });
      if (!room) {
        throw new Error("room does not exist");
      }

      const overlapping = await prisma.booking.findFirst({
        where: {
          roomId: args.roomId,
          status: "CONFIRMED",
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });
      if (!overlapping) {
        throw new Error(
          "no need to join waitlist, room is free",
        );
      }
      const checkExist = await prisma.waitlistEntry.findUnique({
        where: {
          roomId_userId_startTime_endTime: {
            roomId: args.roomId,
            userId: ctx.userId!,
            startTime: start,
            endTime: end,
          },
        },
      });
      if (checkExist) {
        throw new Error("already exist in the waitlist");
      }
      const entry = await prisma.waitlistEntry.create({
        data: {
          roomId: args.roomId,
          userId: ctx.userId!,
          startTime: start,
          endTime: end,
        },
        include: { room: true, user: true },
      });

      return {
        success: true,
        msg: "joined waitlist successfully",
        waitlist: entry,
      };
    },
    LeaveWaitlist: async (
      _parent: unknown,
      args: { id: number },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const checkExist = await prisma.waitlistEntry.findUnique({
        where: { id: args.id },
      });
      if (!checkExist) {
        throw new Error("waitlist entry does not exist");
      }
      if (checkExist.userId !== ctx.userId) {
        throw new Error("Not allowed to leave");
      }
      await prisma.waitlistEntry.delete({ where: { id: args.id } });
      return "removed from waitlist successfully";
    },

    CheckInToBooking: async (
      _parent: unknown,
      args: { bookingId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const booking = await prisma.booking.findUnique({
        where: { id: args.bookingId },
      });
      if (!booking) {
        throw new Error("booking does not exist");
      }
      if (booking.status !== "CONFIRMED") {
        throw new Error("booking is not confirmd yet");
      }
      const organizer = booking.organizerId === ctx.userId;
      const participant = await prisma.participants.findFirst({
        where: { bookingId: args.bookingId, userId: ctx.userId! },
      });
      if (!organizer && !participant) {
        throw new Error("Not allowed to checkin in meeting");
      }

      checkInAllow(booking.startTime);
      
      const findCheckIn = await prisma.checkIn.findUnique({
        where: { bookingId: args.bookingId },
      });
      if (findCheckIn) {
        throw new Error("booking already checked in");
      }

      const checkIn = await prisma.checkIn.create({
        data: {
          bookingId: args.bookingId,
          checkInBy: ctx.userId!,
        },
        include: {
          booking: { include: { room: true, organizer: true } },
          user: true,
        },
      });
      return {
        success: true,
        msg: "Checked in successfully",
        checkIn,
      };
    },
    ReleaseBooking: async (_parent: unknown, _args: unknown, ctx: Context) => {
      isAdmin(ctx);
      const now = new Date();
      const deadline = new Date(now.getTime() - checkIn_Min * 60 * 1000);
      const overdueBks = await prisma.booking.findMany({
        where: {
          status: "CONFIRMED",
          startTime: { lte: deadline },
          checkIn: null,
        },
      });
      console.log("time overdue that 10 min : ", overdueBks);

      for (let booking of overdueBks) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "NO_SHOW" },
        });

        await convertWeightlist(
          booking.roomId,
          booking.startTime,
          booking.endTime,
        );
      }
      await prisma.booking.updateMany({
        where: {
          status: "CONFIRMED",
          endTime: { lte: now },
        },
        data: { status: "COMPLETED" },
      });

      return `${overdueBks.length} bookings relaese due to no checkin`;
    },
    CreateMaint: async (
      _parent: unknown,
      args: {
        roomId: number;
        startTime: string;
        endTime: string;
        reason?: string;
      },
      ctx: Context,
    ) => {
      isAdmin(ctx);
      const { start, end } = checkTime(args.startTime, args.endTime);
      const room = await prisma.room.findUnique({ where: { id: args.roomId } });
      if (!room) {
        throw new Error("Room does not exist");
      }
      const bookingExst = await prisma.booking.findFirst({
        where: {
          roomId: args.roomId,
          status: "CONFIRMED",
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });
      if (bookingExst) {
        throw new Error("booking is present for this time");
      }
      const maintExist = await prisma.maintenance.findFirst({
        where: {
          roomId: args.roomId,
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });
      if (maintExist) {
        throw new Error("miantenance already created");
      }

      const mainte = await prisma.maintenance.create({
        data: {
          roomId: args.roomId,
          startTime: start,
          endTime: end,
          reason: args.reason?.trim(),
        },
        include: { room: true },
      });
      return {
        success: true,
        msg: "maintence created successfully",
        maintinance: mainte,
      };
    },
    DeleteMain: async (
      _parent: unknown,
      args: { id: number },
      ctx: Context,
    ) => {
      isAdmin(ctx);
      const maint = await prisma.maintenance.findUnique({
        where: { id: args.id },
      });
      if (!maint) {
        throw new Error("maintenece does not exist");
      }
      await prisma.maintenance.delete({ where: { id: args.id } });

      return "maintence deleted successfuly";
    },
  },

  Room: {
    equipments: async (parent: { id: number }) => {
      const roomEquipments = await prisma.roomEquipment.findMany({
        where: { roomId: parent.id },
        include: { equipment: true },
      });
      return roomEquipments.map((re) => re.equipment);
    },
  },
};
