import { useEffect, useRef, useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import { useQuery } from "@apollo/client/react";
import { socket } from "../socket";
import type { CurrUser_Interface } from "../graphql/Client";
import { currentUser_Query } from "../graphql/Query";
import { useNavigate } from "react-router-dom";

interface NotifInterface {
  id: string;
  message: string;
  bookingId: number;
}
export default function Notification() {
  const { data } = useQuery<CurrUser_Interface>(currentUser_Query);
  const [notif, setNotif] = useState<NotifInterface[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const user = data?.CurrUser;
  useEffect(() => {
    if (!user?.id) return;
    const userId = Number(user.id);
    const handleNotification = (notification: {
      message: string;
      bookingId: number;
    }) => {
      setNotif((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          message: notification.message,
          bookingId: notification.bookingId,
        },
      ]);
    };
    const joinUserRoom = () => {
      socket.emit("joinUser", userId);
    };
    socket.on("notify", handleNotification);
    if (socket.connected) {
      joinUserRoom();
    } else {
      socket.connect();
      socket.once("connect", joinUserRoom);
    }
    return () => {
      socket.off("notify", handleNotification);
      socket.off("connect", joinUserRoom);
      socket.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);
  const removeNotification = (id: string) => {
    setNotif((prev) => prev.filter((notification) => notification.id !== id));
  };
  const clearNotifications = () => {
    setNotif([]);
  };
  return (
    <div ref={notifRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative text-xl text-white hover:text-gray-200"
      >
        <IoNotifications />
        {notif.length > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {notif.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute left-[-118px] top-11 z-50 w-80 rounded-lg border bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Notifications
              </h3>
              <p className="text-xs text-gray-500">
                {notif.length} notification
              </p>
            </div>
            {notif.length > 0 && (
              <button
                type="button"
                onClick={clearNotifications}
                className="text-xs text-[#18216B] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          {notif.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <IoNotifications className="mx-auto text-3xl text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notif.map((noti) => (
                <div
                  key={noti.id}
                  onClick={() => navigate(`/bookings/${noti.bookingId}`)}
                  className="flex cursor-pointer gap-3 border-b px-4 py-3 hover:bg-gray-50"
                >
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#18216B]" />
                  <p className="flex-1 text-sm text-gray-700">{noti.message}</p>
                  <button
                    type="button"
                    onClick={(e) => {e.stopPropagation(); removeNotification(noti.id)}}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
