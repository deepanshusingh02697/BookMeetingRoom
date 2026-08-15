import { NavLink } from "react-router-dom";
import { FiGrid, FiCalendar, FiHome, FiMonitor } from "react-icons/fi";

export default function AdminLeftSide() {
  return (
    <div className="min-h-[calc(100vh-60px)] p-3">
      <div className="mb-4 px-3 py-2 text-xs font-semibold uppercase text-gray-400">
        Admin Menu
      </div>
      <div className="space-y-1">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 rounded px-3 py-3 text-sm ${
              isActive
                ? "bg-[#18216B] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiGrid className="h-4 w-4" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin/calendar"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded px-3 py-3 text-sm ${
              isActive
                ? "bg-[#18216B] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiCalendar className="h-4 w-4" />
          <span>Calendar</span>
        </NavLink>
        <NavLink
          to="/admin/rooms"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded px-3 py-3 text-sm ${
              isActive
                ? "bg-[#18216B] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiHome className="h-4 w-4" />
          <span>Rooms</span>
        </NavLink>
        <NavLink
          to="/admin/equipment"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded px-3 py-3 text-sm ${
              isActive
                ? "bg-[#18216B] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiMonitor className="h-4 w-4" />
          <span>Equipment</span>
        </NavLink>
      </div>
    </div>
  );
}
