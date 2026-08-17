import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import Loader from "../../Component/Loader";
import MeetingCard from "./MeetingCard";
import type { MyMeetings_Interface } from "../../graphql/Client";
import { MyMeetings_Query } from "../../graphql/Query";

export default function MyMeetings() {
  const { data, loading, error } =
    useQuery<MyMeetings_Interface>(MyMeetings_Query);
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-10 text-center">
        <FiCalendar className="mx-auto text-3xl text-red-400" />
        <h2 className="mt-3 text-lg font-semibold text-red-700">
          Failed to load meetings
        </h2>
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      </div>
    );
  }
  const meetings = data?.MyMeetings ?? [];
  const now = new Date();
  const todayMeetings = meetings.filter((meeting) => {
    const date = new Date(Number(meeting.startTime));
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  });
  const upcomingMeetings = meetings.filter((meeting) => {
    const date = new Date(Number(meeting.startTime));
    return date > now && !todayMeetings.includes(meeting);
  });
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          My Meetings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          View your today's and upcoming meetings.
        </p>
      </div>
      {meetings.length === 0 ? (
        <div className="rounded-md border bg-white p-10 text-center shadow-sm">
          <FiCalendar className="mx-auto text-4xl text-gray-400" />
          <h3 className="mt-3 text-lg font-semibold text-gray-900">
            No upcoming meetings
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any upcoming meetings.
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
        <div className="space-y-8">
          {todayMeetings.length > 0 && (
            <section>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Today's Meetings
                </h3>
                <p className="text-sm text-gray-500">
                  Meetings scheduled for today.
                </p>
              </div>
              <div className="space-y-4">
                {todayMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                  />
                ))}
              </div>
            </section>
          )}
          {upcomingMeetings.length > 0 && (
            <section>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upcoming Meetings
                </h3>
                <p className="text-sm text-gray-500">
                  Your upcoming scheduled meetings.
                </p>
              </div>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
