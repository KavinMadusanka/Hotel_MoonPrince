import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  DoorOpen,
  CalendarClock,
  Hotel,
  PlusCircle,
  List,
  Megaphone,
  Archive,
  Receipt,
  ClipboardList
} from "lucide-react";
import Logo from '../../../public/Logo.png';

function AdminSidebar() {
  const location = useLocation();

  const isRoomTypeOpen =
    location.pathname.includes("room-type") ||
    location.pathname.includes("room-types");

  const isRoomsOpen =
    location.pathname.includes("/rooms") ||
    location.pathname.includes("add-room");

  const isAnnouncementsOpen =
  location.pathname.includes("/announcements") ||
  location.pathname.includes("add-announcement");

  const mainLinkClasses =
    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition !text-white visited:!text-white";

  const subLinkClasses =
    "ml-11 flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition !text-white visited:!text-white";

  return (
    <aside className="min-h-[calc(100vh-40px)] rounded-[30px] bg-white p-5 text-purple-800 shadow-[0_10px_30px_rgba(15,23,42,0.15)]">
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-purple-800">
            <img src={Logo} alt="Logo" 
                  className="w-full h-full object-cover object-top"
            />
          </div>

          <div>
            <h2 className="m-0 text-lg font-semibold text-purple-800">
              MoonPrince Admin
            </h2>
            <p className="mt-1 text-xs text-slate-500">
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
                ? "bg-[#6A0DAD]"
                : "hover:bg-white/5"
            }`
          }
        >
          <LayoutDashboard size={18} className="text-black" />
          <span className="text-black">Dashboard</span>
        </NavLink>

        <div className="space-y-2">
          <div
            className={`${mainLinkClasses} ${
              isRoomTypeOpen
                ? "bg-white/5"
                : "hover:bg-white/5"
            }`}
          >
            <BedDouble size={18} className="text-black" />
            <span className="text-black">Room Types</span>
          </div>

          <NavLink
            to="/add-room-types"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive
                  ? "bg-[#6A0DAD]"
                  : "hover:bg-white/5"
              }`
            }
          >
            <PlusCircle size={16} className="text-black" />
            <span className="text-black">Add Room Type</span>
          </NavLink>

          <NavLink
            to="/manage-room-types"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive
                  ? "bg-[#6A0DAD]"
                  : "hover:bg-white/5"
              }`
            }
          >
            <List size={16} className="text-black" />
            <span className="text-black">Manage Room Types</span>
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
            <DoorOpen size={18} className="text-black" />
            <span className="text-black">Rooms</span>
          </div>

          <NavLink
            to="/add-room"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive
                  ? "bg-[#6A0DAD]"
                  : "hover:bg-white/5"
              }`
            }
          >
            <PlusCircle size={16} className="text-black" />
            <span className="text-black">Add Room</span>
          </NavLink>

          <NavLink
            to="/manage-rooms"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive
                  ? "bg-[#6A0DAD]"
                  : "hover:bg-white/5"
              }`
            }
          >
            <List size={16} className="text-black" />
            <span className="text-black">Manage Rooms</span>
          </NavLink>
        </div>
        
        <NavLink
          to="/manage-holds"
          className={({ isActive }) =>
          `${mainLinkClasses} ${isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"}`
          }
        >
          <Archive size={18} className="text-black" />
          <span className="text-black">Manage Holds</span>
        </NavLink>
        
        <NavLink
          to="/reservations"
          className={({ isActive }) =>
            `${mainLinkClasses} ${
              isActive
                ? "bg-[#6A0DAD]"
                : "hover:bg-white/5"
            }`
          }
        >
          <CalendarClock size={18} className="text-black" />
          <span className="text-black">Reservations</span>
        </NavLink>

        <div className="space-y-2">
        <div
          className={`${mainLinkClasses} ${
            isAnnouncementsOpen
              ? "bg-white/5"
              : "hover:bg-white/5"
          }`}
        >
          <Megaphone size={18} className="text-black" />
          <span className="text-black">Announcements</span>
        </div>

        <NavLink
          to="/add-announcement"
          className={({ isActive }) =>
            `${subLinkClasses} ${
              isActive
                ? "bg-[#6A0DAD]"
                : "hover:bg-white/5"
            }`
          }
        >
          <PlusCircle size={16} className="text-black" />
          <span className="text-black">Add Announcement</span>
        </NavLink>

        <NavLink
          to="/all-announcements"
          className={({ isActive }) =>
            `${subLinkClasses} ${
              isActive
                ? "bg-[#6A0DAD]"
                : "hover:bg-white/5"
            }`
          }
        >
          <List size={16} className="text-black" />
          <span className="text-black">All Announcements</span>
        </NavLink>
      </div>

      <div className="space-y-2">
        <div
          className={`${mainLinkClasses} ${
            isAnnouncementsOpen
              ? "bg-white/5"
              : "hover:bg-white/5"
          }`}
        >
          <ClipboardList size={18} className="text-black" />
          <span className="text-black">Bills</span>
        </div>

        <NavLink
          to="/billing"
          className={({ isActive }) =>
            `${subLinkClasses} ${
              isActive
                ? "bg-[#6A0DAD] text-white"
                : "hover:bg-white/5"
            }`
          }
        >
          <PlusCircle size={16} className="text-black" />
          <span className="text-black">Add Bills</span>
        </NavLink>

        <NavLink
          to="/all-bills"
          className={({ isActive }) =>
            `${subLinkClasses} ${
              isActive
                ? "bg-[#6A0DAD] text-white"
                : "hover:bg-white/5"
            }`
          }
        >
          <Receipt size={16} className="text-black" />
          <span className="text-black">All Payments</span>
        </NavLink>
      </div>
      </nav>

      {/* <div className="mt-8 rounded-[24px] bg-purple-50 p-4">
        <p className="text-xs uppercase tracking-[0.15em] text-[#D4AF37]">
          Admin Note
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Manage room categories, rooms, and reservation operations from one
          place.
        </p>
      </div> */}
    </aside>
  );
}

export default AdminSidebar;