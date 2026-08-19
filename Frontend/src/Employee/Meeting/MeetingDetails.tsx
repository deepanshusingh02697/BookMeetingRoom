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
  FiLogOut,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Loader from "../../Component/Loader";
import {
  bookingDetails_Query,
  currentUser_Query,
  MyMeetings_Query,
} from "../../graphql/Query";
import type {
  BookingDetails_Interface,
  CurrUser_Interface,
  CheckInToBooking_Interface,
  RemoveParticipant_Interface,
} from "../../graphql/Client";
import {
  checkInToBooking_Mutation,
  removeParticipant_Mutation,
} from "../../graphql/Mutation";

export default function MeetingDetails() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const bookingId = Number(meetingId);
  const { data, loading, error } = useQuery<BookingDetails_Interface>(
    bookingDetails_Query,
    {
      variables: {
        id: bookingId,
      },
    },
  );
  const { data: currentUserData } =
    useQuery<CurrUser_Interface>(currentUser_Query);
  const currentUser = currentUserData?.CurrUser;
  const [checkInToBooking, { loading: checkInLoading }] =
    useMutation<CheckInToBooking_Interface>(checkInToBooking_Mutation, {
      refetchQueries: [
        {
          query: bookingDetails_Query,
          variables: {
            id: bookingId,
          },
        },
      ],
    });
  const [removeParticipant, { loading: removeLoading }] =
    useMutation<RemoveParticipant_Interface>(removeParticipant_Mutation, {
      refetchQueries: [
        {
          query: MyMeetings_Query,
        },
      ],
      awaitRefetchQueries: true,
    });
  const meeting = data?.BookingDetails;
  const handleCheckIn = async () => {
    if (!meeting) return;
    const confirmed = window.confirm(
      "Do you want to check in to this meeting?",
    );
    if (!confirmed) return;
    try {
      const result = await checkInToBooking({
        variables: {
          bookingId: Number(meeting.id),
        },
      });
      if (result.data?.CheckInToBooking.success) {
        toast.success(result.data.CheckInToBooking.msg);
      } else {
        toast.error(result.data?.CheckInToBooking.msg || "Failed to check in");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to check in");
      }
    }
  };
  const handleLeaveMeeting = async () => {
    if (!meeting || !currentUser) {
      return;
    }
    const confirmed = window.confirm("Do you want to leave this meeting?");
    if (!confirmed) return;
    try {
      const result = await removeParticipant({
        variables: {
          bookingId: Number(meeting.id),
          userId: Number(currentUser.id),
        },
      });
      if (result.data?.RemoveParticipant.success) {
        toast.success(
          result.data.RemoveParticipant.msg || "You have left the meeting",
        );
        navigate("/meetings");
      } else {
        toast.error(
          result.data?.RemoveParticipant.msg || "Failed to leave meeting",
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to leave meeting");
      }
    }
  };
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-10 text-center">
        <FiCalendar className="mx-auto text-3xl text-red-400" />
        <h2 className="mt-3 text-lg font-semibold text-red-700">
          Failed to load meeting
        </h2>
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
        <Link
          to="/meetings"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2.5 text-sm font-medium text-white"
        >
          <FiArrowLeft />
          Back to My Meetings
        </Link>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="rounded-md border bg-white p-10 text-center shadow-sm">
        <FiCalendar className="mx-auto text-3xl text-gray-400" />
        <h2 className="mt-3 text-lg font-semibold text-gray-900">
          Meeting not found
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          This meeting does not exist
        </p>
        <Link
          to="/meetings"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2.5 text-sm font-medium text-white"
        >
          <FiArrowLeft />
          Back to My Meetings
        </Link>
      </div>
    );
  }
  const start = new Date(Number(meeting.startTime));
  const end = new Date(Number(meeting.endTime));
  const isOrganizer = Number(currentUser?.id) === Number(meeting.organizer.id);
  const isParticipant =
    currentUser?.id !== undefined &&
    meeting.participants.some(
      (participant) => Number(participant.user.id) === Number(currentUser.id),
    );
  const isConfirmed = meeting.status === "CONFIRMED";
  const canCheckIn = isConfirmed && (isOrganizer || isParticipant);
  return (
    <div>
      <div className="mb-6">
        <Link
          to="/meetings"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#18216B]"
        >
          <FiArrowLeft />
          Back to My Meetings
        </Link>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {meeting.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View meeting details and participants
            </p>
          </div>
          <span
            className={`w-fit rounded px-3 py-1.5 text-xs font-medium ${
              meeting.status === "CONFIRMED"
                ? "bg-green-100 text-green-700"
                : meeting.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : meeting.status === "COMPLETED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {meeting.status}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
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
                  Details about this meeting
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
                    weekday: "long",
                    year: "numeric",
                    month: "long",
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
                  {start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  -{" "}
                  {end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiUser className="text-[#18216B]" />
                  <span className="text-xs">Organizer</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {meeting.organizer.firstname} {meeting.organizer.lastname}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {meeting.organizer.email}
                </p>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiRepeat className="text-[#18216B]" />
                  <span className="text-xs">Meeting Type</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {meeting.recurrenceId
                    ? "Recurring Meeting"
                    : "One-time Meeting"}
                </p>
              </div>
            </div>
            {meeting.description && (
              <div className="mt-5 border-t pt-5">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiFileText className="text-[#18216B]" />
                  <span className="text-xs font-medium">Description</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {meeting.description}
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
                  Room where the meeting will take place
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-md border p-4">
                <p className="text-xs text-gray-500">Room</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {meeting.room.name}
                </p>
              </div>
              <div className="rounded-md border p-4">
                <p className="text-xs text-gray-500">Location</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <FiMapPin className="text-[#18216B]" />
                  <p className="text-sm font-semibold text-gray-900">
                    {meeting.room.location}
                  </p>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <FiUsers className="text-[#18216B]" />
                  <p className="text-xs text-gray-500">Capacity</p>
                </div>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {meeting.room.capacity} people
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-md border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Participants</h3>
                <p className="mt-1 text-xs text-gray-500">
                  People attending this meeting
                </p>
              </div>
              <span className="rounded bg-[#eef0ff] px-2.5 py-1 text-xs font-medium text-[#18216B]">
                {meeting.participants.length}
              </span>
            </div>
            {meeting.participants.length === 0 ? (
              <div className="py-8 text-center">
                <FiUsers className="mx-auto text-3xl text-gray-400" />

                <p className="mt-2 text-sm text-gray-500">
                  No participants added.
                </p>
              </div>
            ) : (
              <div className="mt-4 divide-y">
                {meeting.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {participant.user.firstname} {participant.user.lastname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {participant.user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="h-fit rounded-md border bg-white p-5 shadow-sm lg:sticky lg:top-5">
          <h3 className="font-semibold text-gray-900">Meeting Actions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your participation in this meeting
          </p>
          <div className="mt-5 rounded-md bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-[#18216B]" />
              <p className="text-sm font-medium text-gray-900">
                Meeting status
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              This meeting is currently{" "}
              <span className="font-medium">
                {meeting.status.toLowerCase()}
              </span>
            </p>
          </div>
          <div className="mt-4 rounded-md border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Participants</span>
              <span className="text-sm font-semibold text-gray-900">
                {meeting.participants.length}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">Room capacity</span>
              <span className="text-sm font-semibold text-gray-900">
                {meeting.room.capacity}
              </span>
            </div>
          </div>
          {canCheckIn && !meeting.checkIn && (
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={checkInLoading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#18216B] px-4 py-3 text-sm font-medium text-white hover:bg-[#121952] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiCalendar />
              Check In
            </button>
          )}
          {canCheckIn && meeting.checkIn && (
            <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <FiCalendar />
              Checked In
            </div>
          )}
          {isConfirmed && isParticipant && !isOrganizer && (
            <button
              type="button"
              onClick={handleLeaveMeeting}
              disabled={removeLoading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-600 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiLogOut />
              Leave Meeting
            </button>
          )}
          <Link
            to="/meetings"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border bg-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiArrowLeft />
            Back to My Meetings
          </Link>
        </div>
      </div>
    </div>
  );
}
