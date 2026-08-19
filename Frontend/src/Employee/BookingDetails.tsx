import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiHome,
  FiMapPin,
  FiUsers,
  FiUser,
  FiFileText,
  FiRepeat,
  FiXCircle,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import {
  bookingDetails_Query,
  currentUser_Query,
  users_Query,
} from "../graphql/Query";
import type {
  AddParticipant_Interface,
  BookingDetails_Interface,
  CancelBooking_Interface,
  CurrUser_Interface,
  RemoveParticipant_Interface,
  Users_Interface,
} from "../graphql/Client";
import {
  addParticipant_Mutation,
  cancelBooking_Mutation,
  removeParticipant_Mutation,
} from "../graphql/Mutation";
import { toast } from "react-toastify";
import { useState } from "react";
import Loader from "../Component/Loader";

export default function BookingDetails() {
  const [selUserId, setSelUserId] = useState("");
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery<BookingDetails_Interface>(
    bookingDetails_Query,
    {
      variables: {
        id: Number(bookingId),
      },
    },
  );
  const [cancelBooking, { loading: cancelLoading }] =
    useMutation<CancelBooking_Interface>(cancelBooking_Mutation);
  const [addPart, { loading: addLoading }] =
    useMutation<AddParticipant_Interface>(addParticipant_Mutation, {
      refetchQueries: [
        {
          query: bookingDetails_Query,
          variables: { id: Number(bookingId) },
        },
      ],
    });
  const [removePart] = useMutation<RemoveParticipant_Interface>(
    removeParticipant_Mutation,
    {
      refetchQueries: [
        {
          query: bookingDetails_Query,
          variables: { id: Number(bookingId) },
        },
      ],
    },
  );
  const { data: curUserData } = useQuery<CurrUser_Interface>(currentUser_Query);
  const currentUser = curUserData?.CurrUser;
  const { data: usersData } = useQuery<Users_Interface>(users_Query);

  const booking = data?.BookingDetails;
  const hcancelBook = async () => {
    if (!booking) return;
    const confirmed = window.confirm("Do you want to cancel this booking?");
    if (!confirmed) return;
    try {
      const result = await cancelBooking({
        variables: {
          id: Number(booking.id),
        },
      });
      if (result.data?.CancelBooking.success) {
        toast.success(result.data.CancelBooking.msg);
        navigate("/bookings");
      } else {
        toast.error(
          result.data?.CancelBooking.msg || "Failed to cancel booking",
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        toast.error("failed to cancel");
      }
    }
  };
  const partiUserIds = new Set(
    booking?.participants.map((p) => p.user.id) ?? [],
  );
  const avialUsers = usersData?.Users?.filter(
    (u) => u.id !== booking?.organizer.id && !partiUserIds.has(u.id),
  );
  const handleAddPart = async () => {
    if (!selUserId || !booking) return;
    try {
      const result = await addPart({
        variables: {
          bookingId: Number(booking.id),
          userId: Number(selUserId),
        },
      });
      if (result.data?.AddParticipant.success) {
        toast.success(result.data.AddParticipant.msg);
        setSelUserId("");
      } else {
        toast.error(
          result.data?.AddParticipant.msg || "Failed to add participant",
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add participant");
      }
    }
  };
  const handleRemovePart = async (userId: number) => {
    if (!booking) return;
    const confirmed = window.confirm("Do you want to remove this participant?");
    if (!confirmed) return;
    try {
      const result = await removePart({
        variables: {
          bookingId: Number(booking.id),
          userId,
        },
      });
      if (result.data?.RemoveParticipant.success) {
        toast.success(result.data.RemoveParticipant.msg);
      } else {
        toast.error(
          result.data?.RemoveParticipant.msg || "Failed to remove participant",
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to remove participant");
      }
    }
  };
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-10 text-center shadow-sm">
        <FiCalendar className="mx-auto text-3xl text-red-400" />
        <h2 className="mt-3 text-lg font-semibold text-red-700">
          Failed to load booking
        </h2>
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
        <Link
          to="/bookings"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white"
        >
          <FiArrowLeft />
          Back to My Bookings
        </Link>
      </div>
    );
  }
  if (!booking) {
    return (
      <div className="rounded-md border bg-white p-10 text-center shadow-sm">
        <FiCalendar className="mx-auto text-3xl text-gray-400" />
        <h2 className="mt-3 text-lg font-semibold text-gray-900">
          Booking not found
        </h2>
        <p className="mt-1 text-sm text-gray-500">Booking does not exist</p>
        <Link
          to="/bookings"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white"
        >
          <FiArrowLeft />
          Back to My Bookings
        </Link>
      </div>
    );
  }
  const start = new Date(Number(booking.startTime));
  const end = new Date(Number(booking.endTime));
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
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {booking.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View booking information and participants
            </p>
          </div>
          <span
            className={`w-fit rounded px-3 py-1.5 text-xs font-medium ${
              booking.status === "CONFIRMED"
                ? "bg-green-100 text-green-700"
                : booking.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : booking.status === "COMPLETED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {booking.status}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-md border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eef0ff] text-xl text-[#18216B]">
                <FiCalendar />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Meeting Information
                </h3>
                <p className="text-xs text-gray-500">
                  Details about this booking
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiCalendar className="text-[#18216B]" />
                  <span className="text-xs">Date</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {start.toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiClock className="text-[#18216B]" />
                  <span className="text-xs">Time</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">
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
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiUser className="text-[#18216B]" />
                  <span className="text-xs">Organizer</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {booking.organizer.firstname} {booking.organizer.lastname}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {booking.organizer.email}
                </p>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiRepeat className="text-[#18216B]" />
                  <span className="text-xs">Booking Type</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {booking.recurrenceId
                    ? "Recurring Booking"
                    : "One-time Booking"}
                </p>
              </div>
            </div>
            {booking.description && (
              <div className="mt-5 border-t pt-5">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiFileText className="text-[#18216B]" />

                  <span className="text-xs font-medium">Description</span>
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {booking.description}
                </p>
              </div>
            )}
          </div>
          <div className="rounded-md border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eef0ff] text-xl text-[#18216B]">
                <FiHome />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Room Information
                </h3>
                <p className="text-xs text-gray-500">
                  Meeting room for this booking
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-md border p-4">
                <p className="text-xs text-gray-500">Room</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {booking.room.name}
                </p>
              </div>
              <div className="rounded-md border p-4">
                <p className="text-xs text-gray-500">Location</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <FiMapPin className="text-[#18216B]" />
                  <p className="text-sm font-semibold text-gray-900">
                    {booking.room.location}
                  </p>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <FiUsers className="text-[#18216B]" />
                  <p className="text-xs text-gray-500">Capacity</p>
                </div>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {booking.room.capacity} people
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-md border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Participants</h3>
                <p className="mt-1 text-xs text-gray-500">
                  People invited to this meeting
                </p>
              </div>

              <span className="rounded bg-[#eef0ff] px-2.5 py-1 text-xs font-medium text-[#18216B]">
                {booking.participants.length}
              </span>
            </div>
            {booking.status === "CONFIRMED" &&
              currentUser?.id === booking.organizer.id && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <select
                  value={selUserId}
                  onChange={(e) => setSelUserId(e.target.value)}
                  disabled={addLoading}
                  className="flex-1 rounded-md border px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#18216B]">
                  <option value="">Select participant</option>
                  {avialUsers?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstname} {user.lastname} - {user.email}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddPart}
                  disabled={!selUserId || addLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white hover:bg-[#121952] disabled:cursor-not-allowed disabled:opacity-50">
                  <FiPlus />
                  {addLoading ? "Adding..." : "Add Participant"}
                </button>
              </div>
            )}
            {booking.participants.length === 0 ? (
              <div className="py-8 text-center">
                <FiUsers className="mx-auto text-3xl text-gray-400" />

                <p className="mt-2 text-sm text-gray-500">
                  No participants added.
                </p>
              </div>
            ) : (
              <div className="mt-4 divide-y">
                {booking.participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef0ff] text-sm font-semibold text-[#18216B]">
                        {p.user.firstname.charAt(0)}
                        {p.user.lastname.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {p.user.firstname} {p.user.lastname}
                        </p>

                        <p className="text-xs text-gray-500">{p.user.email}</p>
                      </div>
                    </div>
                    {booking.status === "CONFIRMED" &&
                      currentUser?.id === booking.organizer.id && (
                      <button
                        type="button"
                        onClick={() => handleRemovePart(Number(p.user.id))}
                        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
                        <FiTrash2 />
                          Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="h-fit rounded-md border bg-white p-5 shadow-sm lg:sticky lg:top-5">
          <h3 className="font-semibold text-gray-900">Booking Actions</h3>
          <p className="mt-1 text-sm text-gray-500">Manage the booking</p>
          <div className="mt-5 rounded-md bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-[#18216B]" />
              <p className="text-sm font-medium text-gray-900">
                Booking status
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              This booking is currently{" "}
              <span className="font-medium">
                {booking.status.toLowerCase()}
              </span>
            </p>
          </div>
          <div className="mt-4 rounded-md border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Participants</span>

              <span className="text-sm font-semibold text-gray-900">
                {booking.participants.length}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">Room capacity</span>
              <span className="text-sm font-semibold text-gray-900">
                {booking.room.capacity}
              </span>
            </div>
          </div>
          {booking.status === "CONFIRMED" && (
            <button
              type="button"
              onClick={hcancelBook}
              disabled={cancelLoading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border bg-red-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiXCircle />
              {cancelLoading ? "Cancelling..." : "Cancel Booking"}
            </button>
          )}
          <Link
            to="/bookings"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium bg-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <FiArrowLeft />
            Back to My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
