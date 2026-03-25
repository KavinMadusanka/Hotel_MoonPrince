import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLayout from "../../../layouts/AdminPageLayout";
import {
  Megaphone, Search, Pin, Calendar, Clock, Flag,
  ChevronDown, Pencil, Trash2, FileText,
  CheckCircle2, SlidersHorizontal, Filter, ChevronUp,
  X, User
} from "lucide-react";
import { getAllAnnouncements, deleteAnnouncement, pinAnnouncement, publishAnnouncement } from "../../../apiService/announcementService";

const PRIORITY_META = {
  urgent:    { label: "Urgent",    color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  important: { label: "Important", color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  normal:    { label: "Normal",    color: "#16a34a", bg: "#f0fdf4", border: "#86efac" },
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;

const formatDateShort = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

export default function AllAnnouncementsPage() {
  const navigate = useNavigate();

  const [search, setSearch]         = useState("");
  const [priority, setPriority]     = useState("all");
  const [sort, setSort]             = useState("newest");
  const [sortOpen, setSortOpen]     = useState(false);
  const [priOpen, setPriOpen]       = useState(false);
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const published = useMemo(() => {
    return announcements
      .filter((a) => !a.isDraft)
      .filter((a) => {
        const q = search.toLowerCase();
        return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q);
      })
      .filter((a) => priority === "all" || a.priority === priority)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        const da = new Date(a.createdAt), db = new Date(b.createdAt);
        return sort === "newest" ? db - da : da - db;
      });
  }, [announcements, search, priority, sort]);

  const drafts = useMemo(() => {
    return announcements
      .filter((a) => a.isDraft)
      .filter((a) => {
        const q = search.toLowerCase();
        return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q);
      });
  }, [announcements, search]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllAnnouncements();
      if (res?.data?.data) setAnnouncements(res.data.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete");
    }
  };

  const handlePin = async (id) => {
    try {
      await pinAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to pin");
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to publish");
    }
  };

  const closeAll = () => { setSortOpen(false); setPriOpen(false); };

  return (
    <AdminPageLayout>
      <style>{`
        .ann-no-outline:focus,
        .ann-no-outline:focus-visible { outline: none !important; box-shadow: none !important; }
        .ann-card { transition: transform .17s, box-shadow .17s; }
        .ann-card:hover { transform: translateY(-3px); }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-in { animation: modalIn .22s ease; }
      `}</style>

      <div onClick={closeAll} className="rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">

        {/* ── HEADER ── */}
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            <Megaphone size={14} /> Admin Panel
          </div>
          <h2 className="m-0 text-[20px] font-bold leading-tight text-[#1f2430] md:text-[24px]">
            All Announcements
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#6b7280]">
            Manage published announcements and drafts from one place.
          </p>
        </div>

        {/* ── TOOLBAR ── */}
        <div
          className="mb-8 flex items-center rounded-2xl border border-[#e5e7eb] bg-white shadow-sm"
          style={{ overflow: "visible" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-1 items-center gap-2 px-4 py-3">
            <Search size={15} className="flex-shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ann-no-outline w-full border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="ann-no-outline flex-shrink-0 text-gray-300 transition hover:text-gray-500"
                style={{ border: "none", background: "none", outline: "none" }}
              >✕</button>
            )}
          </div>

          <div className="h-6 w-px flex-shrink-0 bg-[#e5e7eb]" />

          {/* Filter */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => { setPriOpen((o) => !o); setSortOpen(false); }}
              className="ann-no-outline flex items-center gap-1.5 px-4 py-3 text-sm transition hover:text-[#374151]"
              style={{ border: "none", background: "none", outline: "none", boxShadow: "none" }}
            >
              <Filter size={13} className="text-gray-400" />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Filter:</span>
              <span className="text-sm font-medium text-[#374151]">
                {priority === "all" ? "All" : PRIORITY_META[priority].label}
              </span>
              <ChevronDown size={13} className="text-gray-400"
                style={{ transform: priOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }} />
            </button>
            {priOpen && (
              <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[160px] overflow-hidden rounded-2xl border border-[#f3f4f6] bg-white shadow-lg">
                {[
                  ["all", "All Priorities", "#6b7280", "#f9fafb"],
                  ...Object.entries(PRIORITY_META).map(([k, v]) => [k, v.label, v.color, v.bg])
                ].map(([val, label, color, bg]) => (
                  <button key={val}
                    onClick={() => { setPriority(val); setPriOpen(false); }}
                    className="ann-no-outline flex w-full items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-violet-50"
                    style={{ background: priority === val ? bg : "transparent", color: priority === val ? color : "#374151", fontWeight: priority === val ? 600 : 400, border: "none", outline: "none" }}
                  >
                    {val !== "all" && <Flag size={12} style={{ color }} />}
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-6 w-px flex-shrink-0 bg-[#e5e7eb]" />

          {/* Sort */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => { setSortOpen((o) => !o); setPriOpen(false); }}
              className="ann-no-outline flex items-center gap-1.5 px-4 py-3 text-sm transition hover:text-[#374151]"
              style={{ border: "none", background: "none", outline: "none", boxShadow: "none" }}
            >
              <SlidersHorizontal size={13} className="text-gray-400" />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Sort:</span>
              <span className="text-sm font-medium text-[#374151]">
                {sort === "newest" ? "Newest First" : "Oldest First"}
              </span>
              <ChevronDown size={13} className="text-gray-400"
                style={{ transform: sortOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[150px] overflow-hidden rounded-2xl border border-[#f3f4f6] bg-white shadow-lg">
                {[["newest", "Newest First"], ["oldest", "Oldest First"]].map(([val, label]) => (
                  <button key={val}
                    onClick={() => { setSort(val); setSortOpen(false); }}
                    className="ann-no-outline flex w-full items-center px-4 py-2.5 text-sm transition hover:bg-violet-50"
                    style={{ background: sort === val ? "#faf7ff" : "transparent", color: sort === val ? "#7c3aed" : "#374151", fontWeight: sort === val ? 600 : 400, border: "none", outline: "none" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── LOADING / ERROR ── */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          </div>
        )}

        {error && !loading && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ── DRAFTS SECTION ── */}
            {drafts.length > 0 && (
              <div className="mb-8">
                <button
                  onClick={() => setDraftsOpen((o) => !o)}
                  className="ann-no-outline mb-4 flex w-full items-center justify-between rounded-2xl px-4 py-3 transition hover:opacity-90"
                  style={{ background: "#fffbeb", border: "1px solid #fde68a", outline: "none", boxShadow: "none" }}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-amber-500" />
                    <span className="text-sm font-semibold text-amber-700">Drafts</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-600">
                      {drafts.length}
                    </span>
                  </div>
                  {draftsOpen
                    ? <ChevronUp size={15} className="text-amber-400" />
                    : <ChevronDown size={15} className="text-amber-400" />
                  }
                </button>

                {draftsOpen && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {drafts.map((item) => (
                      <AnnouncementCard
                        key={item._id}
                        item={item}
                        isDraft
                        onClick={() => setSelected(item)}
                        onDelete={handleDelete}
                        onPin={handlePin}
                        onPublish={handlePublish}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── PUBLISHED SECTION ── */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-violet-600" />
                <span className="text-sm font-semibold text-violet-700">Published</span>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700">
                  {published.length}
                </span>
              </div>

              {published.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-violet-200 bg-[#faf7ff] py-16 text-center">
                  <Megaphone size={36} className="text-violet-300 mb-3" />
                  <p className="text-sm font-semibold text-gray-500">No announcements found</p>
                  <p className="mt-1 text-xs text-gray-400">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {published.map((item) => (
                    <AnnouncementCard
                      key={item._id}
                      item={item}
                      isDraft={false}
                      onClick={() => setSelected(item)}
                      onDelete={handleDelete}
                      onPin={handlePin}
                      onPublish={handlePublish}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(10,5,25,0.55)",
            backdropFilter: "blur(6px)",
            zIndex: 300,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px", boxSizing: "border-box",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-in"
            style={{
              backgroundColor: "#fff",
              borderRadius: "24px",
              width: "100%", maxWidth: "600px",
              maxHeight: "88vh", overflowY: "auto",
              boxShadow: "0 24px 80px rgba(124,34,232,0.22)",
              position: "relative",
            }}
          >

            {/* Modal image */}
            {selected.image ? (
              <div style={{ position: "relative", height: "240px", borderRadius: "24px 24px 0 0", overflow: "hidden" }}>
                <img src={selected.image} alt={selected.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(10,5,25,0.5) 100%)" }} />
                {selected.isPinned && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 shadow" style={{ color: "#7c22e8" }}>
                    <Pin size={10} style={{ transform: "rotate(45deg)" }} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Pinned</span>
                  </div>
                )}
                {selected.isDraft && (
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">Draft</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ height: "120px", borderRadius: "24px 24px 0 0", background: selected.isDraft ? "#fffbeb" : "#f5f0ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {selected.isDraft
                  ? <FileText size={40} className="text-amber-200" />
                  : <Megaphone size={40} className="text-violet-200" />
                }
              </div>
            )}

            {/* Modal body */}
            <div style={{ padding: "24px 28px 28px" }}>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <PriorityBadge priority={selected.priority} />
                {selected.isDraft && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600">Draft</span>
                )}
                {selected.createdBy && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <User size={11} className="text-violet-400" /> {selected.createdBy}
                  </span>
                )}
              </div>

              <div style={{ height: "1px", background: "#ede9fe", marginBottom: "16px" }} />

              <h2 style={{ margin: "0 0 12px", fontSize: "1.25rem", fontWeight: 700, color: "#7c22e8", lineHeight: 1.35, fontFamily: "'Playfair Display', serif" }}>
                {selected.title}
              </h2>

              <p style={{ margin: "0 0 20px", fontSize: "0.92rem", color: "#4b5563", lineHeight: 1.75 }}>
                {selected.content}
              </p>

              <div className="flex flex-wrap gap-3">
                {formatDate(selected.publishDate) && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-violet-50 px-3 py-1.5">
                    <Calendar size={12} className="text-violet-500" />
                    <span className="text-xs text-gray-600">
                      <span className="font-medium text-violet-700">Published: </span>
                      {formatDate(selected.publishDate)}
                    </span>
                  </div>
                )}
                {formatDate(selected.expiryDate) && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-1.5">
                    <Clock size={12} className="text-red-400" />
                    <span className="text-xs text-gray-600">
                      <span className="font-medium text-red-500">Expires: </span>
                      {formatDate(selected.expiryDate)}
                    </span>
                  </div>
                )}
                {formatDate(selected.createdAt) && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-1.5">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">
                      <span className="font-medium">Created: </span>
                      {formatDate(selected.createdAt)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#f0ecff] pt-5">
                <button
                  onClick={() => setSelected(null)}
                  className="ann-no-outline inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition hover:text-gray-700"
                  style={{ border: "none", background: "none", outline: "none" }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(selected._id)}
                  className="ann-no-outline inline-flex items-center gap-2 rounded-full"
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    transition: "all .15s",
                    outline: "none"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fecaca"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
                >
                  <Trash2 size={14} color="#dc2626" /> Delete
                </button>
                <button
                  onClick={() => navigate(`/edit-announcement/${selected._id}`)}
                  className="ann-no-outline inline-flex items-center gap-2 rounded-full"
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "#ede9fe",
                    color: "#6d28d9",
                    transition: "all .15s",
                    outline: "none"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ddd6fe"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ede9fe"}
                >
                  <Pencil size={14} color="#6d28d9" /> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}

/* ── Card component ── */
function AnnouncementCard({ item, isDraft, onClick, onDelete, onPin, onPublish }) {
  const navigate = useNavigate();

  const handleAction = (e, fn) => {
    e.stopPropagation();
    fn?.();
  };

  return (
    <div
      onClick={onClick}
      className="ann-card relative flex flex-col overflow-hidden rounded-[18px] bg-white"
      style={{
        border: isDraft
          ? "1.5px solid #fde68a"
          : item.isPinned ? "2px solid #7c22e8" : "1.5px solid #ede9fe",
        boxShadow: isDraft
          ? "0 2px 10px rgba(217,119,6,0.08)"
          : item.isPinned ? "0 4px 18px rgba(124,34,232,0.14)" : "0 2px 10px rgba(0,0,0,0.06)",
        cursor: "pointer",
      }}
    >
      {/* Image area */}
      <div
        className="relative flex w-full flex-shrink-0 items-center justify-center overflow-hidden"
        style={{ height: "112px", background: isDraft ? "#fffbeb" : "#f5f0ff" }}
      >
        {item.image
          ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          : isDraft
            ? <FileText size={28} color="#fde68a" />
            : <Megaphone size={28} color="#ddd6fe" />
        }

        {/* Top-left badge */}
        <div className="absolute left-2.5 top-2.5">
          {isDraft ? (
            <span style={{ background: "#f59e0b", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Draft
            </span>
          ) : item.isPinned ? (
            <div style={{ display: "flex", alignItems: "center", gap: "3px", background: "#fff", padding: "2px 8px", borderRadius: "999px", boxShadow: "0 1px 4px rgba(0,0,0,0.12)", color: "#7c22e8" }}>
              <Pin size={8} color="#7c22e8" style={{ transform: "rotate(45deg)" }} />
              <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pinned</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3">
        {/* Date */}
        <p style={{ margin: 0, marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#9ca3af" }}>
          <Calendar size={10} color={isDraft ? "#f59e0b" : "#7c22e8"} />
          {isDraft
            ? (formatDateShort(item.createdAt) ?? "No date")
            : (formatDateShort(item.publishDate) ?? "No date")
          }
        </p>

        {/* Title */}
        <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#7c22e8", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.title}
        </p>

        {/* Content */}
        <p style={{ margin: 0, marginTop: "6px", fontSize: "11px", color: "#6b7280", lineHeight: 1.55, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.content}
        </p>

        {/* Action buttons row */}
        <div
          style={{ marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${isDraft ? "#fef3c7" : "#f0ecff"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}
          onClick={(e) => e.stopPropagation()}
        >
          <PriorityBadge priority={item.priority} small />

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

            {/* Draft → Publish */}
            {isDraft ? (
              <button
              onClick={(e) => handleAction(e, () => onPublish?.(item._id))}
              style={{
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: "#dcfce7",
                color: "#059669",
                transition: "all .15s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#bbf7d0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#dcfce7"}
              >
              PUBLISH
              </button>
            ) : (
              /* hide pin/unpin control for already-pinned announcements */
              !item.isPinned && (
                <button
                onClick={(e) => handleAction(e, () => onPin?.(item._id))}
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "10px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#ede9fe",
                  color: "#6d28d9",
                  transition: "all .15s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ddd6fe"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ede9fe"}
                >
                PIN
                </button>
              )
            )}

            {/* EDIT */}
            <button
                onClick={(e) => handleAction(e, () => navigate(`/edit-announcement/${item._id}`))}
                style={{
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: "#ede9fe",
                color: "#6d28d9",
                transition: "all .15s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ddd6fe"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ede9fe"}
            >
                EDIT
            </button>

            {/* DELETE */}
            <button
                onClick={(e) => handleAction(e, () => onDelete?.(item._id))}
                style={{
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                transition: "all .15s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fecaca"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
            >
                DELETE
            </button>

            </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function PriorityBadge({ priority, small = false }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META.normal;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", borderRadius: "999px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: meta.bg, color: meta.color, border: `1px solid ${meta.border}`, fontSize: small ? "9px" : "10px", padding: small ? "2px 7px" : "3px 10px" }}>
      <Flag size={small ? 8 : 9} color={meta.color} />
      {meta.label}
    </span>
  );
}