import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiHome } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import {
  createBooking_Mutation,
  joinWaitlist_Mutation,
} from "../graphql/Mutation";
import type {
  CreateBooking_Interface,
  JoinWaitlist_Interface,
  Users_Interface,
} from "../graphql/Client";
import { myBookings_Query, myWaitlist_Query, users_Query } from "../graphql/Query";
import Loader from "../Component/Loader";

export default function CreateBooking() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [selUsers, setSelUsers] = useState<number[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurFreq, setRecurFreq] = useState<"DAILY" | "WEEKLY">(
    "WEEKLY",
  );
  const [recurEndDate, setRecurEndDate] = useState("");

  const [createBooking, { loading }] = useMutation<CreateBooking_Interface>(
    createBooking_Mutation,{
      refetchQueries:[{query:myBookings_Query}],
      awaitRefetchQueries:true
    },
  );
  const { data: usersData, loading: usersLoading } =
    useQuery<Users_Interface>(users_Query);
  const [joinWaitlist, { loading: wlistLoading }] =
    useMutation<JoinWaitlist_Interface>(joinWaitlist_Mutation,{
      refetchQueries:[{
        query:myWaitlist_Query
      }],
      awaitRefetchQueries:true
    })
  if (loading) {
    return <Loader/>
  }
  const users = usersData?.Users ?? [];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) {
      toast.error("Room not found");
      return;
    }
    if (!title.trim()) {
      toast.error("Meeting title is required");
      return;
    }
    if (!startTime || !endTime) {
      toast.error("Please select start and end time");
      return;
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      toast.error("Start time must be before end time");
      return;
    }
    try {
      const result = await createBooking({
        variables: {
          roomId: Number(roomId),
          title: title.trim(),
          description: description.trim() || undefined,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          participantUserIds: selUsers,
          recurringFreq: isRecurring ? recurFreq : undefined,
          recurrenceEndDate: isRecurring
            ? new Date(`${recurEndDate}T23:59:59`).toISOString()
            : undefined,
        },
      });
      if (result.data?.CreateBooking?.success) {
        toast.success("Booking created successfully");
        navigate("/bookings");
      } else {
        toast.error(
          result.data?.CreateBooking?.msg || "failed to create booking",
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        toast.error("Failed to create booking");
      }
    }
  };
  const handleJoinWlist = async () => {
    if (!roomId) {
      toast.error("Room not found");
      return;
    }
    if (!startTime || !endTime) {
      toast.error("Please select start and end time first");
      return;
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      toast.error("Start time must be before end time");
      return;
    }
    const confirmed = window.confirm(
      "This room is already booked for this time. Do you want to join the waitlist?",
    );
    if (!confirmed) return;
    try {
      const result = await joinWaitlist({
        variables: {
          roomId: Number(roomId),
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        },
      });
      if (result.data?.JoinWaitlist.success) {
        toast.success(result.data.JoinWaitlist.msg);
        navigate("/waitlist");
      } else {
        toast.error(result.data?.JoinWaitlist.msg || "Failed to join waitlist");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to join waitlist");
      }
    }
  };
  return (
    <div className="m-auto max-w-3xl">
      <div className="mb-6">
        <Link
          to={`/rooms/${roomId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#18216B]"
        >
          <FiArrowLeft />
          Back to Room
        </Link>
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-gray-900">Create Booking</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create a meeting for this room.
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="rounded-md border bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3 border-b pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#eef0ff] text-xl text-[#18216B]">
            <FiHome />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Room - {roomId}</h3>
            <p className="text-sm text-gray-500">Meeting room booking</p>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Project discussion"
              className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:border-[#18216B]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional meeting description"
              rows={4}
              className="w-full resize-none rounded-md border px-3 py-2.5 text-sm outline-none focus:border-[#18216B]"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:border-[#18216B]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:border-[#18216B]"
              />
            </div>
          </div>
          <div className="rounded-md border p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4"
              />

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Recurring booking
                </p>
                <p className="text-xs text-gray-500">
                  Repeat this booking automatically.
                </p>
              </div>
            </label>

            {isRecurring && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Repeat
                  </label>

                  <select
                    value={recurFreq}
                    onChange={(e) =>
                      setRecurFreq(e.target.value as "DAILY" | "WEEKLY")
                    }
                    className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:border-[#18216B]"
                  >
                    <option value="DAILY">Every day</option>
                    <option value="WEEKLY">Every week</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Repeat until
                  </label>

                  <input
                    type="date"
                    value={recurEndDate}
                    onChange={(e) => setRecurEndDate(e.target.value)}
                    className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:border-[#18216B]"
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Participants
            </label>
            <p className="mb-3 text-xs text-gray-500">
              Select users you want to invite to this meeting.
            </p>
            {usersLoading ? (
              <p className="text-sm text-gray-500">Loading users...</p>
            ) : (
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-3">
                {users.map((user) => {
                  const userId = Number(user.id);
                  const selected = selUsers.includes(userId);
                  return (
                    <label
                      key={user.id}
                      className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {
                          setSelUsers((prev) =>
                            selected
                              ? prev.filter((id) => id !== userId)
                              : [...prev, userId],
                          );
                        }}
                        className="h-4 w-4"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstname} {user.lastname}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">
              {selUsers.length} participant selected
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-md bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-[#18216B]" />
            <p className="text-sm font-medium text-gray-900">
              Booking information
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Room will be booked after checking availability
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Link
            to={`/rooms/${roomId}`}
            className="rounded-md border px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleJoinWlist}
            disabled={wlistLoading}
            className="rounded-md border flex items-center gap-2 border-[#18216B] px-5 py-2.5 text-sm font-medium bg-[#e19737] hover:bg-[#eb911c] text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaCirclePlus />
            {wlistLoading ? "Joining..." : "Join Waitlist"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-[#18216B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#121952] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiCheckCircle />
            {loading ? "Creating..." : "Create Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}
