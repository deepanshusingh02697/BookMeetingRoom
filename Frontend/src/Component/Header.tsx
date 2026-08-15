import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiGrid, FiClipboard, FiCalendar } from "react-icons/fi";
import type { CurrUser_Interface, LogOut_Interface } from "../graphql/Client";
import { logout_Mutation } from "../graphql/Mutation";
import { currentUser_Query } from "../graphql/Query";

export default function Header() {
  const navigate = useNavigate();
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
      console.error(error);
      toast.error("Logout failed");
    }
  };
  const user = data?.CurrUser;
  function capitalizName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  return (
    <header className="h-[60px] bg-[#18216B] px-5 text-white">
      <div className="flex h-full items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">Room Meeting Intelligence</h1>
        </div>

        {user?.role === "EMPLOYEE" && (
          <nav className="flex items-center gap-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 rounded px-3 py-2 text-sm ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <FiGrid className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded px-3 py-2 text-sm ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <FiCalendar className="h-4 w-4" />
              <span>Find Room</span>
            </NavLink>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded px-3 py-2 text-sm ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <FiClipboard className="h-4 w-4" />
              <span>My Bookings</span>
            </NavLink>
          </nav>
        )}
        <div className="flex items-center gap-5">
          {user && (
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-white">
                {capitalizName(user.firstname)} {capitalizName(user.lastname)}
              </p>
              <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
                {user.role}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="rounded-md border border-white/40 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
