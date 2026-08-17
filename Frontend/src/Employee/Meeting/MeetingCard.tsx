import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiHome,
  FiUsers,
  FiEye,
  FiUser,
} from "react-icons/fi";

interface MeetingCardProps {
  meeting: {
    id: string;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    status: string;
    room: {
      name: string;
      location: string;
    };
    organizer: {
      firstname: string;
      lastname: string;
    };
    participants: {
      id: string;
    }[];
  };
}
export default function MeetingCard({
  meeting,
}: MeetingCardProps) {
  const start = new Date(Number(meeting.startTime));
  const end = new Date(Number(meeting.endTime));

  return (
    <div className="rounded-md border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#eef0ff] text-xl text-[#18216B]">
            <FiCalendar />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {meeting.title}
              </h3>
              <span className="rounded bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700">
                {meeting.status}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <FiHome className="text-gray-400" />
              <span>{meeting.room.name}</span>
              <span className="text-gray-400">-</span>
              <span>{meeting.room.location}</span>
            </div>
          </div>
        </div>
        <Link
          to={`/meetings/${meeting.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <FiEye />
          View Meeting
        </Link>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-4">
        <div className="rounded-md border bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-gray-500">
            <FiCalendar className="text-[#18216B]" />
            <span className="text-xs">Date</span>
          </div>
          <p className="mt-1.5 text-sm font-semibold text-gray-900">
            {start.toLocaleDateString(undefined, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="rounded-md border bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-gray-500">
            <FiClock className="text-[#18216B]" />
            <span className="text-xs">Time</span>
          </div>
          <p className="mt-1.5 text-sm font-semibold text-gray-900">
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
        <div className="rounded-md border bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-gray-500">
            <FiUser className="text-[#18216B]" />
            <span className="text-xs">Organizer</span>
          </div>
          <p className="mt-1.5 text-sm font-semibold text-gray-900">
            {meeting.organizer.firstname}{" "}
            {meeting.organizer.lastname}
          </p>
        </div>
        <div className="rounded-md border bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-gray-500">
            <FiUsers className="text-[#18216B]" />
            <span className="text-xs">Participants</span>
          </div>
          <p className="mt-1.5 text-sm font-semibold text-gray-900">
            {meeting.participants.length}
          </p>
        </div>
      </div>
      {meeting.description && (
        <div className="mt-4 border-t pt-4">
          <p className="text-xs font-medium text-gray-500">
            Description
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {meeting.description}
          </p>
        </div>
      )}
    </div>
  );
}
