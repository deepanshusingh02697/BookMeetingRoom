import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BookingDetail from "./BookingDetail";
import { adminCalendar_Query } from "../graphql/Query";
import type {
  AdminCalender_Interface,
  BookingDetails_Interface,
} from "../graphql/Client";
import { useQuery } from "@apollo/client/react";
import Loader from "../Component/Loader";

type Booking = NonNullable<BookingDetails_Interface["BookingDetails"]>;
export default function AdminCalendar() {
  const [calendarRange, setCalendarRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { data, loading, error } = useQuery<AdminCalender_Interface>(
    adminCalendar_Query,
    {
      variables: calendarRange ?? {
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      },
      skip: !calendarRange,
    },
  );
  const events = useMemo(() => {
    if (!data?.AdminCalender) {
      return [];
    }
    return data.AdminCalender.map((booking) => ({
      id: String(booking.id),
      title: booking.title,
      start: new Date(Number(booking.startTime)),
      end: new Date(Number(booking.endTime)),
      extendedProps: {
        booking,
      },
    }));
  }, [data]);
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">Failed to load calendar</h2>
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      </div>
    );
  }
  return (
    <>
      <div className="mb-5 pl-2">  
        <h1 className="text-2xl font-bold text-gray-900">Admin Calendar</h1>
        <p className="mt-1 text-sm text-gray-500">
          View office-wide meeting room bookings.
        </p>
      </div>
      <div className="rounded-2xl border shadow-sm border-gray-200 bg-white p-4 h-auto">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          datesSet={(dateInfo) => {
            setCalendarRange({
              startDate: dateInfo.start.toISOString(),
              endDate: dateInfo.end.toISOString(),
            });
          }}
          eventClick={(info) => {
            setSelectedBooking(info.event.extendedProps.booking);
          }}
        />
      </div>
      {selectedBooking && (
        <BookingDetail
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
}
