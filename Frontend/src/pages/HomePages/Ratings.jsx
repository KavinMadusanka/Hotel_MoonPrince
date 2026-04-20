import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { getAllReviews } from '../../apiService/reviewService'
import { getUserNameDpById } from '../../apiService/userService'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL
const API_VERSION = import.meta.env.VITE_API_VERSION

const PURPLE = "#7c22e8"
const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"]
const RATING_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"]

function StarDisplay({ rating, size = 14 }) {
  const r = Math.max(0, Math.min(5, Math.round(rating || 0)))
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size}
          fill={s <= r ? "#f59e0b" : "none"}
          color={s <= r ? "#f59e0b" : "#d1d5db"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function RatingBadge({ rating }) {
  if (!rating) return null
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
      padding: "2px 8px", borderRadius: 999,
      background: RATING_COLORS[rating] + "18",
      color: RATING_COLORS[rating],
      textTransform: "uppercase",
      border: `1px solid ${RATING_COLORS[rating]}30`,
    }}>
      {RATING_LABELS[rating]}
    </span>
  )
}

const VISIBLE = 4
const INTERVAL_MS = 5000

const Ratings = () => {
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [userMap, setUserMap]   = useState({})
  const [current, setCurrent]   = useState(0)
  const [paused, setPaused]     = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragStartX = useRef(null)
  const dragStartIdx = useRef(null)
  const timerRef = useRef(null)
  
  // Create infinite carousel by duplicating reviews
  const infiniteReviews = useMemo(() => {
    if (reviews.length === 0) return []
    return [...reviews, ...reviews, ...reviews]
  }, [reviews])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const res = await getAllReviews()
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.reviews) ? res.data.reviews
          : Array.isArray(res.data?.data) ? res.data.data : []
        setReviews(data)

        const userIds = Array.from(new Set(data.map((r) => String(r.userId)).filter(Boolean)))
        await Promise.all(userIds.map(async (userId) => {
          try {
            const userRes  = await getUserNameDpById(userId)
            const userData = userRes.data?.user || userRes.data || null
            if (userData) {
              const photo = userData.photo
                ? `${USER_SERVICE_URL}${API_VERSION}/userService/user_photos/${userData.photo}`
                : null
              setUserMap((prev) => ({ ...prev, [userId]: { name: userData.name || "Unknown", photo } }))
            }
          } catch {}
        }))
      } catch (err) {
        setError("Unable to load reviews")
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const maxIndex = Math.max(0, reviews.length - VISIBLE)

  const next = useCallback(() => {
    setCurrent((c) => {
      const newIndex = c + 1
      // Reset to middle section when reaching end for infinite loop effect
      if (newIndex >= reviews.length * 2) {
        return reviews.length
      }
      return newIndex
    })
  }, [reviews.length])
  
  const prev = useCallback(() => {
    setCurrent((c) => {
      const newIndex = c - 1
      // Reset to middle section when reaching start for infinite loop effect
      if (newIndex < reviews.length) {
        return reviews.length * 2 - 1
      }
      return newIndex
    })
  }, [reviews.length])

  // Auto-advance
  useEffect(() => {
    if (paused || reviews.length === 0 || reviews.length <= VISIBLE) return
    timerRef.current = setInterval(next, INTERVAL_MS)
    return () => clearInterval(timerRef.current)
  }, [paused, next, reviews.length])

  // Drag / swipe handlers
  const onDragStart = (clientX) => {
    dragStartX.current   = clientX
    dragStartIdx.current = current
    setDragging(true)
    setPaused(true)
  }
  const onDragEnd = (clientX) => {
    if (dragStartX.current === null) return
    const diff = dragStartX.current - clientX
    if (diff > 50)       next()
    else if (diff < -50) prev()
    dragStartX.current = null
    setDragging(false)
    setPaused(false)
  }

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""

  return (
    <div className="bg-white flex flex-col items-center gap-10 py-20 px-5 overflow-hidden">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .rat-card { transition: transform 0.2s, box-shadow 0.2s; user-select: none; }
        .rat-card:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(124,34,232,0.13) !important; }
        .rat-track { transition: transform 0.45s cubic-bezier(.4,0,.2,1); }
        .rat-dot { transition: background 0.2s, transform 0.2s; }
        .rat-nav { transition: background 0.15s, opacity 0.2s; }
        .rat-nav:hover { background: #ede9fe !important; }
      `}</style>

      {/* ── TITLE ── */}
      <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 tracking-widest text-center relative inline-block pb-2 after:block after:h-1 after:w-1/3 after:mx-auto after:bg-[#D4AF37] after:mt-2 after:rounded-full">
        Guest Experiences
      </span>

      {/* ── LOADING ── */}
      {loading && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#ede9fe] bg-[#faf7ff] px-6 py-5 w-full max-w-5xl">
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: "3px solid #ede9fe", borderTopColor: PURPLE, animation: "spin .8s linear infinite", flexShrink: 0 }} />
          <span className="text-sm text-gray-500">Loading reviews...</span>
        </div>
      )}

      {/* ── ERROR ── */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 w-full max-w-5xl text-center">
          {error}
        </div>
      )}

      {/* ── EMPTY ── */}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-6">
          No reviews yet. Be the first to share your experience!
        </p>
      )}

      {/* ── CAROUSEL ── */}
      {!loading && !error && reviews.length > 0 && (
        <div className="w-full max-w-6xl px-2">

          {/* Track wrapper */}
          <div style={{ position: "relative" }}>

            {/* Prev button */}
            <button
              onClick={prev}
              className="rat-nav"
              style={{
                position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)",
                zIndex: 10, width: 40, height: 40, borderRadius: "50%",
                background: "#fff", border: "1.5px solid #ede9fe",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", outline: "none",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#ede9fe"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
            >
              <ChevronLeft size={18} color={PURPLE} />
            </button>

            {/* Overflow mask */}
            <div style={{ overflow: "hidden", borderRadius: 8 }}>
              {/* Sliding track */}
              <div
                className="rat-track"
                style={{
                  display: "flex",
                  gap: 16,
                  transform: `translateX(calc(-${current} * (100% / ${VISIBLE}) - ${current} * 16px / ${VISIBLE}))`,
                  cursor: dragging ? "grabbing" : "grab",
                  willChange: "transform",
                }}
                onMouseDown={(e) => onDragStart(e.clientX)}
                onMouseMove={(e) => { if (dragging && Math.abs(e.clientX - dragStartX.current) > 5) e.preventDefault() }}
                onMouseUp={(e) => onDragEnd(e.clientX)}
                onMouseLeave={(e) => { if (dragging) onDragEnd(e.clientX) }}
                onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
                onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
                onMouseEnter={() => setPaused(true)}
              >
                {infiniteReviews.map((review, idx) => {
                  const user = userMap[String(review.userId)]
                  return (
                    <div
                      key={`${review._id}-${idx}`}
                      className="rat-card"
                      style={{
                        flex: `0 0 calc((100% - ${(VISIBLE - 1) * 16}px) / ${VISIBLE})`,
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #ede9fe",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        overflow: "hidden",
                        minWidth: 0,
                      }}
                    >
                      <div style={{ padding: "20px 20px 18px" }}>

                        {/* Guest info row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          {/* Avatar */}
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                            {user?.photo ? (
                              <img src={user.photo} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none" }} />
                            ) : (
                              <span style={{ fontSize: 13, fontWeight: 700, color: PURPLE }}>
                                {String(user?.name || review.userId || "G")[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1f2430", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {user?.name || (review.userId ? `User ${String(review.userId).slice(-6)}` : "Guest")}
                            </p>
                            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Stars + Badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                          <StarDisplay rating={review.rating} size={14} />
                          <RatingBadge rating={review.rating} />
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: "#f0ecff", marginBottom: 12 }} />

                        {/* Comment */}
                        <p style={{
                          margin: 0, fontSize: "0.85rem", color: "#374151", lineHeight: 1.7,
                          display: "-webkit-box", WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={next}
              className="rat-nav"
              style={{
                position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)",
                zIndex: 10, width: 40, height: 40, borderRadius: "50%",
                background: "#fff", border: "1.5px solid #ede9fe",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", outline: "none",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#ede9fe"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
            >
              <ChevronRight size={18} color={PURPLE} />
            </button>
          </div>

          {/* ── DOT INDICATORS ── */}
          {reviews.length > VISIBLE && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 20 }}>
              {Array.from({ length: reviews.length }).map((_, i) => {
                const displayCurrent = current % reviews.length
                return (
                  <button
                    key={i}
                    className="rat-dot"
                    onClick={() => { setCurrent(i + reviews.length); setPaused(false); }}
                    style={{
                      width: displayCurrent === i ? 24 : 8,
                      height: 8,
                      borderRadius: 999,
                      background: displayCurrent === i ? PURPLE : "#ddd6fe",
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                      padding: 0,
                      transform: displayCurrent === i ? "scale(1)" : "scale(0.85)",
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Ratings