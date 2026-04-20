import { useEffect, useState, useMemo } from "react";
import { getReviewsByRoomType } from "../../../apiService/reviewService";
import { getUserNameDpById } from "../../../apiService/userService";
import { Star, MessageCircle, Pin } from "lucide-react";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const PURPLE = "#7c22e8";
const PURPLE_PALE = "#f3eaff";
const PURPLE_BORDER = "#e0ccff";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
const RATING_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

function StarDisplay({ rating, size = 15 }) {
  const r = Math.max(0, Math.min(5, Math.round(rating || 0)));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={s <= r ? "#f59e0b" : "none"}
          color={s <= r ? "#f59e0b" : "#d1d5db"}
          strokeWidth={1.5}
        />
      ))}
      <span style={{ marginLeft: 5, fontSize: 12, fontWeight: 600, color: "#374151" }}>
        {typeof rating === "number" ? rating.toFixed(1) : rating}
      </span>
    </div>
  );
}

function RatingBadge({ rating }) {
  if (!rating) return null;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        padding: "2px 8px",
        borderRadius: 999,
        background: RATING_COLORS[rating] + "18",
        color: RATING_COLORS[rating],
        textTransform: "uppercase",
        border: `1px solid ${RATING_COLORS[rating]}30`,
      }}
    >
      {RATING_LABELS[rating]}
    </span>
  );
}

function RoomReviewsContainer({ roomTypeId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      if (!roomTypeId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getReviewsByRoomType(roomTypeId);
        // Handle different API response structures
        const reviewsData = Array.isArray(res.data) 
          ? res.data 
          : Array.isArray(res.data?.reviews) 
          ? res.data.reviews 
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setReviews(reviewsData);
        setError(null);

        // Fetch user information for all reviews
        const userIds = Array.from(new Set(reviewsData.map((r) => String(r.userId)).filter(Boolean)));
        await Promise.all(userIds.map(async (userId) => {
          if (userMap[userId]) return;
          try {
            const userRes = await getUserNameDpById(userId);
            const userData = userRes.data?.user || userRes.data || null;
            if (userData) {
              const photo = userData.photo
                ? `${USER_SERVICE_URL}${API_VERSION}/userService/user_photos/${userData.photo}`
                : null;
              setUserMap((prev) => ({ 
                ...prev, 
                [userId]: { 
                  name: userData.name || "Unknown", 
                  photo 
                } 
              }));
            }
          } catch (userErr) {
            console.error("Failed to fetch user info:", userErr);
          }
        }));
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError("Unable to load reviews");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [roomTypeId]);

  // Calculate overall rating
  const overallRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const avg = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
    return parseFloat(avg.toFixed(1));
  }, [reviews]);

  // Sort reviews: pinned first, then by rating (5 to 1)
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews].sort((a, b) => {
      // Pinned reviews first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by rating (highest to lowest)
      return (b.rating || 0) - (a.rating || 0);
    });
    return sorted;
  }, [reviews]);

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-sm md:p-6">
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .reviews-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
          scroll-behavior: smooth;
        }
        .reviews-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .reviews-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .reviews-scroll::-webkit-scrollbar-thumb {
          background: #ddd6fe;
          border-radius: 3px;
        }
        .review-card-pinned {
          position: sticky;
          left: 0;
          z-index: 10;
          flex-shrink: 0;
        }
      `}</style>

      {/* Overall Rating Section */}
      {!loading && reviews.length > 0 && (
        <div className="mb-6 rounded-[24px] bg-gradient-to-r from-violet-50 to-purple-50 p-5 border border-violet-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Overall Rating
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      className={
                        s <= Math.round(overallRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <div>
                  <p className="m-0 text-2xl font-bold text-violet-700">
                    {overallRating}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="m-0 text-3xl font-bold text-gray-800">
                {reviews.length}
              </p>
              <p className="m-0 text-sm text-gray-500">
                {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <MessageCircle size={20} />
        </span>
        <div>
          <h2 className="m-0 text-lg font-semibold text-[#1f2430]">
            Guest Reviews
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            What guests say about this room type.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#ede9fe] bg-[#faf7ff] px-5 py-6">
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "3px solid #ede9fe",
              borderTopColor: "#7c22e8",
              animation: "spin 0.8s linear infinite",
              flexShrink: 0,
            }}
          />
          <span className="text-sm text-gray-500">Loading reviews...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Reviews Carousel (Single Row with Sticky Pinned) */}
      {!loading && !error && reviews.length > 0 && (
        <div className="reviews-scroll">
          {/* Pinned Reviews First */}
          {sortedReviews.filter(r => r.isPinned).map((review) => {
            const user = userMap[String(review.userId)];
            return (
              <div
                key={review._id}
                className="review-card-pinned"
                style={{
                  flex: "0 0 360px",
                  background: "#fff",
                  borderRadius: 16,
                  border: `2px solid ${PURPLE}`,
                  boxShadow: "0 4px 18px rgba(124,34,232,0.1)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 36px rgba(124,34,232,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 18px rgba(124,34,232,0.1)";
                }}
              >
                {/* Pinned badge strip */}
                <div
                  style={{
                    background: PURPLE_PALE,
                    padding: "8px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    borderBottom: `1px solid ${PURPLE_BORDER}`,
                  }}
                >
                  <Pin
                    size={11}
                    color={PURPLE}
                    style={{ transform: "rotate(45deg)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: PURPLE,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Pinned Review
                  </span>
                </div>

                {/* Card content */}
                <div style={{ padding: "20px 22px" }}>
                  {/* Guest info + Stars row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#ede9fe",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        {user?.photo ? (
                          <img
                            src={user.photo}
                            alt={user.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: PURPLE,
                            }}
                          >
                            {String(user?.name || review.userId || "G")[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#1f2430",
                          }}
                        >
                          {user?.name ||
                            (review.userId
                              ? `User ${String(review.userId).slice(-6)}`
                              : "Guest")}
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: 11,
                            color: "#9ca3af",
                          }}
                        >
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* Stars + Rating Badge */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                        marginLeft: "auto",
                        flexShrink: 0,
                      }}
                    >
                      <StarDisplay rating={review.rating} size={14} />
                      <RatingBadge rating={review.rating} />
                    </div>
                  </div>

                  {/* Comment - full width */}
                  <p
                    style={{
                      margin: "0 0 14px 0",
                      fontSize: "0.9rem",
                      color: "#374151",
                      lineHeight: 1.7,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {review.comment}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Non-Pinned Reviews */}
          {sortedReviews.filter(r => !r.isPinned).map((review) => {
            const user = userMap[String(review.userId)];
            return (
              <div
                key={review._id}
                style={{
                  flex: "0 0 360px",
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid #ede9fe",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 36px rgba(124,34,232,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                }}
              >
                {/* Card content */}
                <div style={{ padding: "20px 22px" }}>
                  {/* Guest info + Stars row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#ede9fe",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        {user?.photo ? (
                          <img
                            src={user.photo}
                            alt={user.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: PURPLE,
                            }}
                          >
                            {String(user?.name || review.userId || "G")[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#1f2430",
                          }}
                        >
                          {user?.name ||
                            (review.userId
                              ? `User ${String(review.userId).slice(-6)}`
                              : "Guest")}
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: 11,
                            color: "#9ca3af",
                          }}
                        >
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* Stars + Rating Badge */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                        marginLeft: "auto",
                        flexShrink: 0,
                      }}
                    >
                      <StarDisplay rating={review.rating} size={14} />
                      <RatingBadge rating={review.rating} />
                    </div>
                  </div>

                  {/* Comment - full width */}
                  <p
                    style={{
                      margin: "0 0 14px 0",
                      fontSize: "0.9rem",
                      color: "#374151",
                      lineHeight: 1.7,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {review.comment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-6">
          No reviews yet for this room type. Be the first to share your experience!
        </p>
      )}
    </section>
  );
}

export default RoomReviewsContainer;
