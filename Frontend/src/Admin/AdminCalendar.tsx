import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import BookingDetail from "./BookingDetail";
import { adminCalendar_Query } from "../graphql/Query";
import type {
  AdminCalender_Interface,
  BookingDetails_Interface,
} from "../graphql/Client";
import { useQuery } from "@apollo/client/react";

type Booking = NonNullable<BookingDetails_Interface["BookingDetails"]>;
export default function AdminCalendar() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  const { data, loading, error } = useQuery<AdminCalender_Interface>(
    adminCalendar_Query,
    {
      variables: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
    },
  );
  const events = useMemo(() => {
    if (!data?.AdminCalender) {
      return [];
    }
    return data.AdminCalender.map((booking) => ({
      id: booking.id,
      title: booking.title,
      start: new Date(Number(booking.startTime)),
      end: new Date(Number(booking.endTime)),
      extendedProps: {
        booking,
      },
    }));
  }, [data]);
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-gray-500">Loading calendar...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Failed to load calendar
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {error.message}
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Calendar
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View office-wide meeting room bookings.
          </p>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          height="auto"
          events={events}
          eventClick={(info) => {
            const booking =
              info.event.extendedProps.booking as Booking;
            setSelectedBooking(booking);
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