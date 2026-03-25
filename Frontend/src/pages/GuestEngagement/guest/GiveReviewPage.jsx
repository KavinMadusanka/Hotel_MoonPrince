import { useState, useEffect } from "react";
import Layout from "../../../layouts/Layout.jsx";
import { Star, Send, CheckCircle2, AlertCircle, BedDouble, Calendar, User, Hash, Pencil, Trash2, X } from "lucide-react";
import reviewService from "../../../apiService/reviewService.jsx";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getReservationById } from "../../../apiService/reservationService.jsx";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export default function GiveReviewPage() {
  const params   = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking]               = useState(location.state?.reservation || null);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [loadingReview, setLoadingReview]   = useState(false);

  const [rating, setRating]         = useState(0);
  const [hovered, setHovered]       = useState(0);
  const [comment, setComment]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]       = useState(null);
  const [submitted, setSubmitted]   = useState(false);

  const [editOpen, setEditOpen]             = useState(false);
  const [editRating, setEditRating]         = useState(0);
  const [editHovered, setEditHovered]       = useState(0);
  const [editComment, setEditComment]       = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editMessage, setEditMessage]       = useState(null);
  const [deleting, setDeleting]             = useState(false);

  const starLabel = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  // ── Fetch booking if not passed via state ──
  useEffect(() => {
    if (!booking && params?.bookingid) {
      setLoadingBooking(true);
      getReservationById(params.bookingid)
        .then((res) => setBooking(res?.data?.data || res?.data || null))
        .catch(() => {})
        .finally(() => setLoadingBooking(false));
    }
  }, [params, booking]);

  // ── Normalise booking fields ──
  const b = booking ? {
    reservationId:   booking.reservationCode || booking.reservationId || booking._id,
    status:          booking.status,
    guestName:       booking.guestName  || booking.guest || booking.name,
    guestEmail:      booking.guestEmail || booking.email,
    checkIn:         booking.checkInDate  || booking.checkIn,
    checkOut:        booking.checkOutDate || booking.checkOut,
    guests:          booking.guestsCount  || booking.guests || booking.guestCount,
    nights:          booking.nights,
    roomTypeId:      booking.roomTypeId,
    roomId:          booking.roomId,
    bookingId:       booking._id || booking.bookingId,
    baseAmount:      booking.baseAmount,
    paymentStatus:   booking.paymentStatus,
    bookingSource:   booking.bookingSource,
    specialRequests: booking.specialRequests,
  } : null;

  // ── Check for existing review ──
  useEffect(() => {
    if (!b?.bookingId) return;
    setLoadingReview(true);
    reviewService.getReviewsByUser()
      .then((res) => {
        const data = res?.data?.data || res?.data || null;
        if (!data) return;
        const list = Array.isArray(data) ? data : [data];
        const match = list.find(
          (r) =>
            r.bookingId === b.bookingId ||
            r.bookingId?._id === b.bookingId ||
            r.bookingId?.toString() === b.bookingId?.toString()
        );
        if (match) setExistingReview(match);
      })
      .catch((err) => console.error("Review fetch error:", err))
      .finally(() => setLoadingReview(false));
  }, [b?.bookingId]);

  // ── Submit new review ──
  const handleSubmit = () => {
    if (rating === 0) { setMessage({ type: "error", text: "Please select a star rating before submitting." }); return; }
    if (!comment.trim()) { setMessage({ type: "error", text: "Please write a comment before submitting." }); return; }
    setMessage(null);
    setSubmitting(true);
    reviewService.createReview({ roomTypeId: b?.roomTypeId, bookingId: b?.bookingId, rating, comment })
      .then(() => { setSubmitting(false); setSubmitted(true); })
      .catch((err) => {
        setSubmitting(false);
        setMessage({ type: "error", text: err?.response?.data?.message || err.message || "Failed to submit review." });
      });
  };

  // ── Open edit modal ──
  const openEdit = () => {
    setEditRating(existingReview.rating);
    setEditComment(existingReview.comment);
    setEditMessage(null);
    setEditOpen(true);
  };

  // ── Submit edit ──
  const handleEdit = () => {
    if (editRating === 0) { setEditMessage({ type: "error", text: "Please select a star rating." }); return; }
    if (!editComment.trim()) { setEditMessage({ type: "error", text: "Please write a comment." }); return; }
    setEditMessage(null);
    setEditSubmitting(true);
    reviewService.updateReview(existingReview._id, { rating: editRating, comment: editComment })
      .then((res) => {
        const updated = res?.data?.data || res?.data;
        setExistingReview(updated || { ...existingReview, rating: editRating, comment: editComment });
        setEditSubmitting(false);
        setEditOpen(false);
      })
      .catch((err) => {
        setEditSubmitting(false);
        setEditMessage({ type: "error", text: err?.response?.data?.message || err.message || "Failed to update review." });
      });
  };

  // ── Delete review ──
  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    setDeleting(true);
    reviewService.deleteReview(existingReview._id)
      .then(() => { setExistingReview(null); setDeleting(false); })
      .catch((err) => { setDeleting(false); alert(err?.response?.data?.message || "Failed to delete review."); });
  };

  // ── Loading ──
  if (loadingBooking) {
    return (
      <Layout>
        <div style={{ minHeight: "100vh", background: "#f5f3fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "4px solid #ede9fe", borderTopColor: "#7c22e8", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </Layout>
    );
  }

  // ── Success state ──
  if (submitted) {
    return (
      <Layout>
        <div style={{ minHeight: "100vh", background: "#f5f3fa", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 40px", maxWidth: "440px", width: "100%", textAlign: "center", boxShadow: "0 8px 40px rgba(124,34,232,0.12)" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle2 size={36} color="#16a34a" />
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: "1.4rem", fontWeight: 700, color: "#1f2430", fontFamily: "'Playfair Display', serif" }}>
              Thank you for your review!
            </h2>
            <p style={{ margin: "0 0 24px", fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.6 }}>
              Your feedback helps us improve the experience for all our guests.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "8px" }}>
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={24} fill={s <= rating ? "#f59e0b" : "none"} color={s <= rating ? "#f59e0b" : "#d1d5db"} />
              ))}
            </div>
            <p style={{ margin: "0 0 28px", fontSize: "0.85rem", color: "#7c22e8", fontWeight: 600 }}>{starLabel[rating]}</p>
            <button
              onClick={() => navigate("/my-reservations")}
              style={{ display: "inline-block", background: "#7c22e8", color: "#fff", borderRadius: "999px", padding: "10px 28px", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: "pointer" }}
            >
              Back to My Reservations
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity:0; transform:translateY(16px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .review-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 900px) { .review-grid { grid-template-columns: 1fr 1fr; align-items: start; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f5f3fa", paddingTop: "120px", paddingBottom: "40px", paddingLeft: "24px", paddingRight: "24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* ── PAGE TITLE (styled like Announcements) ── */}
          <div style={{ textAlign: "center", marginTop: "80px", marginBottom: "24px", padding: "0 16px" }}>
            <p style={{ margin: "0 0 6px", fontSize: "0.8rem", fontWeight: 700, color: "black", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Share Your Experience
            </p>
            <h1 style={{ margin: 0, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "#7c22e8", fontFamily: "'Playfair Display', serif" }}>
              {existingReview ? "Your Review" : "Leave a Review"}
            </h1>
            <p style={{ margin: "12px auto 0", fontSize: "1rem", color: "#6b7280", maxWidth: "560px", lineHeight: 1.6 }}>
              {existingReview ? "You have already submitted a review for this booking." : "Your honest feedback helps us serve you better."}
            </p>
          </div>

          <div className="review-grid">

            {/* ── LEFT: BOOKING SUMMARY ── */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #ede9fe" }}>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#7c22e8", letterSpacing: "0.05em", fontFamily: "monospace" }}>
                  {b?.reservationId}
                </span>
                <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", textTransform: "capitalize", border: "1px solid #bbf7d0" }}>
                  ✓ {b?.status}
                </span>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#1f2430" }}>{b?.guestName}</p>
                <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#9ca3af" }}>{b?.guestEmail}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                {[
                  { label: "Check-in",  value: formatDate(b?.checkIn),  icon: <Calendar size={13} color="#7c22e8" /> },
                  { label: "Check-out", value: formatDate(b?.checkOut), icon: <Calendar size={13} color="#7c22e8" /> },
                  { label: "Guests",    value: b?.guests,               icon: <User size={13} color="#7c22e8" /> },
                  { label: "Nights",    value: b?.nights,               icon: <BedDouble size={13} color="#7c22e8" /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ background: "#faf7ff", borderRadius: "12px", padding: "10px 14px" }}>
                    <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem", fontWeight: 600, color: "#1f2430", display: "flex", alignItems: "center", gap: "5px" }}>
                      {icon} {value}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ height: "1px", background: "#f0ecff", margin: "14px 0" }} />

              <div style={{ background: "#faf7ff", borderRadius: "12px", padding: "12px 14px" }}>
                <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 700, color: "#7c22e8", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Hash size={11} color="#7c22e8" /> Reservation Summary
                </p>
                {[
                  ["Base Amount",      b?.baseAmount ? `LKR ${b.baseAmount.toLocaleString()}` : "—"],
                  ["Payment Status",   b?.paymentStatus  || "—"],
                  ["Booking Source",   b?.bookingSource   || "—"],
                  ["Special Requests", b?.specialRequests || "—"],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "5px" }}>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>{label}</span>
                    <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500, textAlign: "right", maxWidth: "55%" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: EXISTING REVIEW or FORM ── */}
            {loadingReview ? (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ede9fe", minHeight: "200px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: "3px solid #ede9fe", borderTopColor: "#7c22e8", animation: "spin 0.8s linear infinite" }} />
              </div>

            ) : existingReview ? (
              /* ── EXISTING REVIEW DISPLAY ── */
              <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "2px solid #ede9fe" }}>

                {/* Header */}
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "0.9rem", fontWeight: 700, color: "#1f2430" }}>Your Review</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>
                    Submitted {formatDate(existingReview.createdAt)}
                  </p>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "#f0ecff", marginBottom: "20px" }} />

                {/* Stars */}
                <div style={{ marginBottom: "6px" }}>
                  <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>Rating</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={26}
                        fill={s <= existingReview.rating ? "#f59e0b" : "none"}
                        color={s <= existingReview.rating ? "#f59e0b" : "#d1d5db"}
                      />
                    ))}
                    <span style={{ marginLeft: "8px", fontSize: "0.88rem", fontWeight: 700, color: "#7c22e8" }}>
                      {starLabel[existingReview.rating]}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div style={{ marginTop: "20px", marginBottom: "28px" }}>
                  <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>Comment</p>
                  <div style={{ background: "#faf7ff", borderRadius: "14px", padding: "16px 18px" }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151", lineHeight: 1.75 }}>
                      {existingReview.comment}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "#f0ecff", marginBottom: "20px" }} />

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={openEdit}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", background: "#f3f0ff", color: "#7c22e8", border: "2px solid #ddd6fe", borderRadius: "12px", padding: "11px 0", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", outline: "none", transition: "background .15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#ddd6fe"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f0ff"; }}
                  >
                    <Pencil size={15} color="#7c22e8" /> Edit Review
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", background: "#fef2f2", color: "#dc2626", border: "2px solid #fecaca", borderRadius: "12px", padding: "11px 0", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", outline: "none", transition: "background .15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#fecaca"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                  >
                    <Trash2 size={15} color="#dc2626" /> {deleting ? "Deleting..." : "Delete Review"}
                  </button>
                </div>
              </div>

            ) : (
              /* ── NEW REVIEW FORM ── */
              <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #ede9fe" }}>

                {/* Star rating */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", marginBottom: "12px", fontSize: "0.88rem", fontWeight: 600, color: "#374151" }}>
                    Your Rating <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHovered(s)}
                        onMouseLeave={() => setHovered(0)}
                        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
                        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", outline: "none", transition: "transform .1s" }}
                      >
                        <Star size={36}
                          fill={(hovered || rating) >= s ? "#f59e0b" : "none"}
                          color={(hovered || rating) >= s ? "#f59e0b" : "#d1d5db"}
                        />
                      </button>
                    ))}
                    {(hovered || rating) > 0 && (
                      <span style={{ marginLeft: "8px", fontSize: "0.88rem", fontWeight: 600, color: "#7c22e8" }}>
                        {starLabel[hovered || rating]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "0.88rem", fontWeight: 600, color: "#374151" }}>
                    Your Comment <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ borderRadius: "16px", border: `1.5px solid ${comment.length > 0 ? "#7c22e8" : "#e5e7eb"}`, background: "#fff", padding: "12px 16px", transition: "border-color .2s" }}>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about your stay — what did you enjoy? What could we improve?"
                      rows={6} maxLength={1000}
                      style={{ width: "100%", border: "none", background: "transparent", resize: "none", fontSize: "0.9rem", color: "#1f2430", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }}
                    />
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#9ca3af", textAlign: "right" }}>{comment.length} / 1000</p>
                </div>

                {message && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", borderRadius: "14px", padding: "12px 16px", marginBottom: "20px", background: message.type === "error" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${message.type === "error" ? "#fecaca" : "#bbf7d0"}`, color: message.type === "error" ? "#dc2626" : "#16a34a", fontSize: "0.875rem", fontWeight: 500 }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
                    {message.text}
                  </div>
                )}

                <button type="button" disabled={submitting} onClick={handleSubmit}
                  onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.opacity = "0.88"; }}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  style={{ width: "100%", background: "#7c22e8", color: "#fff", border: "none", borderRadius: "999px", padding: "13px 0", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", outline: "none", transition: "opacity .2s" }}
                >
                  <Send size={16} color="#fff" />
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      {editOpen && (
        <div onClick={() => setEditOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(10,5,25,0.5)", backdropFilter: "blur(5px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
        >
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "520px", padding: "28px", boxShadow: "0 20px 60px rgba(124,34,232,0.2)", position: "relative", animation: "modalIn .2s ease" }}
          >
            <button onClick={() => setEditOpen(false)}
              style={{ position: "absolute", top: "16px", right: "16px", width: "32px", height: "32px", borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", outline: "none" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
            >
              <X size={15} color="#6b7280" />
            </button>

            <h3 style={{ margin: "0 0 6px", fontSize: "1.1rem", fontWeight: 700, color: "#1f2430" }}>Edit Your Review</h3>
            <p style={{ margin: "0 0 20px", fontSize: "0.85rem", color: "#9ca3af" }}>Update your rating or comment below.</p>

            <div style={{ height: "1px", background: "#f0ecff", marginBottom: "20px" }} />

            {/* Edit stars */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
                Rating <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {[1,2,3,4,5].map((s) => (
                  <button key={s} type="button"
                    onClick={() => setEditRating(s)}
                    onMouseEnter={() => setEditHovered(s)}
                    onMouseLeave={() => setEditHovered(0)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", outline: "none" }}
                  >
                    <Star size={30}
                      fill={(editHovered || editRating) >= s ? "#f59e0b" : "none"}
                      color={(editHovered || editRating) >= s ? "#f59e0b" : "#d1d5db"}
                    />
                  </button>
                ))}
                {(editHovered || editRating) > 0 && (
                  <span style={{ marginLeft: "6px", fontSize: "0.85rem", fontWeight: 600, color: "#7c22e8" }}>
                    {starLabel[editHovered || editRating]}
                  </span>
                )}
              </div>
            </div>

            {/* Edit comment */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
                Comment <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ borderRadius: "14px", border: `1.5px solid ${editComment.length > 0 ? "#7c22e8" : "#e5e7eb"}`, padding: "10px 14px", transition: "border-color .2s" }}>
                <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)}
                  rows={4} maxLength={1000}
                  style={{ width: "100%", border: "none", background: "transparent", resize: "none", fontSize: "0.88rem", color: "#1f2430", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }}
                />
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#9ca3af", textAlign: "right" }}>{editComment.length} / 1000</p>
            </div>

            {editMessage && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "12px", padding: "10px 14px", marginBottom: "16px", background: editMessage.type === "error" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${editMessage.type === "error" ? "#fecaca" : "#bbf7d0"}`, color: editMessage.type === "error" ? "#dc2626" : "#16a34a", fontSize: "0.85rem", fontWeight: 500 }}>
                <AlertCircle size={14} />{editMessage.text}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setEditOpen(false)}
                style={{ background: "none", border: "none", borderRadius: "999px", padding: "9px 18px", fontSize: "0.88rem", fontWeight: 500, color: "#6b7280", cursor: "pointer", outline: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#374151"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
              >
                Cancel
              </button>
              <button onClick={handleEdit} disabled={editSubmitting}
                onMouseEnter={(e) => { if (!editSubmitting) e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                style={{ background: "#7c22e8", color: "#fff", border: "none", borderRadius: "999px", padding: "9px 24px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", outline: "none", display: "flex", alignItems: "center", gap: "6px", transition: "opacity .2s" }}
              >
                <Pencil size={13} color="#fff" />
                {editSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}