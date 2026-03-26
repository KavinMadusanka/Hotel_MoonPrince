import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layouts/Layout.jsx";
import { Star, Pencil, Trash2, X, Search, ChevronDown, SlidersHorizontal, AlertCircle } from "lucide-react";
import reviewService from "../../../apiService/reviewService.jsx";

const PURPLE        = "#7c22e8";
const PURPLE_PALE   = "#f3eaff";
const PURPLE_BORDER = "#e0ccff";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
const RATING_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

function StarDisplay({ rating, size = 18 }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={s <= rating ? "#f59e0b" : "none"}
          color={s <= rating ? "#f59e0b" : "#d1d5db"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function StarPicker({ rating, onSet }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || rating;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSet(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 2, outline: "none",
            transition: "transform 0.1s",
            transform: hovered >= s ? "scale(1.15)" : "scale(1)",
          }}
        >
          <Star
            size={32}
            fill={s <= display ? "#f59e0b" : "none"}
            color={s <= display ? "#f59e0b" : "#d1d5db"}
            strokeWidth={1.5}
          />
        </button>
      ))}
      {display > 0 && (
        <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 700, color: RATING_COLORS[display] }}>
          {RATING_LABELS[display]}
        </span>
      )}
    </div>
  );
}

function RatingBadge({ rating }) {
  if (!rating) return null;
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
      padding: "3px 9px", borderRadius: 999,
      background: RATING_COLORS[rating] + "18",
      color: RATING_COLORS[rating],
      textTransform: "uppercase",
      border: `1px solid ${RATING_COLORS[rating]}30`,
    }}>
      {RATING_LABELS[rating]}
    </span>
  );
}

const SORT_OPTIONS = ["Newest First", "Oldest First"];

export default function MyReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sort, setSort]                 = useState("Newest First");
  const [sortOpen, setSortOpen]         = useState(false);
  const [filterOpen, setFilterOpen]     = useState(false);

  const [editOpen, setEditOpen]         = useState(false);
  const [editReview, setEditReview]     = useState(null);
  const [editRating, setEditRating]     = useState(0);
  const [editComment, setEditComment]   = useState("");
  const [saving, setSaving]             = useState(false);
  const [editError, setEditError]       = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    reviewService.getReviewsByUser()
      .then((res) => {
        if (!mounted) return;
        const data = res?.data?.data || res?.data || [];
        setReviews(Array.isArray(data) ? data : [data]);
      })
      .catch((err) => setError(err?.response?.data?.message || err.message || "Failed to load reviews."))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = [...reviews];
    if (ratingFilter > 0) list = list.filter((r) => r.rating === ratingFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.comment?.toLowerCase().includes(q) ||
          String(r.bookingId  || "").toLowerCase().includes(q) ||
          String(r.roomTypeId || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) =>
      sort === "Newest First"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    return list;
  }, [reviews, search, ratingFilter, sort]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await reviewService.deleteReview(id);
      setReviews((r) => r.filter((x) => x._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Failed to delete.");
    }
  };

  const openEdit = (r) => {
    setEditReview(r);
    setEditRating(r.rating || 0);
    setEditComment(r.comment || "");
    setEditError(null);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editRating)         { setEditError("Please select a rating."); return; }
    if (!editComment.trim()) { setEditError("Please write a comment."); return; }
    setEditError(null);
    setSaving(true);
    try {
      const res     = await reviewService.updateReview(editReview._id, { rating: editRating, comment: editComment });
      const updated = res?.data?.data || res?.data || null;
      setReviews((list) =>
        list.map((it) =>
          it._id === editReview._id
            ? updated || { ...it, rating: editRating, comment: editComment }
            : it
        )
      );
      setEditOpen(false);
    } catch (err) {
      setEditError(err?.response?.data?.message || err.message || "Failed to save.");
    } finally { setSaving(false); }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—";

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes modalIn { from { opacity:0; transform:translateY(16px) scale(.97); } to { opacity:1; transform:none; } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }

        .rev-card { transition: transform 0.2s, box-shadow 0.2s; }
        .rev-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(124,34,232,0.12) !important; }

        .act-btn  { transition: background 0.15s, transform 0.1s; }
        .act-btn:hover  { transform: scale(1.04); }
        .act-btn:active { transform: scale(0.97); }

        .sort-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); border: 1px solid #f3f4f6; overflow: hidden; z-index: 50; min-width: 150px; }
        .sort-opt { padding: 10px 16px; font-size: 0.9rem; cursor: pointer; transition: background 0.15s; }

        .modal-overlay { animation: fadeIn 0.18s ease; }
        .modal-box     { animation: modalIn 0.22s cubic-bezier(.16,1,.3,1); }

        .filter-chip { transition: all 0.15s; }
        .filter-chip:hover { opacity: 0.85; }
      `}</style>

      <div style={{ minHeight: "100vh", backgroundColor: "#f5f3fa", paddingTop: 80, paddingBottom: 60, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

          {/* ── PAGE HEADER — identical structure to Announcements & GiveReview ── */}
          <div style={{ textAlign: "center", marginTop: 40, marginBottom: 32, padding: "0 16px" }}>
            <p style={{ margin: "0 0 6px", fontSize: "0.8rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Your Feedback
            </p>
            <h1 style={{ margin: 0, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: PURPLE, fontFamily: "'Playfair Display', serif" }}>
              My Reviews
            </h1>
            <p style={{ margin: "12px auto 0", fontSize: "1rem", color: "#6b7280", maxWidth: 560, lineHeight: 1.6 }}>
              All reviews you have published — edit or remove as needed.
            </p>
          </div>

          {/* ── SEARCH + SORT BAR — matches Announcements bar exactly ── */}
          <div style={{ backgroundColor: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {/* Search field */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 180 }}>
              <Search size={16} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search by comment, booking ID or room type…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: "none", outline: "none", fontSize: "0.95rem", color: "#374151", background: "transparent", width: "100%", fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <div style={{ width: 1, height: 28, backgroundColor: "#e5e7eb" }} />

            {/* Rating filter toggle button */}
            <button
              onClick={() => setFilterOpen((o) => !o)}
              style={{ display: "flex", alignItems: "center", gap: 6, border: "none", background: filterOpen || ratingFilter > 0 ? PURPLE_PALE : "transparent", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "'Inter', sans-serif", outline: "none" }}
            >
              <SlidersHorizontal size={14} color={filterOpen || ratingFilter > 0 ? PURPLE : "#9ca3af"} />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: filterOpen || ratingFilter > 0 ? PURPLE : "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {ratingFilter > 0 ? `${ratingFilter}★` : "Filter"}
              </span>
            </button>

            <div style={{ width: 1, height: 28, backgroundColor: "#e5e7eb" }} />

            {/* Sort — identical to Announcements */}
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.05em" }}>SORT:</span>
                <div
                  onClick={() => setSortOpen((o) => !o)}
                  style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: "0.9rem", color: "#374151", fontWeight: 500, userSelect: "none" }}
                >
                  {sort}
                  <ChevronDown size={14} color="#6b7280" style={{ transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                </div>
              </div>
              {sortOpen && (
                <div className="sort-dropdown">
                  {SORT_OPTIONS.map((option) => (
                    <div
                      key={option}
                      className="sort-opt"
                      onClick={() => { setSort(option); setSortOpen(false); }}
                      style={{ color: sort === option ? PURPLE : "#374151", fontWeight: sort === option ? 600 : 400, backgroundColor: sort === option ? PURPLE_PALE : "transparent" }}
                      onMouseEnter={(e) => { if (sort !== option) e.currentTarget.style.backgroundColor = PURPLE_PALE; }}
                      onMouseLeave={(e) => { if (sort !== option) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RATING FILTER CHIPS (revealed on toggle) ── */}
          {filterOpen && (
            <div style={{ background: "#fff", borderRadius: 12, padding: "12px 18px", marginBottom: 16, border: `1px solid ${PURPLE_BORDER}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginRight: 2 }}>Rating:</span>
              {[0, 1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  className="filter-chip"
                  onClick={() => setRatingFilter(r === ratingFilter ? 0 : r)}
                  style={{
                    border: "none", borderRadius: 999, padding: r === 0 ? "5px 14px" : "5px 12px",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                    background: ratingFilter === r ? PURPLE : "#f5f3fa",
                    color:      ratingFilter === r ? "#fff"  : "#6b7280",
                    display: "flex", alignItems: "center", gap: 4,
                    boxShadow: ratingFilter === r ? "0 2px 8px rgba(124,34,232,0.25)" : "none",
                  }}
                >
                  {r === 0
                    ? "All"
                    : <>{r}&nbsp;<Star size={11} fill={ratingFilter === r ? "#fff" : "#f59e0b"} color={ratingFilter === r ? "#fff" : "#f59e0b"} /></>
                  }
                </button>
              ))}
            </div>
          )}

          {/* ── RESULT COUNT ── */}
          {!loading && !error && reviews.length > 0 && (
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px", textAlign: "right" }}>
              Showing <strong style={{ color: "#374151" }}>{filtered.length}</strong> of {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          )}

          {/* ── STATES ── */}
          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>Loading reviews…</div>
          ) : error ? (
            <div style={{ padding: 20, display: "flex", gap: 10, alignItems: "center", justifyContent: "center", color: "#b91c1c", background: "#fff7f7", borderRadius: 12, border: "1px solid #fee2e2" }}>
              <AlertCircle size={18} /> {error}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: "#9ca3af", background: "#fff", borderRadius: 16, border: "1px solid #ede9fe", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <AlertCircle size={24} color="#d1d5db" />
              <p style={{ margin: 0 }}>
                {reviews.length === 0 ? "You haven't published any reviews yet." : "No reviews match your search."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map((r) => (
                <div
                  key={r._id}
                  className="rev-card"
                  onClick={() => navigate(`/guest-rooms/${r.roomTypeId}`, { state: { scrollToReviews: true } })}
                  style={{ 
                    background: "#fff", 
                    borderRadius: 16, 
                    padding: "20px 22px", 
                    border: "1px solid #ede9fe", 
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>

                      {/* Stars + rating badge */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <StarDisplay rating={r.rating} size={18} />
                        <RatingBadge rating={r.rating} />
                      </div>

                      {/* Comment body */}
                      <p style={{ margin: "10px 0 0", fontSize: "0.9rem", color: "#374151", lineHeight: 1.7, fontWeight: 400 }}>
                        {r.comment}
                      </p>

                      {/* Meta — muted, no bold, matches GiveReview's summary label pattern */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", marginTop: 12 }}>
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>
                          Room Type:&nbsp;<span style={{ color: "#6b7280" }}>{r.roomTypeId || "—"}</span>
                        </span>
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>
                          Booking:&nbsp;<span style={{ color: "#6b7280" }}>{r.bookingId || "—"}</span>
                        </span>
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>
                          {formatDate(r.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons — style from GiveReview's edit/delete pair */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                      <button
                        className="act-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(r);
                        }}
                        style={{ display: "flex", alignItems: "center", gap: 6, background: PURPLE_PALE, color: PURPLE, border: `1.5px solid ${PURPLE_BORDER}`, padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif", outline: "none" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#ddd6fe"}
                        onMouseLeave={(e) => e.currentTarget.style.background = PURPLE_PALE}
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        className="act-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(r._id);
                        }}
                        style={{ display: "flex", alignItems: "center", gap: 6, background: "#fef2f2", color: "#dc2626", border: "1.5px solid #fecaca", padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif", outline: "none" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#fef2f2"}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── EDIT MODAL — mirrors GiveReview modal structure exactly ── */}
      {editOpen && (
        <div
          className="modal-overlay"
          onClick={() => setEditOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(10,5,25,0.5)", backdropFilter: "blur(5px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 520, padding: 28, boxShadow: "0 20px 60px rgba(124,34,232,0.2)", position: "relative" }}
          >
            {/* Close button */}
            <button
              onClick={() => setEditOpen(false)}
              style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", outline: "none", transition: "background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
            >
              <X size={15} color="#6b7280" />
            </button>

            <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: 700, color: "#1f2430", fontFamily: "'Playfair Display', serif" }}>
              Edit Your Review
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: "0.85rem", color: "#9ca3af" }}>
              Update your rating or comment below.
            </p>

            <div style={{ height: 1, background: PURPLE_BORDER, marginBottom: 20 }} />

            {/* Star rating picker */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 10, fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
                Rating <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <StarPicker rating={editRating} onSet={setEditRating} />
            </div>

            {/* Comment textarea — matches GiveReview's bordered textarea */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
                Comment <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ borderRadius: 14, border: `1.5px solid ${editComment.length > 0 ? PURPLE : "#e5e7eb"}`, padding: "10px 14px", transition: "border-color 0.2s" }}>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Share your experience…"
                  style={{ width: "100%", border: "none", background: "transparent", resize: "none", fontSize: "0.88rem", color: "#1f2430", outline: "none", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}
                />
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9ca3af", textAlign: "right" }}>
                {editComment.length} / 1000
              </p>
            </div>

            {/* Inline error — matches GiveReview alert style */}
            {editError && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 12, padding: "10px 14px", marginBottom: 16, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.85rem", fontWeight: 500 }}>
                <AlertCircle size={14} /> {editError}
              </div>
            )}

            {/* Footer actions — pill buttons matching GiveReview */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setEditOpen(false)}
                style={{ background: "none", border: "none", borderRadius: 999, padding: "9px 18px", fontSize: "0.88rem", fontWeight: 500, color: "#6b7280", cursor: "pointer", fontFamily: "'Inter', sans-serif", outline: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#374151"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                style={{ background: saving ? "#c4b5e8" : PURPLE, color: "#fff", border: "none", borderRadius: 999, padding: "9px 24px", fontSize: "0.88rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", outline: "none", display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.2s" }}
                onMouseEnter={(e) => { if (!saving) e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                <Pencil size={13} color="#fff" />
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}