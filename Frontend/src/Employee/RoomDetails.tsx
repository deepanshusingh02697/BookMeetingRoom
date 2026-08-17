import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiHome,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { useQuery } from "@apollo/client/react";
import { GetRoomDetails_Query } from "../graphql/Query";
import type { GetRoomDeatils_Interface } from "../graphql/Client";
import Loader from "../Component/Loader";

export default function RoomDetails() {
  const { roomId } = useParams();
  console.log(roomId);
  const { data, loading, error } = useQuery<GetRoomDeatils_Interface>(
    GetRoomDetails_Query,
    {
      variables: { roomId: Number(roomId) },
    },
  );
  const room = data?.GetRoomDetails;
  if (!room) {
    return (
      <div className="rounded-md border bg-white p-10 text-center shadow-sm">
        <FiHome className="mx-auto text-3xl text-gray-400" />
        <h2 className="mt-3 text-lg font-semibold text-gray-900">
          Room not found
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Room does not exists what you are looking
        </p>
        <Link
          to="/rooms"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white"
        >
          <FiArrowLeft />
          Back to Rooms
        </Link>
      </div>
    );
  }
  if (loading) {
    return (
      <Loader/>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-10 text-center shadow-sm">
        <FiHome className="mx-auto text-3xl text-red-400" />
        <h2 className="mt-3 text-lg font-semibold text-red-700">
          Failed to load room
        </h2>
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
        <Link
          to="/rooms"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white"
        >
          <FiArrowLeft />
          Back to Rooms
        </Link>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6">
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#18216B]"
        >
          <FiArrowLeft />
          Back to Rooms
        </Link>
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-gray-900">{room.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            View room information and availability
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-md border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between border-b pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#eef0ff] text-xl text-[#18216B]">
                <FiHome />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {room.name}
                </h3>
                <p className="text-sm text-gray-500">Meeting Room</p>
              </div>
            </div>
            <span
              className={`rounded px-3 py-1 text-xs font-medium ${
                room.status === "AVAILABLE"
                  ? "bg-green-100 text-green-700"
                  : room.status === "MAINTENANCE"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {room.status}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-3">
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <FiUsers className="text-[#18216B]" />
                <span className="text-xs">Room Capacity</span>
              </div>

              <p className="mt-2 text-lg font-semibold text-gray-900">
                {room.capacity} people
              </p>
              <p className="mt-1 text-xs text-red-400">
                {room.particiCount} participants
              </p>
              <p className="mt-1 text-xs font-medium text-green-500">
                {room.availableSpace} spaces available
              </p>
            </div>
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <FiHome className="text-[#18216B]" />
                <span className="text-xs">Floor</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                Floor {room.floor}
              </p>
            </div>
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <FiMapPin className="text-[#18216B]" />
                <span className="text-xs">Location</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {room.location}
              </p>
            </div>
          </div>

          <div className="border-t pt-5">
            <h4 className="font-semibold text-gray-900">Equipment</h4>
            <p className="mt-1 text-xs text-gray-500">
              Equipment available in this meeting room
            </p>
            {room.equipments.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
                No equipment assigned to this room
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {room.equipments.map((eq) => (
                  <span
                    key={eq.id}
                    className="flex items-center gap-2 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  >
                    <FiCheckCircle className="text-green-600" />
                    {eq.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="rounded-md border bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">Book This Room</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select date and time to check availablility and create meeting
          </p>
          <div className="mt-5 rounded-md bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-[#18216B]" />
              <p className="text-sm font-medium text-gray-900">
                Room availability
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Availability will be checked with your selected meeting time
            </p>
          </div>
          {room.status === "AVAILABLE" ? (
            <Link
              to={`/rooms/${room.id}/book`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#18216B] px-4 py-3 text-sm font-medium text-white hover:bg-[#121952]"
            >
              <FiCalendar />
              Create Booking
            </Link>
          ) : (
            <div className="mt-5 rounded-md bg-gray-100 p-3 text-center">
              <p className="text-sm font-medium text-gray-700">
                Room can't be booked
              </p>
              <p className="mt-1 text-xs text-gray-500">
                room is currently {room.status.toLowerCase()}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
