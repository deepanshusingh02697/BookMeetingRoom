import { useMutation, useQuery } from "@apollo/client/react";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiHome,
  FiMapPin,
  FiTrash2,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type {
  LeaveWaitlist_Interface,
  MyWaitlist_Interface,
} from "../graphql/Client";
import { myWaitlist_Query } from "../graphql/Query";
import { leaveWaitlist_Mutation } from "../graphql/Mutation";
import Loader from "../Component/Loader";

export default function MyWaitlist() {
  const { data, loading, error } =
    useQuery<MyWaitlist_Interface>(myWaitlist_Query);
  const [leaveWaitlist, { loading: leaveLoading }] =
    useMutation<LeaveWaitlist_Interface>(leaveWaitlist_Mutation, {
      refetchQueries: [myWaitlist_Query],
    });
  const waitlist = data?.MyWaitlist ?? [];
  const handleLeaveWaitlist = async (id: number) => {
    const confirmed = window.confirm("Do you want to leave this waitlist?");
    if (!confirmed) return;
    try {
      const result = await leaveWaitlist({
        variables: {
          id,
        },
      });
      if (result.data?.LeaveWaitlist) {
        toast.success(result.data.LeaveWaitlist);
      } else {
        toast.error("Failed to leave waitlist");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to leave waitlist");
      }
    }
  };
  const formatDate = (value: string) => {
    return new Date(Number(value)).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const formatTime = (value: string) => {
    return new Date(Number(value)).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  if (loading) {
    return (
      <Loader/>
    );
  }
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-red-700">
          Failed to load waitlist
        </h2>
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#18216B]"
        >
          <FiArrowLeft />
          Back to My Bookings
        </Link>
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-gray-900">My Waitlist</h2>
          <p className="mt-1 text-sm text-gray-500">
            Rooms you are waiting for
          </p>
        </div>
      </div>
      {waitlist.length === 0 ? (
        <div className="rounded-md border bg-white p-10 text-center shadow-sm">
          <FiCalendar className="mx-auto text-4xl text-gray-400" />
          <h3 className="mt-3 text-lg font-semibold text-gray-900">
            No waitlist entries
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You are not currently waiting for any room.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {waitlist.map((entry) => (
            <div
              key={entry.id}
              className="rounded-md border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FiHome className="text-[#18216B]" />
                    <h3 className="font-semibold text-gray-900">
                      {entry.room.name}
                    </h3>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <FiMapPin />
                    {entry.room.location}
                  </div>
                </div>
                <span className="w-fit rounded bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-700">
                  Waiting
                </span>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-md border p-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FiCalendar className="text-[#18216B]" />
                    <span className="text-xs">Date</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatDate(entry.startTime)}
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FiClock className="text-[#18216B]" />
                    <span className="text-xs">Time</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end border-t pt-4">
                <button
                  type="button"
                  onClick={() => handleLeaveWaitlist(Number(entry.id))}
                  disabled={leaveLoading}
                  className="flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2 />  
                  {leaveLoading ? "Leaving..." : "Leave Waitlist"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
