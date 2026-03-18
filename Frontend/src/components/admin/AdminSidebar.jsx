import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  DoorOpen,
  CalendarClock,
  Hotel,
  PlusCircle,
  List
} from "lucide-react";

function AdminSidebar() {
  const location = useLocation();

  const isRoomTypeOpen =
    location.pathname.includes("room-type") ||
    location.pathname.includes("room-types");

  const isRoomsOpen =
    location.pathname.includes("/rooms") ||
    location.pathname.includes("add-room");

  const mainLinkClasses =
    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition !text-white visited:!text-white";

  const subLinkClasses =
    "ml-11 flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition !text-white visited:!text-white";

  return (
    <aside className="min-h-[calc(100vh-40px)] rounded-[30px] bg-[#1f2430] p-5 text-white shadow-[0_10px_30px_rgba(15,23,42,0.15)]">
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-700 text-white">
            <Hotel size={22} />
          </div>

          <div>
            <h2 className="m-0 text-lg font-semibold text-white">
              MoonPrince Admin
            </h2>
            <p className="mt-1 text-xs text-white/60">
              Hotel management panel
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `${mainLinkClasses} ${
              isActive
                ? "bg-violet-700"
                : "hover:bg-white/5"
            }`
          }
        >
          <LayoutDashboard size={18} className="text-white" />
          <span className="text-white">Dashboard</span>
        </NavLink>

        <div className="space-y-2">
          <div
            className={`${mainLinkClasses} ${
              isRoomTypeOpen
                ? "bg-white/5"
                : "hover:bg-white/5"
            }`}
          >
            <BedDouble size={18} className="text-white" />
            <span className="text-white">Room Types</span>
          </div>

          <NavLink
            to="/add-room-types"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive
                  ? "bg-violet-700"
                  : "hover:bg-white/5"
              }`
            }
          >
            <PlusCircle size={16} className="text-white" />
            <span className="text-white">Add Room Type</span>
          </NavLink>

          <NavLink
            to="/manage-room-types"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive
                  ? "bg-violet-700"
                  : "hover:bg-white/5"
              }`
            }
          >
            <List size={16} className="text-white" />
            <span className="text-white">Manage Room Types</span>
          </NavLink>
        </div>

        <div className="space-y-2">
          <div
            className={`${mainLinkClasses} ${
              isRoomsOpen
                ? "bg-white/5"
                : "hover:bg-white/5"
            }`}
          >
            <DoorOpen size={18} className="text-white" />
            <span className="text-white">Rooms</span>
          </div>

          <NavLink
            to="/add-room"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive
                  ? "bg-violet-700"
                  : "hover:bg-white/5"
              }`
            }
          >
            <PlusCircle size={16} className="text-white" />
            <span className="text-white">Add Room</span>
          </NavLink>

          <NavLink
            to="/manage-rooms"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive
                  ? "bg-violet-700"
                  : "hover:bg-white/5"
              }`
            }
          >
            <List size={16} className="text-white" />
            <span className="text-white">Manage Rooms</span>
          </NavLink>
        </div>

        <NavLink
          to="/reservations"
          className={({ isActive }) =>
            `${mainLinkClasses} ${
              isActive
                ? "bg-violet-700"
                : "hover:bg-white/5"
            }`
          }
        >
          <CalendarClock size={18} className="text-white" />
          <span className="text-white">Reservations</span>
        </NavLink>
      </nav>

      <div className="mt-8 rounded-[24px] bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.15em] text-[#d4a514]">
          Admin Note
        </p>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Manage room categories, rooms, and reservation operations from one
          place.
        </p>
      </div>
    </aside>
  );
}

export default AdminSidebar;