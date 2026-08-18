import { useMutation, useQuery } from "@apollo/client/react";
import {
  FiCalendar,
  FiXCircle,
  FiUserX,
  FiHome,
  FiRefreshCw,
} from "react-icons/fi";
import {
  adminCalendar_Query,
  currentUser_Query,
  usedAnalytics_Query,
} from "../graphql/Query";
import type {
  AdminCalender_Interface,
  CurrUser_Interface,
  ReleaseBooking_Interface,
  UsedAnalytics_Interface,
} from "../graphql/Client";
import { releaseBooking_Mutation } from "../graphql/Mutation";
import Loader from "../Component/Loader";

function getTodayRange() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}
function formatTime(date: string) {
  return new Date(Number(date)).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
export default function Dashboard() {
  const { startDate, endDate } = getTodayRange();
  const { data: userData, loading: userLoading } =
    useQuery<CurrUser_Interface>(currentUser_Query);
  const { data: bookingData, loading: bookingLoading } =
    useQuery<AdminCalender_Interface>(adminCalendar_Query, {
      variables: {
        startDate,
        endDate,
      },
    });
  const { data: analyticsData, loading: analyticsLoading } =
    useQuery<UsedAnalytics_Interface>(usedAnalytics_Query, {
      variables: {
        startDate,
        endDate,
      },
    });
  const [releaseBooking, { loading: releaseLoading }] =
    useMutation<ReleaseBooking_Interface>(releaseBooking_Mutation, {
      refetchQueries: [
        {
          query: adminCalendar_Query,
          variables: {
            startDate,
            endDate,
          },
        },
        {
          query: usedAnalytics_Query,
          variables: {
            startDate,
            endDate,
          },
        },
      ],
    });
  const user = userData?.CurrUser;
  const bookings = bookingData?.AdminCalender ?? [];
  const analytics = analyticsData?.UsedAnalytics;
  const handleReleaseBookings = async () => {
    const confirmed = window.confirm(
      "Do you want to release expired bookings? ",
    );
    if (!confirmed) return;
    try {
      const result = await releaseBooking();
      alert(result.data?.ReleaseBooking || "Bookings released successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to release bookings");
      }
    }
  };
  const loading = userLoading || bookingLoading || analyticsLoading;
  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome Back, {user?.firstname}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening today.
        </p>
        {user?.role === "ADMIN" && (
          <button
            type="button"
            onClick={handleReleaseBookings}
            disabled={releaseLoading}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-[#18216B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#252d80] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw />
            {releaseLoading ? "Releasing..." : "Release Bookings"}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Today's Bookings"
          value={analytics?.totalBookings ?? 0}
          icon={<FiCalendar />}
        />
        <DashboardCard
          title="Cancelled"
          value={analytics?.totalCancelled ?? 0}
          icon={<FiXCircle />}
        />
        <DashboardCard
          title="No Show"
          value={analytics?.totalNoShow ?? 0}
          icon={<FiUserX />}
        />
        <DashboardCard
          title="Active Rooms"
          value={
            analytics?.utilizeByRoom.filter(
              (item) => item.room.status === "AVAILABLE",
            ).length ?? 0
          }
          icon={<FiHome />}
        />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">Today's Bookings</h3>
            <p className="mt-1 text-xs text-gray-500">
              Meetings scheduled for today
            </p>
          </div>
          {bookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No bookings for today.
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => {
                let statusClass = "bg-gray-100 text-gray-700";
                if (booking.status === "CONFIRMED") {
                  statusClass = "bg-green-100 text-green-700";
                } else if (booking.status === "CANCELLED") {
                  statusClass = "bg-red-100 text-red-700";
                } else if (booking.status === "COMPLETED") {
                  statusClass = "bg-blue-100 text-blue-700";
                } else if (booking.status === "NO_SHOW") {
                  statusClass = "bg-orange-100 text-orange-700";
                }
                return (
                  <div key={booking.id} className="rounded border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {booking.room.name} - {booking.room.location}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatTime(booking.startTime).toUpperCase()} -{" "}
                          {formatTime(booking.endTime).toUpperCase()}
                        </p>
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-[11px] ${statusClass}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="h-fit lg:sticky lg:top-5 rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">Room Usage</h3>
            <p className="mt-1 text-xs text-gray-500">
              Today's room booking statistics
            </p>
          </div>
          {!analytics?.utilizeByRoom.length ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No room usage data available.
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.utilizeByRoom.slice(0, 5).map((item) => (
                <div
                  key={item.room.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{item.room.name}</p>
                    <p className="text-xs text-gray-500">
                      Floor {item.room.floor} - Capacity {item.room.capacity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {item.totalBookings}
                    </p>
                    <p className="text-xs text-gray-500">bookings</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-md border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#eef0ff] text-lg text-[#18216B]">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-600">{title}</p>
    </div>
  );
}
