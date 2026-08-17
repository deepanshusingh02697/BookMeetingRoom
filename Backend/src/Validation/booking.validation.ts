import { GraphQLError } from "graphql/error";

export const checkTime = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
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
  const durationMs = end.getTime() - start.getTime();
  const stepDays = freq==="DAILY"?1:7;

  const occur:{start:Date,end:Date}[]=[];
  let currentStart=new Date(start);

  while(currentStart<=recurEndDate){
    const curEnd= new Date(currentStart.getTime()+durationMs);

    occur.push({start: new Date(currentStart), end: curEnd});

    currentStart = new Date(
      currentStart.getTime() + stepDays * 24 * 60 * 60 * 1000,
    );
  }
  if(occur.length===0){
    throw new Error("Recurrence end date have no occrences");
  }
  if(occur.length>52){
    throw new Error("Recurrence range to long");
  }
  return occur;
};
