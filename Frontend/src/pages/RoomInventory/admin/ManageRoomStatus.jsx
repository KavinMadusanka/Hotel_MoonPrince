import { useEffect, useMemo, useState } from "react";
import AdminPageLayout from "../../../layouts/AdminPageLayout";
import { getRooms, updateRoomStatus } from "../../../apiService/roomService";
import {
  DoorOpen,
  Layers3,
  BedDouble,
  RefreshCcw,
  ClipboardList,
  Search
} from "lucide-react";

function ManageRoomStatus() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoadingId, setStatusLoadingId] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchRoomNumber, setSearchRoomNumber] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getRooms();
      setRooms(res.data || []);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleStatusChange = async (roomId, nextStatus) => {
    try {
      setStatusLoadingId(`${roomId}-${nextStatus}`);
      await updateRoomStatus(roomId, { status: nextStatus });
      await fetchRooms();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update room status");
    } finally {
      setStatusLoadingId("");
    }
  };

  const filteredRooms = useMemo(() => {
    let filtered = rooms;

    if (filterStatus !== "all") {
      filtered = filtered.filter((room) => room.status === filterStatus);
    }

    if (searchRoomNumber.trim()) {
      filtered = filtered.filter((room) =>
        String(room.roomNumber || "")
          .toLowerCase()
          .includes(searchRoomNumber.toLowerCase())
      );
    }

    return filtered;
  }, [rooms, filterStatus, searchRoomNumber]);

  return (
    <AdminPageLayout
      title="Manage Rooms"
      subtitle="View physical rooms and update their operational status quickly."
    >
      <div className="space-y-6">
        <section className="rounded-[28px] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1f2937]">
                Room Status Controls
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Filter rooms, search by room number, and update room states directly from the list.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:w-auto xl:grid-cols-[220px_220px_auto]">
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchRoomNumber}
                  onChange={(e) => setSearchRoomNumber(e.target.value)}
                  placeholder="Search room number"
                  className="w-full rounded-2xl border border-[#e5e7eb] bg-white py-3 pl-11 pr-4 text-sm text-[#111827] placeholder:text-gray-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-200"
                  style={{
                    colorScheme: "light",
                    WebkitTextFillColor: "#111827"
                  }}
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-200"
                style={{ colorScheme: "light" }}
              >
                <option value="all" className="text-[#111827] bg-white">
                  All Statuses
                </option>
                <option value="ready" className="text-[#111827] bg-white">
                  Ready
                </option>
                <option value="dirty" className="text-[#111827] bg-white">
                  Dirty
                </option>
                <option value="maintenance" className="text-[#111827] bg-white">
                  Maintenance
                </option>
                <option value="out_of_service" className="text-[#111827] bg-white">
                  Out of Service
                </option>
              </select>

              <button
                type="button"
                onClick={fetchRooms}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="rounded-[28px] bg-white p-10 text-center text-sm text-gray-500 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              Loading rooms...
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="rounded-[28px] bg-white p-10 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <p className="text-lg font-semibold text-[#1f2937]">No rooms found</p>
              <p className="mt-2 text-sm text-gray-500">
                Try changing the status filter or room number search.
              </p>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room._id}
                className="rounded-[24px] border border-[#ece7ff] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <InfoBlock
                      icon={<DoorOpen size={18} />}
                      label="Room Number"
                      value={room.roomNumber}
                    />
                    <InfoBlock
                      icon={<Layers3 size={18} />}
                      label="Floor"
                      value={room.floor}
                    />
                    <InfoBlock
                      icon={<BedDouble size={18} />}
                      label="Room Type"
                      value={room.roomType?.name || "-"}
                    />
                    <InfoBlock
                      icon={<ClipboardList size={18} />}
                      label="Current Status"
                      value={<StatusBadge status={room.status} />}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    {["ready", "dirty", "maintenance", "out_of_service"].map(
                      (status) => {
                        const isActive = room.status === status;
                        const isLoading =
                          statusLoadingId === `${room._id}-${status}`;

                        return (
                          <button
                            key={status}
                            type="button"
                            disabled={isLoading || isActive}
                            onClick={() => handleStatusChange(room._id, status)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                              isActive
                                ? "cursor-default bg-violet-700 text-white"
                                : "bg-[#faf7ff] text-[#1f2937] ring-1 ring-[#ede9fe] hover:bg-[#f3ebff]"
                            } disabled:opacity-60`}
                          >
                            {isLoading ? "Updating..." : formatStatus(status)}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </AdminPageLayout>
  );
}

function InfoBlock({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-[#fcfbff] p-4 ring-1 ring-[#ede9fe]">
      <div className="mb-2 flex items-center gap-2 text-violet-700">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>
      <div className="text-sm font-semibold text-[#1f2937]">{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const classes = {
    ready: "bg-emerald-50 text-emerald-700",
    dirty: "bg-amber-50 text-amber-700",
    maintenance: "bg-red-50 text-red-700",
    out_of_service: "bg-slate-100 text-slate-700"
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        classes[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

function formatStatus(status) {
  if (status === "out_of_service") return "Out of Service";
  if (status === "maintenance") return "Maintenance";
  if (status === "dirty") return "Dirty";
  if (status === "ready") return "Ready";
  return status;
}

export default ManageRoomStatus;