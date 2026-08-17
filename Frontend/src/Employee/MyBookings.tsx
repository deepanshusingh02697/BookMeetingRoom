import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiHome, FiUsers, FiEye } from "react-icons/fi";
import type { MyBookings_Interface } from "../graphql/Client";
import { myBookings_Query } from "../graphql/Query";
import { useState } from "react";
import Loader from "../Component/Loader";

export default function MyBookings() {
  const { data, loading, error } =
    useQuery<MyBookings_Interface>(myBookings_Query);
  const bookings = data?.MyBookings ?? [];
  const [status, setStatus] = useState("ALL");
  const filterBks =
    status === "ALL" ? bookings : bookings.filter((bk) => bk.status === status);
  if (loading) {
    return <Loader/>
  }
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-10 text-center shadow-sm">
        <FiCalendar className="mx-auto text-3xl text-red-400" />
        <h2 className="mt-3 text-lg font-semibold text-red-700">
          Failed to load bookings
        </h2>
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your meeting room bookings.
        </p>
      </div>
      {bookings.length === 0 ? (
        <div className="rounded-md border bg-white p-10 text-center shadow-sm">
          <FiCalendar className="mx-auto text-4xl text-gray-400" />
          <h3 className="mt-3 text-lg font-semibold text-gray-900">
            No bookings found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't created any meeting bookings yet.
          </p>
          <Link
            to="/rooms"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#121952]"
          >
            <FiCalendar />
            Book a Room
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Your Bookings</h3>
              <p className="mt-1 text-xs text-gray-500">
                {bookings.length} booking
                {bookings.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-3">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-md border px-3 py-2 text-sm font-semibold outline-none focus:border-[#18216B] bg-[#fef8df] border-amber-500"
              >
                <option value="ALL">All</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
                <option value="NO_SHOW">No_Show</option>
              </select>
              <Link
                to="/rooms"
                className="rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white hover:bg-[#121952]"
              >
                Book Another Room
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {filterBks.length === 0 ? (
              <>
                <div className="rounded-md border bg-white p-10 text-center shadow-sm">
                  <FiCalendar className="mx-auto text-4xl text-gray-400" />

                  <h3 className="mt-3 text-lg font-semibold text-gray-900">
                    No bookings found
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    There are no bookings with the selected status.
                  </p>

                  <Link
                    to="/rooms"
                    className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#121952]"
                  >
                    <FiCalendar />
                    Book a Room
                  </Link>
                </div>
              </>
            ) : (
              filterBks.map((booking) => {
                const start = new Date(Number(booking.startTime));
                const end = new Date(Number(booking.endTime));
                return (
                  <div
                    key={booking.id}
                    className="rounded-md border bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#eef0ff] text-xl text-[#18216B]">
                          <FiCalendar />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.title}
                            </h3>
                            <span
                              className={`rounded px-2.5 py-1 text-[11px] font-medium ${
                                booking.status === "CONFIRMED"
                                  ? "bg-green-100 text-green-700"
                                  : booking.status === "CANCELLED"
                                    ? "bg-red-100 text-red-700"
                                    : booking.status === "COMPLETED"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-300 text-gray-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                            {booking.isRecurring && (
                              <span className="rounded bg-purple-100 px-2.5 py-1 text-[11px] font-medium text-purple-700">
                                Recurring
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                            <FiHome className="text-gray-400" />
                            <span>{booking.room.name}</span>

                            <span className="text-gray-400">-</span>
                            <span>{booking.room.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/bookings/${booking.id}`}
                          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <FiEye />
                          View
                        </Link>
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-3">
                      <div className="rounded-md border bg-gray-50 p-3">
                        <div className="flex items-center gap-2 text-gray-500">
                          <FiCalendar className="text-[#18216B]" />
                          <span className="text-xs">Date</span>
                        </div>
                        <p className="mt-1.5 text-sm font-semibold text-gray-900">
                          {start.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="rounded-md border bg-gray-50 p-3">
                        <div className="flex items-center gap-2 text-gray-500">
                          <FiClock className="text-[#18216B]" />
                          <span className="text-xs">Time</span>
                        </div>
                        <p className="mt-1.5 text-sm font-semibold text-gray-900">
                          {start
                            .toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                            .toUpperCase()}{" "}
                          -{" "}
                          {end
                            .toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                            .toUpperCase()}
                        </p>
                      </div>
                      <div className="rounded-md border bg-gray-50 p-3">
                        <div className="flex items-center gap-2 text-gray-500">
                          <FiUsers className="text-[#18216B]" />
                          <span className="text-xs">Participants</span>
                        </div>
                        <p className="mt-1.5 text-sm font-semibold text-gray-900">
                          {booking.participants.length} participant
                          {booking.participants.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    {booking.description && (
                      <div className="mt-4 border-t pt-4">
                        <p className="text-xs font-medium text-gray-500">
                          Description
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {booking.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
