import { useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { FiHome, FiSearch, FiUsers, FiMapPin, FiLayers } from "react-icons/fi";
import type {
  GetRooms_Interface,
  SearchRooms_Interface,
} from "../graphql/Client";
import { GetRooms_Query, searchRooms_Query } from "../graphql/Query";
import { toast } from "react-toastify";

export default function Rooms() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [floor, setFloor] = useState("");
  const [searched, setSearched] = useState(false);
  const {
    data: allRoomsData,
    loading: allRoomsLoading,
    error: allRoomsError,
  } = useQuery<GetRooms_Interface>(GetRooms_Query);
  const [
    searchRooms,
    { data: searchData, loading: searchLoading, error: searchError },
  ] = useLazyQuery<SearchRooms_Interface>(searchRooms_Query);
  const handleSearch = async () => {
    if (!startTime || !endTime) {
      toast("Please select start and end date-time");
      return;
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      toast("Start date-time must be less than end date-time");
      return;
    }
    try {
      await searchRooms({
        variables: {
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          capacity: capacity ? Number(capacity) : undefined,
          floor: floor ? Number(floor) : undefined,
          status: "AVAILABLE",
        },
      });
      setSearched(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowAllRooms = () => {
    setSearched(false);
    setStartTime("");
    setEndTime("");
    setCapacity("");
    setFloor("");
  };
  const rooms = searched
    ? (searchData?.SearchRooms ?? [])
    : (allRoomsData?.GetRooms ?? []);
  const loading = searched ? searchLoading : allRoomsLoading;
  const error = searched ? searchError : allRoomsError;

  return (
    <div className="m-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Meeting Rooms</h2>
        <p className="mt-1 text-sm text-gray-500">
          Browse all rooms or search for a room available at a specific time.
        </p>
      </div>
      <div className="rounded-md border bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
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
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              End Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:border-[#18216B]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              Capacity
            </label>
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Any capacity"
              className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:border-[#18216B]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              Floor
            </label>
            <input
              type="number"
              min="1"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="Any floor"
              className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:border-[#18216B]"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          {searched && (
            <button
              type="button"
              onClick={handleShowAllRooms}
              disabled={searchLoading}
              className="rounded-md border px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Show All Rooms
            </button>
          )}
          <button
            type="button"
            onClick={handleSearch}
            disabled={searchLoading}
            className="flex items-center gap-2 rounded-md bg-[#18216B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#121952] disabled:opacity-50"
          >
            <FiSearch />
            find available rooms
          </button>
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              {searched ? "Available rooms" : "All rooms"}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {searched
                ? "Rooms available for your selected time."
                : "Browse all meeting rooms and choose a room to book."}
            </p>
          </div>
          {!loading && (
            <span className="text-sm text-gray-500">{rooms.length} rooms</span>
          )}
        </div>
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error.message}
          </div>
        )}
        {loading ? (
          <div className="rounded-md border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#18216B]" />
            <p className="mt-3 text-sm text-gray-500">
              {searched ? "Searching available rooms..." : "Loading rooms..."}
            </p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-md border bg-white p-10 text-center shadow-sm">
            <FiHome className="mx-auto text-3xl text-gray-400" />
            <p className="mt-3 text-sm font-medium text-gray-700">
              {searched ? "No rooms available" : "No rooms found"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {searched
                ? "Try another time, floor, or capacity."
                : "There are currently no rooms available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex flex-col rounded-md border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#eef0ff] text-[#18216B]">
                    <FiHome />
                  </div>
                  <span
                    className={`rounded px-2 py-1 text-[11px] font-medium ${
                      room.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
                <h4 className="mt-4 text-lg font-semibold text-gray-900">
                  {room.name}
                </h4>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-400" />
                    {room.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiLayers className="text-gray-400" />
                    Floor {room.floor}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-gray-400" />
                    Capacity {room.capacity}
                  </div>
                </div>
                {room.equipments?.length > 0 ? (
                  <div className="my-4">
                    <p className="text-xs font-medium text-gray-500">
                      Equipment
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {room.equipments.map((equipment) => (
                        <span
                          key={equipment.id}
                          className="rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600"
                        >
                          {equipment.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="my-4 h-[42px]" />
                )}
                <Link
                  to={`/rooms/${room.id}`}
                  className="mt-auto block rounded-md bg-[#18216B] px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-[#121952]"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
