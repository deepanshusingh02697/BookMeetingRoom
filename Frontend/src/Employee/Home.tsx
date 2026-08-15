import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiHome,
  FiPlus,
} from "react-icons/fi";
import { currentUser_Query } from "../graphql/Query";
import type { CurrUser_Interface } from "../graphql/Client";

export default function Home() {
  const { data, loading } =
    useQuery<CurrUser_Interface>(currentUser_Query);
  const user = data?.CurrUser;
  if (loading) {
    return (
      <div className="p-5 text-sm text-gray-500">
        Loading dashboard...
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome Back, {user?.firstname}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here is what's happening with your meetings today
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#eef0ff] text-[#18216B]">
            <FiCalendar />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            0
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Today's Meetings
          </p>
        </div>
        <div className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#eef0ff] text-[#18216B]">
            <FiClock />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            0
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Upcoming Meetings
          </p>
        </div>
        <div className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#eef0ff] text-[#18216B]">
            <FiHome />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            0
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Rooms Available
          </p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">
              Today's Meetings
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Your meetings scheduled for today
            </p>
          </div>
          <div className="py-8 text-center">
            <FiCalendar className="mx-auto text-2xl text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              No meetings for today.
            </p>
          </div>
        </div>
        <div className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">
              Quick Action
            </h3>
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
          <h3 className="font-semibold text-gray-900">
            Upcoming Meetings
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Your upcoming room bookings
          </p>
        </div>

        <div className="py-8 text-center">
          <FiClock className="mx-auto text-2xl text-gray-400" />

          <p className="mt-2 text-sm text-gray-500">
            No upcoming meetings.
          </p>

          <Link
            to="/rooms"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white"
          >
            <FiPlus />
            Book a Room
          </Link>
        </div>
      </div>
    </div>
  );
}