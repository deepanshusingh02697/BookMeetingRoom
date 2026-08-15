import type { BookingDetails_Interface } from "../graphql/Client";
interface Props {
  booking: NonNullable<BookingDetails_Interface["BookingDetails"]>;
  onClose: () => void;
}
export default function BookingDetail({
  booking,
  onClose,
}: Props) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {booking.title}
            </h2>
            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                booking.status === "CONFIRMED"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : booking.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-700"
          >
            X
          </button>
        </div>
        <div className="space-y-5 p-6">
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Room
            </p>
            <p className="mt-1 font-semibold text-gray-900">
              {booking.room.name}
            </p>
            <p className="text-sm text-gray-500">
              Floor {booking.room.floor} · {booking.room.location}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Date & Time
            </p>
            <p className="mt-1 font-medium">
              {start.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              {start.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" - "}
              {end.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Organizer
            </p>

            <p className="mt-1 font-medium">
              {booking.organizer.firstname}{" "}
              {booking.organizer.lastname}
            </p>

            <p className="text-sm text-gray-500">
              {booking.organizer.email}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Participants ({booking.participants.length})
            </p>
            {booking.participants.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">
                No participants
              </p>
            ) : (
              <div className="mt-2 space-y-2">
                {booking.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <p className="text-sm font-medium">
                      {participant.user.firstname}{" "}
                      {participant.user.lastname}
                    </p>

                    <p className="text-xs text-gray-500">
                      {participant.user.email}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {booking.description && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">
                Description
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {booking.description}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Check-in
            </p>
            <p className="mt-1 text-sm">
              {booking.checkIn
                ? `Checked in at ${new Date(
                    booking.checkIn.checkedInAt
                  ).toLocaleTimeString()}`
                : "Not checked in"}
            </p>
          </div>
        </div>
        <div className="flex justify-end border-t p-6">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}