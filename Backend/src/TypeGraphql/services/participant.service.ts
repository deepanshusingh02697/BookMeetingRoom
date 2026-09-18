import { Context } from "../../middleware/context.js";
import { BookingStatus } from "../../TypeOrm/entity/enums.js";
import {
  bookingRepository,
  participantRepository,
  userRepository,
} from "../../TypeOrm/repositorites/repository.js";
import { isAuth } from "../../Validation/auth.validation.js";
import { loadBookingById } from "./booking.service.js";
import { mapBooking } from "./entity.mapper.js";

export async function addParticipant(
  ctx: Context,
  args: { bookingId: number; userId: number },
) {
  isAuth(ctx);
  const booking = await bookingRepository.findOne({
    where: { id: args.bookingId },
    relations: { participants: true, room: true },
  });
  if (!booking) {
    throw new Error("Booking does not exist");
  }

  const organizer = booking.organizerId === ctx.userId;
  const admin = ctx.role === "ADMIN";
  if (!organizer && !admin) {
    throw new Error("not allow to add participants");
  }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error("can't add participant");
  }

  const userExist = await userRepository.findOne({
    where: { id: args.userId },
  });
  if (!userExist) {
    throw new Error("user does not exist");
  }

  const alreadyParticipant = await participantRepository.findOne({
    where: { bookingId: args.bookingId, userId: args.userId },
  });
  if (alreadyParticipant) {
    throw new Error("user is already a participant for this booking");
  }

  const totalPeople = 1 + booking.participants.length + 1;
  if (totalPeople > booking.room.capacity) {
    throw new Error("people can't be greater than the room capacity");
  }

  const row = participantRepository.create({
    bookingId: args.bookingId,
    userId: args.userId,
  });
  await participantRepository.save(row);

  const updated = await loadBookingById(args.bookingId);

  ctx.io.to(`user:${args.userId}`).emit("notify", {
    message: "You are added to meeting",
    bookingId: args.bookingId,
  });

  return {
    success: true,
    msg: "Participant added successfully",
    booking: await mapBooking(updated),
  };
}

export async function removeParticipant(
  ctx: Context,
  args: { bookingId: number; userId: number },
) {
  isAuth(ctx);
  const booking = await bookingRepository.findOne({
    where: { id: args.bookingId },
  });
  if (!booking) {
    throw new Error("Booking does not exist");
  }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error("Can't remove participant");
  }

  const organizer = booking.organizerId === ctx.userId;
  const admin = ctx.role === "ADMIN";
  const selfRemove = Number(args.userId) === Number(ctx.userId);
  if (!organizer && !admin && !selfRemove) {
    throw new Error("Not authenticated to remove participat");
  }

  const existingParticipant = await participantRepository.findOne({
    where: { bookingId: args.bookingId, userId: args.userId },
  });
  if (!existingParticipant) {
    throw new Error("user is not participant");
  }

  await participantRepository.delete({
    bookingId: args.bookingId,
    userId: args.userId,
  });

  const updated = await loadBookingById(args.bookingId);

  ctx.io.to(`user:${args.userId}`).emit("notify", {
    message: "You are removed from meeting",
    bookingId: args.bookingId,
  });

  return {
    success: true,
    msg: "Removed successfully",
    booking: await mapBooking(updated),
  };
}