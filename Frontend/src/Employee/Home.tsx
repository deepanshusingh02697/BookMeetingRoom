import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiHome, FiPlus } from "react-icons/fi";
import type {
  CurrUser_Interface,
  GetRooms_Interface,
  MyBookings_Interface,
} from "../graphql/Client";
import {
  currentUser_Query,
  GetRooms_Query,
  myBookings_Query,
} from "../graphql/Query";
import Loader from "../Component/Loader";

function getDate(value: string) {
  return new Date(Number(value));
}

function formatTime(value: string) {
  return getDate(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTodayRange() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export default function Home() {
  const { data: userData, loading: userLoading } =
    useQuery<CurrUser_Interface>(currentUser_Query);
  const { data: bookingData, loading: bookingLoading } =
    useQuery<MyBookings_Interface>(myBookings_Query);
  const { data: roomData, loading: roomLoading } =
    useQuery<GetRooms_Interface>(GetRooms_Query);

  const user = userData?.CurrUser;
  const bookings = bookingData?.MyBookings ?? [];
  const rooms = roomData?.GetRooms ?? [];
  const { start, end } = getTodayRange();
  const now = new Date();
  const todayBks = bookings.filter((booking) => {
    const bookingStart = getDate(booking.startTime);
    return bookingStart >= start && bookingStart <= end;
  });
  const upcomingBks = bookings.filter((booking) => {
    const bookingStart = getDate(booking.startTime);
    return bookingStart > now && booking.status === "CONFIRMED";
  }).sort( (a, b) => getDate(a.startTime).getTime() - getDate(b.startTime).getTime())
  
  const availRms = rooms.filter((room) => room.status === "AVAILABLE");
  const loading = userLoading || bookingLoading || roomLoading;
  if (loading){
    return <Loader/>
  }
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome Back, {user?.firstname}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here is what's happening with your meetings today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#eef0ff] text-[#18216B]">
            <FiCalendar />
          </div>
          <p className="text-2xl font-bold text-gray-900">{todayBks.length}</p>
          <p className="mt-1 text-sm text-gray-600">Today's Meetings</p>
        </div>

        <div className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#eef0ff] text-[#18216B]">
            <FiClock />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {upcomingBks.length}
          </p>
          <p className="mt-1 text-sm text-gray-600">Upcoming Meetings</p>
        </div>

        <div className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#eef0ff] text-[#18216B]">
            <FiHome />
          </div>
          <p className="text-2xl font-bold text-gray-900">{availRms.length}</p>
          <p className="mt-1 text-sm text-gray-600">Rooms Available</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">Today's Meetings</h3>
            <p className="mt-1 text-xs text-gray-500">
              Your meetings scheduled for today
            </p>
          </div>

          {todayBks.length === 0 ? (
            <div className="py-8 text-center">
              <FiCalendar className="mx-auto text-2xl text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                No meetings for today.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayBks.slice(0, 5).map((booking) => {
                let statusClass = "bg-gray-100 text-gray-700";

                if (booking.status === "CONFIRMED") {
                  statusClass = "bg-green-100 text-green-700";
                } else if (booking.status === "COMPLETED") {
                  statusClass = "bg-blue-100 text-blue-700";
                } else if (booking.status === "NO_SHOW") {
                  statusClass = "bg-orange-100 text-orange-700";
                } else if (booking.status === "CANCELLED") {
                  statusClass = "bg-red-100 text-red-700";
                }

                return (
                  <div key={booking.id} className="rounded-md border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {booking.room.name} · {booking.room.location}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                          <FiClock />
                          {formatTime(booking.startTime)} -{" "}
                          {formatTime(booking.endTime)}
                        </p>
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-[11px] ${statusClass}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                );
              })}

              {todayBks.length > 5 && (
                <Link
                  to="/bookings"
                  className="block pt-2 text-center text-xs font-medium text-[#18216B] hover:underline"
                >
                  View all today's meetings
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">Quick Action</h3>
            <p className="mt-1 text-xs text-gray-500">
              Find a room and create a new booking.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/rooms"
              className="flex items-center justify-center gap-2 rounded-md bg-[#18216B] px-4 py-3 text-sm font-medium text-white hover:bg-[#121952]"
            >
              <FiHome />
              Find a Room
            </Link>

            <Link
              to="/bookings"
              className="flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiCalendar />
              View My Bookings
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-md border bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">Upcoming Meetings</h3>
          <p className="mt-1 text-xs text-gray-500">
            Your upcoming room bookings
          </p>
        </div>

        {upcomingBks.length === 0 ? (
          <div className="py-8 text-center">
            <FiClock className="mx-auto text-2xl text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No upcoming meetings.</p>
            <Link
              to="/rooms"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white"
            >
              <FiPlus />
              Book a Room
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBks.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {booking.room.name} · {booking.room.location}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <FiCalendar />
                    {getDate(booking.startTime).toLocaleDateString()} ·{" "}
                    {formatTime(booking.startTime)} -{" "}
                    {formatTime(booking.endTime)}
                  </p>
                </div>
                <span className="rounded bg-green-100 px-2 py-1 text-[11px] text-green-700">
                  CONFIRMED
                </span>
              </div>
            ))}

            {upcomingBks.length > 5 && (
              <Link
                to="/bookings"
                className="block pt-2 text-center text-xs font-medium text-[#18216B] hover:underline"
              >
                View all upcoming meetings
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
