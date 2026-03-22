import { useState, useEffect } from "react";
import Layout from "../../../layouts/Layout.jsx";
import { Star, Send, CheckCircle2, AlertCircle, BedDouble, Calendar, User, Hash } from "lucide-react";
import reviewService from "../../../apiService/reviewService.jsx";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getReservationById } from "../../../apiService/reservationService.jsx";

const BOOKING = {
  reservationId: "RES-1774112828154-893995",
  status: "checked in",
  guestName: "JJJ",
  guestEmail: "kavinmadusanka23011@gmail.com",
  checkIn: "2026-03-21",
  checkOut: "2026-03-27",
  guests: 2,
  nights: 6,
  roomTypeId: "69ba7663614a44ae9367777",
  holdId: "LOCAL-HOLD-1774112828154-59777",
  baseAmount: 50000,
  paymentStatus: "not applicable",
  bookingSource: "guest",
  specialRequests: "Need early check-in if possible",
  roomId: "69ba7663614a44ae93625da2",
  bookingId: "69ba7663614a44ae93625da2",
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export default function GiveReviewPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.reservation || null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  useEffect(() => {
    if (!booking && params?.bookingid) {
      setLoadingBooking(true);
      getReservationById(params.bookingid)
        .then((res) => {
          const data = res?.data?.data || res?.data || null;
          setBooking(data);
        })
        .catch(() => {})
        .finally(() => setLoadingBooking(false));
    }
  }, [params, booking]);

  const b = booking
    ? {
        reservationId: booking.reservationCode || booking.reservationId || booking._id,
        status: booking.status,
        guestName: booking.guestName || booking.guest || booking.name,
        guestEmail: booking.guestEmail || booking.guestEmail || booking.email,
        checkIn: booking.checkInDate || booking.checkIn,
        checkOut: booking.checkOutDate || booking.checkOut,
        guests: booking.guestsCount || booking.guests || booking.guestCount,
        nights: booking.nights,
        roomTypeId: booking.roomTypeId,
        roomId: booking.roomId,
        bookingId: booking._id || booking.bookingId,
        baseAmount: booking.baseAmount,
        paymentStatus: booking.paymentStatus,
        bookingSource: booking.bookingSource,
        specialRequests: booking.specialRequests,
      }
    : BOOKING;
  const [rating, setRating]         = useState(0);
  const [hovered, setHovered]       = useState(0);
  const [comment, setComment]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]       = useState(null);
  const [submitted, setSubmitted]   = useState(false);

  const starLabel = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleSubmit = () => {
    if (rating === 0) {
      setMessage({ type: "error", text: "Please select a star rating before submitting." });
      return;
    }
    if (!comment.trim()) {
      setMessage({ type: "error", text: "Please write a comment before submitting." });
      return;
    }
    setMessage(null);
    setSubmitting(true);

    const payload = {
      roomId: (b.roomId || b.roomTypeId) || undefined,
      bookingId: b.bookingId,
      rating,
      comment,
    };

    reviewService
      .createReview(payload)
      .then((res) => {
        setSubmitting(false);
        setSubmitted(true);
      })
      .catch((err) => {
        setSubmitting(false);
        const text = err?.response?.data?.message || err.message || "Failed to submit review";
        setMessage({ type: "error", text });
      });
  };

  // ── SUCCESS STATE ──
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
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={24} fill={s <= rating ? "#f59e0b" : "none"} color={s <= rating ? "#f59e0b" : "#d1d5db"} />
              ))}
            </div>
            <p style={{ margin: "0 0 28px", fontSize: "0.85rem", color: "#7c22e8", fontWeight: 600 }}>
              {starLabel[rating]}
            </p>
            <a href="/" style={{ display: "inline-block", background: "#7c22e8", color: "#fff", borderRadius: "999px", padding: "10px 28px", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
              Back to Home
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  // ── MAIN PAGE ──
  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#f5f3fa", paddingTop: "100px", paddingBottom: "60px", paddingLeft: "16px", paddingRight: "16px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>

          {/* ── PAGE TITLE ── */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ margin: "0 0 6px", fontSize: "0.8rem", fontWeight: 700, color: "#7c22e8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Share Your Experience
            </p>
            <h1 style={{ margin: 0, fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 700, color: "#1f2430", fontFamily: "'Playfair Display', serif" }}>
              Leave a Review
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: "0.9rem", color: "#6b7280" }}>
              Your honest feedback helps us serve you better.
            </p>
          </div>

          {/* ── BOOKING SUMMARY CARD ── */}
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px 24px", marginBottom: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #ede9fe" }}>

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#7c22e8", letterSpacing: "0.05em", fontFamily: "monospace" }}>
                {b.reservationId}
              </span>
              <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", textTransform: "capitalize", border: "1px solid #bbf7d0" }}>
                ✓ {b.status}
              </span>
            </div>

            {/* Guest */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#1f2430" }}>{b.guestName}</p>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#9ca3af" }}>{b.guestEmail}</p>
            </div>

            {/* Date grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              {[
                { label: "Check-in",  value: formatDate(b.checkIn),  icon: <Calendar size={13} color="#7c22e8" /> },
                { label: "Check-out", value: formatDate(b.checkOut), icon: <Calendar size={13} color="#7c22e8" /> },
                { label: "Guests",    value: b.guests,               icon: <User size={13} color="#7c22e8" /> },
                { label: "Nights",    value: b.nights,               icon: <BedDouble size={13} color="#7c22e8" /> },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ background: "#faf7ff", borderRadius: "12px", padding: "10px 14px" }}>
                  <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {label}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "0.88rem", fontWeight: 600, color: "#1f2430", display: "flex", alignItems: "center", gap: "5px" }}>
                    {icon} {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "#f0ecff", margin: "14px 0" }} />

            {/* Reservation summary */}
            <div style={{ background: "#faf7ff", borderRadius: "12px", padding: "12px 14px" }}>
              <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 700, color: "#7c22e8", display: "flex", alignItems: "center", gap: "5px" }}>
                <Hash size={11} color="#7c22e8" /> Reservation Summary
              </p>
                {[
                ["Base Amount",      b.baseAmount ? `LKR ${b.baseAmount.toLocaleString()}` : "—"],
                ["Payment Status",   b.paymentStatus || "—"],
                ["Booking Source",   b.bookingSource || "—"],
                ["Special Requests", b.specialRequests || "—"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>{label}</span>
                  <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── REVIEW FORM CARD ── */}
          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #ede9fe" }}>

            {/* Star rating */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "12px", fontSize: "0.88rem", fontWeight: 600, color: "#374151" }}>
                Your Rating <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(0)}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", outline: "none", transition: "transform .1s" }}
                  >
                    <Star
                      size={36}
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
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your stay — what did you enjoy? What could we improve?"
                  rows={5}
                  maxLength={1000}
                  style={{ width: "100%", border: "none", background: "transparent", resize: "none", fontSize: "0.9rem", color: "#1f2430", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }}
                />
              </div>
              <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#9ca3af", textAlign: "right" }}>
                {comment.length} / 1000
              </p>
            </div>

            {/* Message */}
            {message && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", borderRadius: "14px", padding: "12px 16px", marginBottom: "20px", background: message.type === "error" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${message.type === "error" ? "#fecaca" : "#bbf7d0"}`, color: message.type === "error" ? "#dc2626" : "#16a34a", fontSize: "0.875rem", fontWeight: 500 }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
                {message.text}
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              style={{ width: "100%", background: "#7c22e8", color: "#fff", border: "none", borderRadius: "999px", padding: "13px 0", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", outline: "none", transition: "opacity .2s" }}
            >
              <Send size={16} color="#fff" />
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}