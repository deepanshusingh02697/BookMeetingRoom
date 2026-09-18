import { Context } from "../../middleware/context.js";
import { BookingStatus } from "../../TypeOrm/entity/enums.js";
import {
  bookingRepository,
  checkInRepository,
  participantRepository,
} from "../../TypeOrm/repositorites/repository.js";
import { checkInAllow } from "../../Validation/booking.validation.js";
import { isAuth } from "../../Validation/auth.validation.js";
import { loadBookingById } from "./booking.service.js";
import { mapBooking, mapCheckIn } from "./entity.mapper.js";

export async function checkInToBooking(ctx: Context, bookingId: number) {
  isAuth(ctx);
  const booking = await bookingRepository.findOne({
    where: { id: bookingId },
  });
  if (!booking) {
    throw new Error("booking does not exist");
  }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error("booking is not confirmd yet");
  }

  const organizer = booking.organizerId === ctx.userId;
  const participant = await participantRepository.findOne({
    where: { bookingId, userId: ctx.userId! },
  });
  if (!organizer && !participant) {
    throw new Error("Not allowed to checkin in meeting");
  }

  checkInAllow(booking.startTime);

  const findCheckIn = await checkInRepository.findOne({
    where: { bookingId },
  });
  if (findCheckIn) {
    throw new Error("booking already checked in");
  }

  const created = checkInRepository.create({
    bookingId,
    checkInBy: ctx.userId!,
  });
  const saved = await checkInRepository.save(created);

  const full = await checkInRepository.findOne({
    where: { id: saved.id },
    relations: { user: true },
  });
  if (!full) {
    throw new Error("booking does not exist");
  }

  const fullBooking = await loadBookingById(bookingId);
  const bookingShape = await mapBooking(fullBooking);

  return {
    success: true,
    msg: "Checked in successfully",
    checkIn: await mapCheckIn(full, bookingShape),
  };
}