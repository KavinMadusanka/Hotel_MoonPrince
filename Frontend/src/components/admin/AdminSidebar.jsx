import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  DoorOpen,
  CalendarClock,
  MessageSquare,
  PlusCircle,
  List,
  Megaphone,
  Archive,
  Receipt,
  ClipboardList,
  LogOut
} from "lucide-react";
import { useAuth } from "../../context/auth";
import { logout } from "../../apiService/userService";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Logo from "../../../public/Logo.png";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const isRoomTypeOpen =
    location.pathname.includes("room-type") ||
    location.pathname.includes("room-types");

  const isRoomsOpen =
    location.pathname.includes("/rooms") ||
    location.pathname.includes("add-room");

  const isAnnouncementsOpen =
    location.pathname.includes("/announcements") ||
    location.pathname.includes("add-announcement");

  const isBillsOpen =
    location.pathname.includes("/billing") ||
    location.pathname.includes("/all-bills");

  const mainLinkClasses =
    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition !text-white visited:!text-white";

  const subLinkClasses =
    "ml-11 flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition !text-white visited:!text-white";

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem("auth");
      localStorage.removeItem('token');
      Cookies.remove("access_token");
      setAuth({ ...auth, token: "" });
      navigate("/signin");

    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
      // navigate("/signin");
    }
  };

  return (
    <aside className="min-h-screen rounded-[30px] bg-white p-5 text-purple-800 shadow-[0_10px_30px_rgba(15,23,42,0.15)]">
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-purple-800">
            <img
              src={Logo}
              alt="Logo"
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
              isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard size={18} className={isActive ? "text-white" : "text-black"} />
              <span className={isActive ? "text-white" : "text-black"}>Dashboard</span>
            </>
          )}
        </NavLink>

        <div className="space-y-2">
          <div
            className={`${mainLinkClasses} ${
              isRoomTypeOpen ? "bg-white/5" : "hover:bg-white/5"
            }`}
          >
            <BedDouble size={18} className="text-black" />
            <span className="text-black">Room Types</span>
          </div>

          <NavLink
            to="/add-room-types"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <PlusCircle size={16} className={isActive ? "text-white" : "text-black"} />
                <span className={isActive ? "text-white" : "text-black"}>Add Room Type</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/manage-room-types"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <List size={16} className={isActive ? "text-white" : "text-black"} />
                <span className={isActive ? "text-white" : "text-black"}>Manage Room Types</span>
              </>
            )}
          </NavLink>
        </div>

        <div className="space-y-2">
          <div
            className={`${mainLinkClasses} ${
              isRoomsOpen ? "bg-white/5" : "hover:bg-white/5"
            }`}
          >
            <DoorOpen size={18} className="text-black" />
            <span className="text-black">Rooms</span>
          </div>

          <NavLink
            to="/add-room"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <PlusCircle size={16} className={isActive ? "text-white" : "text-black"} />
                <span className={isActive ? "text-white" : "text-black"}>Add Room</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/manage-rooms"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <List size={16} className={isActive ? "text-white" : "text-black"} />
                <span className={isActive ? "text-white" : "text-black"}>Manage Rooms</span>
              </>
            )}
          </NavLink>


          <NavLink
            to="/room-status"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <List size={16} className={isActive ? "text-white" : "text-black"} />
                <span className={isActive ? "text-white" : "text-black"}>Room Status Control</span>
              </>
            )}
          </NavLink>
        </div>

        <NavLink
          to="/manage-holds"
          className={({ isActive }) =>
            `${mainLinkClasses} ${
              isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Archive size={18} className={isActive ? "text-white" : "text-black"} />
              <span className={isActive ? "text-white" : "text-black"}>Manage Holds</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/reservations"
          className={({ isActive }) =>
            `${mainLinkClasses} ${
              isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <CalendarClock size={18} className={isActive ? "text-white" : "text-black"} />
              <span className={isActive ? "text-white" : "text-black"}>Reservations</span>
            </>
          )}
        </NavLink>

        <div className="space-y-2">
          <div
            className={`${mainLinkClasses} ${
              isAnnouncementsOpen ? "bg-white/5" : "hover:bg-white/5"
            }`}
          >
            <Megaphone size={18} className="text-black" />
            <span className="text-black">Announcements</span>
          </div>

          <NavLink
            to="/add-announcement"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <PlusCircle size={16} className={isActive ? "text-white" : "text-black"} />
                <span className={isActive ? "text-white" : "text-black"}>Add Announcement</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/all-announcements"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <List size={16} className={isActive ? "text-white" : "text-black"} />
                <span className={isActive ? "text-white" : "text-black"}>All Announcements</span>
              </>
            )}
          </NavLink>
        </div>

        <div className="space-y-2">
          <div
            className={`${mainLinkClasses} ${
              isBillsOpen ? "bg-white/5" : "hover:bg-white/5"
            }`}
          >
            <ClipboardList size={18} className="text-black" />
            <span className="text-black">Bills</span>
          </div>

          <NavLink
            to="/billing"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <PlusCircle size={16} className={isActive ? "text-white" : "text-black"} />
                <span className={isActive ? "text-white" : "text-black"}>Add Bills</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/all-bills"
            className={({ isActive }) =>
              `${subLinkClasses} ${
                isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Receipt size={16} className={isActive ? "text-white" : "text-black"} />
                <span className={isActive ? "text-white" : "text-black"}>All Payments</span>
              </>
            )}
          </NavLink>

          <NavLink
          to="/manage-room-type-reviews"
          className={({ isActive }) =>
            `${mainLinkClasses} ${
              isActive ? "bg-[#6A0DAD]" : "hover:bg-white/5"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <MessageSquare size={18} className={isActive ? "text-white" : "text-black"} />
              <span className={isActive ? "text-white" : "text-black"}>Manage Reviews</span>
            </>
          )}
        </NavLink>
        </div>
      </nav>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;