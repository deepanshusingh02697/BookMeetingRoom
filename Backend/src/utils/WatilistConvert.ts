import { prisma } from "../lib/prisma";

export const convertWeightlist=async(roomId:number,start:Date,end:Date)=>{
  const waitlistLine = await prisma.waitlistEntry.findFirst({
    where:{
      roomId,
      startTime:{lt:end},
      endTime:{gt:start}
    },
    orderBy:{
      createdAt:"asc"
    }
  });
  if(!waitlistLine) return;
  await prisma.booking.create({
    data:{
      roomId,
      organizerId: waitlistLine.userId,
      title:"Auto assigned from waitlist",
      startTime:waitlistLine.startTime,
      endTime:waitlistLine.endTime
    }
  });
  await prisma.waitlistEntry.delete({
    where:{id:waitlistLine.id}
  });
};