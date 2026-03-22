import { useEffect, useMemo, useState } from "react";
import AdminPageLayout from "../../../layouts/AdminPageLayout";
import {
  getHolds,
  confirmHold,
  releaseHold
} from "../../../apiService/roomService";
import {
  CalendarDays,
  Search,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock3,
  ShieldCheck,
  BedDouble,
  User,
  Mail
} from "lucide-react";

function ManageHoldsPage() {
  const [holds, setHolds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    search: ""
  });

  const fetchHolds = async () => {
    try {
      setLoading(true);
      const res = await getHolds(filters);
      setHolds(res.data || []);
    } catch (error) {
      console.error("Failed to fetch holds", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolds();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchHolds();
  };

  const handleConfirm = async (holdId) => {
    try {
      setActionLoadingId(holdId);
      await confirmHold(holdId);
      await fetchHolds();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to confirm hold");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleRelease = async (holdId) => {
    try {
      setActionLoadingId(holdId);
      await releaseHold(holdId);
      await fetchHolds();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to release hold");
    } finally {
      setActionLoadingId("");
    }
  };

  const stats = useMemo(() => {
    return {
      total: holds.length,
      held: holds.filter((item) => item.status === "held").length,
      confirmed: holds.filter((item) => item.status === "confirmed").length,
      released: holds.filter((item) => item.status === "released").length,
      expired: holds.filter((item) => item.status === "expired").length
    };
  }, [holds]);

  return (
    <AdminPageLayout
      title="Manage Holds"
      subtitle="Review active holds, confirm reservations, and release inactive requests."
    >
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard title="Total Holds" value={stats.total} />
          <SummaryCard title="Held" value={stats.held} accent="amber" />
          <SummaryCard title="Confirmed" value={stats.confirmed} accent="green" />
          <SummaryCard title="Released" value={stats.released} accent="slate" />
          <SummaryCard title="Expired" value={stats.expired} accent="red" />
        </section>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <form
              onSubmit={handleSearch}
              className="flex w-full flex-col gap-3 md:flex-row xl:max-w-2xl"
            >
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  placeholder="Search by guest name or email"
                  className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcff] py-3 pl-11 pr-4 text-sm outline-none focus:border-violet-700"
                />
              </div>

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="rounded-2xl border border-[#e5e7eb] bg-[#fcfcff] px-4 py-3 text-sm outline-none focus:border-violet-700"
              >
                <option value="all">All Statuses</option>
                <option value="held">Held</option>
                <option value="confirmed">Confirmed</option>
                <option value="released">Released</option>
                <option value="expired">Expired</option>
              </select>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                <Search size={16} />
                Search
              </button>
            </form>

            <button
              type="button"
              onClick={fetchHolds}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e5e7eb] bg-white px-5 py-3 text-sm font-semibold text-[#1f2937] transition hover:bg-[#faf7ff]"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Loading holds...
            </div>
          ) : holds.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg font-semibold text-[#1f2937]">No holds found</p>
              <p className="mt-2 text-sm text-gray-500">
                Try changing the filter or search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {holds.map((hold) => {
                const isActionLoading = actionLoadingId === hold._id;

                return (
                  <div
                    key={hold._id}
                    className="rounded-[24px] border border-[#ece7ff] bg-[#fcfbff] p-5"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <InfoBlock
                          icon={<BedDouble size={16} />}
                          label="Room Type"
                          value={hold.roomType?.name || "-"}
                        />
                        <InfoBlock
                          icon={<CalendarDays size={16} />}
                          label="Stay"
                          value={`${formatDate(hold.checkIn)} → ${formatDate(
                            hold.checkOut
                          )}`}
                        />
                        <InfoBlock
                          icon={<User size={16} />}
                          label="Guest"
                          value={hold.guestName || "-"}
                        />
                        <InfoBlock
                          icon={<Mail size={16} />}
                          label="Email"
                          value={hold.guestEmail || "-"}
                        />
                      </div>

                      <div className="flex flex-col items-start gap-3 xl:min-w-[260px] xl:items-end">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={hold.status} />
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1f2937] ring-1 ring-[#e5e7eb]">
                            Qty: {hold.qty}
                          </span>
                        </div>

                        <div className="text-xs text-gray-500">
                          Created: {formatDateTime(hold.createdAt)}
                        </div>

                        {hold.status === "held" && hold.expiresAt && (
                          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            <Clock3 size={14} />
                            Expires: {formatDateTime(hold.expiresAt)}
                          </div>
                        )}

                        {hold.notes && (
                          <div className="max-w-[260px] text-right text-xs text-gray-500">
                            Note: {hold.notes}
                          </div>
                        )}

                        <div className="mt-1 flex flex-wrap gap-2">
                          {hold.status === "held" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleConfirm(hold._id)}
                                disabled={isActionLoading}
                                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <CheckCircle2 size={14} />
                                Confirm
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRelease(hold._id)}
                                disabled={isActionLoading}
                                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <XCircle size={14} />
                                Release
                              </button>
                            </>
                          )}

                          {hold.status === "confirmed" && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                              <ShieldCheck size={14} />
                              Confirmed Hold
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AdminPageLayout>
  );
}

function SummaryCard({ title, value, accent = "violet" }) {
  const accentClasses = {
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    slate: "bg-slate-50 text-slate-700 ring-slate-100",
    red: "bg-red-50 text-red-700 ring-red-100"
  };

  return (
    <div
      className={`rounded-[24px] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] ring-1 ${accentClasses[accent]}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em]">{title}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}

function InfoBlock({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-[#ede9fe]">
      <div className="mb-2 flex items-center gap-2 text-violet-700">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#1f2937] break-words">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const classes = {
    held: "bg-amber-50 text-amber-700",
    confirmed: "bg-emerald-50 text-emerald-700",
    released: "bg-slate-100 text-slate-700",
    expired: "bg-red-50 text-red-700"
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        classes[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

export default ManageHoldsPage;