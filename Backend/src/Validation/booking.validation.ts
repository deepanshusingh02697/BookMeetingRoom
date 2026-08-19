import { GraphQLError } from "graphql/error";

export const checkTime = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (start <= new Date()) {
    throw new GraphQLError("Booking cannot be in the past", {
      extensions: {
        code: "BAD_INPUT",
        field: "startTime",
      },
    });
  }
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new GraphQLError("Invalid date format", {
      extensions: { code: "BAD_INPUT" },
    });
  }
  if (start >= end) {
    throw new GraphQLError("Start time must be before end time", {
      extensions: { code: "BAD_INPUT", field: "startTime" },
    });
  }
  return { start, end };
};
export const checkTitle = (title: string) => {
  const trimmed = title.trim();
  if (trimmed.length < 3) {
    throw new GraphQLError("Title must be of atleast 3 characters", {
      extensions: { code: "BAD_INPUT", field: "title" },
    });
  }
  return trimmed;
};

export const checkIn_Min = 10;

export const checkInAllow = (startTime: Date) => {
  const now = new Date();
  const timeEnd = new Date(startTime.getTime() + checkIn_Min * 60 * 1000);
  if (now < startTime) {
    throw new Error("CheckIn not open");
  }
  if (now > timeEnd) {
    throw new Error("Checkin time has beem expired");
  }
};

export const buildRecurDates = (
  start: Date,
  end: Date,
  freq: "DAILY" | "WEEKLY",
  recurEndDate: Date,
) => {
  if (isNaN(recurEndDate.getTime())) {
    throw new Error("Invalid recurrence end date");
  }
  const occur: { start: Date; end: Date }[] = [];
  const stepDays = freq === "DAILY" ? 1 : 7;
  const curstart = new Date(start);
  const curEnd = new Date(end);
  recurEndDate.setHours(23, 59, 59, 999);
  while (curstart <= recurEndDate) {
    occur.push({
      start: new Date(curstart),
      end: new Date(curEnd),
    });
    curstart.setDate(curstart.getDate() + stepDays);
    curEnd.setDate(curEnd.getDate() + stepDays);
  }
  if (occur.length === 0) {
    throw new Error("Recurrence end date has no occurrences");
  }
  if (occur.length > 52) {
    throw new Error("Recurrence range too long");
  }
  return occur;
};

export const cancelBooking = (startTime: Date) => {
  const now = new Date();
  const oneHourBefore = new Date(
    startTime.getTime() - 60 * 60 * 1000,
  );
  if (now >= oneHourBefore) {
    throw new Error(
      "Booking can't be cancelled 1 hour before start meeting",
    );
  }
};