import { useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiGrid, FiClipboard, FiCalendar, FiMenu, FiX } from "react-icons/fi";

import type { CurrUser_Interface, LogOut_Interface } from "../graphql/Client";
import { logout_Mutation } from "../graphql/Mutation";
import { currentUser_Query } from "../graphql/Query";
import Notification from "./Notification";

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data } = useQuery<CurrUser_Interface>(currentUser_Query);
  const [logout, { loading }] = useMutation<LogOut_Interface>(logout_Mutation, {
    refetchQueries: [currentUser_Query],
  });
  const client = useApolloClient();
  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response.data?.LogOut.success) {
        toast.success(response.data.LogOut.msg, {
          type: "success",
          theme: "colored",
        });
        await client.clearStore();
        navigate("/login");
      }
    } catch (error) {
      const err = error instanceof Error;
      if (err) {
        toast.error(error.message, {
          theme: "colored",
          type: "error",
        });
      } else {
        toast("Logout failed");
      }
    }
  };
  const user = data?.CurrUser;
  function capitalizName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  const closeMenu = () => {
    setMenuOpen(false);
  };
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded px-3 py-2 text-sm ${
      isActive
        ? "bg-white/15 text-white"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;
  return (
    <header className="relative min-h-[60px] bg-[#18216B] px-4 text-white sm:px-5">
      <div className="flex min-h-[60px] items-center justify-between gap-3">
        <div className="min-w-0">
          {user?.role === "EMPLOYEE" ? (
            <NavLink to="/" onClick={closeMenu}>
              <h1 className="truncate text-base font-medium sm:text-lg">
                Room Meeting Intelligence
              </h1>
            </NavLink>
          ) : (
            <NavLink to="/admin" onClick={closeMenu}>
              <h1 className="truncate text-base font-medium sm:text-lg">
                Room Meeting Intelligence
              </h1>
            </NavLink>
          )}
        </div>
        {user?.role === "EMPLOYEE" && (
          <nav className="hidden items-center gap-3 lg:flex">
            <NavLink to="/" end className={navClass}>
              <FiGrid className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/rooms" className={navClass}>
              <FiCalendar className="h-4 w-4" />
              <span>Find Room</span>
            </NavLink>
            <NavLink to="/bookings" className={navClass}>
              <FiClipboard className="h-4 w-4" />
              <span>Bookings</span>
            </NavLink>
            <NavLink to="/waitlist" className={navClass}>
              <FiClipboard className="h-4 w-4" />
              <span>Wait-List</span>
            </NavLink>
            <NavLink to="/meetings" className={navClass}>
              <FiCalendar />
              Meetings
            </NavLink>
          </nav>
        )}
        <div className="flex shrink-0 items-center gap-2 sm:gap-5">
          {user && (
            <div className="flex items-center gap-2 sm:gap-4">
              {user.role === "EMPLOYEE" ? (
                <Notification />
              ) : (
                <p className="hidden text-sm font-medium text-white sm:block">
                  {capitalizName(user.firstname)} {capitalizName(user.lastname)}
                </p>
              )}
              <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700 sm:text-[11px]">
                {user.role}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="hidden rounded-md border border-white/40 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:block"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
          {user?.role === "EMPLOYEE" && (
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-md p-2 text-white hover:bg-white/10 lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="rounded-md border border-white/40 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
          >
            Logout
          </button>
        </div>
      </div>
      {user?.role === "EMPLOYEE" && menuOpen && (
        <div className="border-t border-white/10 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink to="/" end className={navClass} onClick={closeMenu}>
              <FiGrid className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/rooms" className={navClass} onClick={closeMenu}>
              <FiCalendar className="h-5 w-5" />
              <span>Find Room</span>
            </NavLink>
            <NavLink to="/bookings" className={navClass} onClick={closeMenu}>
              <FiClipboard className="h-5 w-5" />
              <span>Bookings</span>
            </NavLink>
            <NavLink to="/waitlist" className={navClass} onClick={closeMenu}>
              <FiClipboard className="h-5 w-5" />
              <span>Wait-List</span>
            </NavLink>
            <NavLink to="/meetings" className={navClass} onClick={closeMenu}>
              <FiCalendar />
              Meetings
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
