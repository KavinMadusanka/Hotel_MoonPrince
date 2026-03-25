import React, { useEffect, useState, useMemo } from 'react';
import AdminPageLayout from '../../../layouts/AdminPageLayout';
import { getRoomTypes } from '../../../apiService/roomService';
import { getReviewsByRoomType, pinReview, unpinReview } from '../../../apiService/reviewService';
import { getUserNameDpById } from '../../../apiService/userService';
import {
  Star, Pin, PinOff, MessageSquare, Users,
  AlertCircle, ChevronRight, Search, Filter, X,
  SlidersHorizontal, ChevronDown
} from 'lucide-react';

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION      = import.meta.env.VITE_API_VERSION;

const PURPLE        = "#7c22e8";
const PURPLE_PALE   = "#f3eaff";
const PURPLE_BORDER = "#e0ccff";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
const RATING_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

function StarDisplay({ rating, size = 15 }) {
  const r = Math.max(0, Math.min(5, Math.round(rating || 0)));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={size}
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
  );
}

const SORT_OPTIONS = ["Newest First", "Oldest First"];

export default function ManageRoomTypeReviews() {
  const [roomTypes, setRoomTypes]           = useState([]);
  const [loadingRooms, setLoadingRooms]     = useState(true);
  const [selectedRoom, setSelectedRoom]     = useState(null);
  const [reviews, setReviews]               = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [pinningId, setPinningId]           = useState(null);
  const [error, setError]                   = useState(null);
  const [userMap, setUserMap]               = useState({});

  // room search
  const [searchRoom, setSearchRoom] = useState('');

  // review toolbar
  const [searchReview, setSearchReview] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [filterOpen, setFilterOpen]     = useState(false);
  const [sort, setSort]                 = useState('Newest First');
  const [sortOpen, setSortOpen]         = useState(false);

  // per-room overall rating cache
  const [roomRatings, setRoomRatings] = useState({});

  useEffect(() => { fetchRoomTypes(); }, []);

  const fetchRoomTypes = async () => {
    try {
      setLoadingRooms(true);
      const res = await getRoomTypes();
      const rooms = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setRoomTypes(rooms);

      // compute and cache overall ratings for each room type so cards show numbers immediately
      try {
        const ratingsObj = {};
        await Promise.all(rooms.map(async (r) => {
          try {
            const revRes = await getReviewsByRoomType(r._id || r.id);
            const list = Array.isArray(revRes.data?.data) ? revRes.data.data : Array.isArray(revRes.data) ? revRes.data : [];
            if (list && list.length > 0) {
              const avg = list.reduce((s, it) => s + (it.rating || 0), 0) / list.length;
              ratingsObj[r._id || r.id] = parseFloat(avg.toFixed(1));
            } else {
              ratingsObj[r._id || r.id] = 0;
            }
          } catch (e) {
            ratingsObj[r._id || r.id] = 0;
          }
        }));
        setRoomRatings((prev) => ({ ...prev, ...ratingsObj }));
      } catch (e) {
        // ignore per-room rating failures — cards will show —
      }
    } catch (err) {
      setError('Failed to load room types.');
    } finally {
      setLoadingRooms(false);
    }
  };

  const selectRoom = async (room) => {
    setSelectedRoom(room);
    setReviews([]);
    setError(null);
    setSearchReview('');
    setRatingFilter(0);
    setSortOpen(false);
    setFilterOpen(false);
    try {
      setLoadingReviews(true);
      const res  = await getReviewsByRoomType(room._id || room.id);
      const data = res.data?.data || res.data || [];
      const list = Array.isArray(data) ? data : [];
      setReviews(list);

      // cache overall rating for this room
      if (list.length > 0) {
        const avg = list.reduce((s, r) => s + (r.rating || 0), 0) / list.length;
        setRoomRatings((prev) => ({ ...prev, [room._id || room.id]: parseFloat(avg.toFixed(1)) }));
      }

      // fetch user info
      const userIds = Array.from(new Set(list.map((r) => String(r.userId)).filter(Boolean)));
      await Promise.all(userIds.map(async (userId) => {
        if (userMap[userId]) return;
        try {
          const userRes  = await getUserNameDpById(userId);
          const userData = userRes.data?.user || userRes.data || null;
          if (userData) {
            const photo = userData.photo
              ? `${USER_SERVICE_URL}${API_VERSION}/userService/user_photos/${userData.photo}`
              : null;
            setUserMap((prev) => ({ ...prev, [userId]: { name: userData.name || 'Unknown', photo } }));
          }
        } catch {}
      }));
    } catch (err) {
      setError('Failed to load reviews for this room type.');
    } finally {
      setLoadingReviews(false);
    }
  };

  const handlePin = async (reviewId) => {
    try {
      setPinningId(reviewId);
      console.log('Attempting to pin review:', reviewId);
      
      // First, unpin any currently pinned review for this room type
      const currentlyPinned = reviews.find((r) => r.isPinned);
      if (currentlyPinned) {
        console.log('Unpinning previously pinned review:', currentlyPinned._id || currentlyPinned.id);
        await unpinReview(currentlyPinned._id || currentlyPinned.id);
      }
      
      // Then pin the selected review
      console.log('Pinning review:', reviewId);
      const pinResponse = await pinReview(reviewId);
      console.log('Pin response:', pinResponse);
      
      // Update UI: unpin all others, pin the selected one
      setReviews((prev) =>
        prev
          .map((r) => {
            const rid = r._id || r.id;
            return { ...r, isPinned: rid === reviewId };
          })
          .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
      );
      setError(null);
    } catch (err) {
      console.error('Pin error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        fullError: err
      });
      setError(`Failed to pin review: ${err.response?.data?.message || err.message}`);
    } finally {
      setPinningId(null);
    }
  };

  const handleUnpin = async (reviewId) => {
    try {
      setPinningId(reviewId);
      console.log('Attempting to unpin review:', reviewId);
      
      const unpinResponse = await unpinReview(reviewId);
      console.log('Unpin response:', unpinResponse);
      
      setReviews((prev) =>
        prev.map((r) => {
          const rid = r._id || r.id;
          return { ...r, isPinned: rid === reviewId ? false : r.isPinned };
        })
      );
      setError(null);
    } catch (err) {
      console.error('Unpin error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        fullError: err
      });
      setError(`Failed to unpin review: ${err.response?.data?.message || err.message}`);
    } finally {
      setPinningId(null);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const filteredRooms = useMemo(() =>
    roomTypes.filter((r) => r.name.toLowerCase().includes(searchRoom.toLowerCase())),
  [roomTypes, searchRoom]);

  const filteredReviews = useMemo(() =>
    reviews
      .filter((rev) => {
        const user   = userMap[String(rev.userId)];
        const qMatch = rev.comment?.toLowerCase().includes(searchReview.toLowerCase()) ||
          user?.name?.toLowerCase().includes(searchReview.toLowerCase());
        const rMatch = ratingFilter === 0 || rev.rating === ratingFilter;
        return qMatch && rMatch;
      })
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        const da = new Date(a.createdAt), db = new Date(b.createdAt);
        return sort === 'Newest First' ? db - da : da - db;
      }),
  [reviews, userMap, searchReview, ratingFilter, sort]);

  const closeDropdowns = () => { setSortOpen(false); setFilterOpen(false); };

  const selectedRoomId = selectedRoom ? (selectedRoom._id || selectedRoom.id) : null;
  const overallRating = useMemo(() => {
    if (!selectedRoomId) return 0;
    if (roomRatings[selectedRoomId]) return roomRatings[selectedRoomId];
    if (!reviews || reviews.length === 0) return 0;
    const avg = reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;
    return parseFloat(avg.toFixed(1));
  }, [selectedRoomId, roomRatings, reviews]);

  return (
    <AdminPageLayout>
      <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes modalIn { from { opacity:0; transform:translateY(16px) scale(.97); } to { opacity:1; transform:none; } }
        @keyframes spin { to { transform: rotate(360deg); } }

        .rmr-no-outline:focus,
        .rmr-no-outline:focus-visible { outline: none !important; box-shadow: none !important; }
        .room-scroll::-webkit-scrollbar { height: 6px; }
        .room-scroll::-webkit-scrollbar-track { background: transparent; }
        .room-scroll::-webkit-scrollbar-thumb { background: #ddd6fe; border-radius: 99px; }
        .room-card-btn { all: unset; cursor: pointer; display: block; box-sizing: border-box; }
        .room-card-btn:focus,
        .room-card-btn:focus-visible { outline: none; box-shadow: none; border-radius: 16px; }
        .room-card-btn:focus-visible { box-shadow: 0 6px 20px rgba(124,34,232,0.08); }
        .rev-card { transition: transform .2s, box-shadow .2s; }
        .rev-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(124,34,232,0.12) !important; }
        .filter-chip { transition: all 0.15s; }
        .filter-chip:hover { opacity: 0.85; }
        .sort-dropdown { position: absolute; right: 0; background: #fff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); border: 1px solid #f3f4f6; overflow: hidden; z-index: 50; min-width: 150px; }
        .sort-opt { padding: 10px 16px; font-size: 0.9rem; cursor: pointer; transition: background 0.15s; }
      `}</style>

      <div onClick={closeDropdowns} className="rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">

        {/* ── PAGE HEADER ── */}
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            <MessageSquare size={14} /> Admin Panel
          </div>
          <h2 className="m-0 text-[20px] font-bold leading-tight text-[#1f2430] md:text-[24px]">
            Room Reviews
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#6b7280]">
            Manage and monitor all guest reviews for your room types.
          </p>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div style={{ padding: 12, display: "flex", gap: 10, alignItems: "center", color: "#991b1b", background: "#fef2f2", borderRadius: 12, border: "1px solid #fee2e2", marginBottom: 24 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* ── ROOM TYPE SEARCH TOOLBAR ── */}
        <div
          className="mb-8 flex items-center rounded-2xl border border-[#e5e7eb] bg-white shadow-sm"
          style={{ overflow: "visible" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-1 items-center gap-2 px-4 py-3">
            <Search size={15} className="flex-shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder="Search room types…"
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
              className="rmr-no-outline w-full border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
            />
            {searchRoom && (
              <button
                onClick={() => setSearchRoom('')}
                className="rmr-no-outline flex-shrink-0 text-gray-300 transition hover:text-gray-500"
                style={{ border: "none", background: "none", outline: "none" }}
              >✕</button>
            )}
          </div>
        </div>

        {/* ── HORIZONTAL ROOM TYPE SCROLL ── */}
        <div style={{ marginBottom: 32 }}>
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-violet-700">
            <MessageSquare size={15} className="text-violet-600" />
            Room Types
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700">
              {filteredRooms.length}
            </span>
          </p>

          {loadingRooms ? (
            <div className="flex items-center gap-3 rounded-2xl border border-[#ede9fe] bg-[#faf7ff] px-5 py-4">
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '3px solid #ede9fe', borderTopColor: PURPLE, animation: 'spin .8s linear infinite', flexShrink: 0 }} />
              <span className="text-sm text-gray-500">Loading room types...</span>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div style={{ borderRadius: 12, border: "1px dashed #ddd6fe", background: "#faf7ff", padding: "24px 20px", textAlign: "center", fontSize: "0.9rem", color: "#9ca3af" }}>
              {roomTypes.length === 0 ? 'No room types found.' : 'No room types match your search.'}
            </div>
          ) : (
            <div className="room-scroll" style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, paddingTop: 2 }}>
              {filteredRooms.map((room) => {
                const rid        = room._id || room.id;
                const isSelected = selectedRoom && (selectedRoom._id === rid || selectedRoom.id === rid);
                const avgRating  = roomRatings[rid] || 0;
                return (
                  <button
                    key={rid}
                    className="room-card-btn"
                    type="button"
                    onClick={() => selectRoom(room)}
                    style={{
                      minWidth: 190, maxWidth: 190,
                      borderRadius: 16, overflow: 'hidden',
                      border: isSelected ? `2px solid ${PURPLE}` : '1.5px solid #ede9fe',
                      background: '#fff',
                      boxShadow: isSelected ? '0 4px 18px rgba(124,34,232,0.16)' : '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'border .15s, box-shadow .15s',
                      flexShrink: 0,
                    }}
                  >
                    {room.images?.length > 0 ? (
                      <img src={room.images[0]} alt={room.name} style={{ width: '100%', height: 106, objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ height: 106, background: '#f5f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={26} color="#ddd6fe" />
                      </div>
                    )}

                    <div style={{ padding: '10px 12px 12px' }}>
                      <p style={{ margin: '0 0 5px', fontSize: 13, fontWeight: 700, color: isSelected ? PURPLE : '#1f2430', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {room.name}
                      </p>

                      {/* Overall rating */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 6 }}>
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={11}
                            fill={s <= Math.round(avgRating) ? '#f59e0b' : 'none'}
                            color={s <= Math.round(avgRating) ? '#f59e0b' : '#e5e7eb'}
                            strokeWidth={1.5}
                          />
                        ))}
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', marginLeft: 2 }}>
                          {avgRating > 0 ? avgRating : '—'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Users size={10} color="#9ca3af" /> {room.maxGuests || '—'}
                        </span>
                        <span style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 3 }}>
                          Rs. {room.basePrice != null ? room.basePrice : '—'}
                        </span>
                      </div>
                    </div>

                    {isSelected && <div style={{ height: 3, background: PURPLE, width: '100%' }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── REVIEWS SECTION ── */}
        {!selectedRoom ? (
          <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-violet-200 bg-[#faf7ff] py-16 text-center" style={{ marginTop: 32 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <ChevronRight size={24} color={PURPLE} />
            </div>
            <p className="mb-1 text-sm font-semibold text-[#1f2430]">Select a room type above</p>
            <p className="text-xs text-gray-400">Click any room card to view and manage its guest reviews.</p>
          </div>
        ) : (
          <>
            {/* Reviews header + Overall rating in single row */}
            {selectedRoom && (
              <div className="mb-4 flex items-center justify-between gap-4 pb-4 border-b border-[#ede9fe]" style={{ marginTop: 12, paddingTop: 12 }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Reviews for
                  </p>
                  <h3 className="m-0 text-[18px] font-bold text-[#1f2430] md:text-[20px]">{selectedRoom.name}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Overall rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                    <StarDisplay rating={overallRating} size={16} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#1f2430' }}>
                        {overallRating > 0 ? overallRating : '—'}
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  {/* Review count badge */}
                  {!loadingReviews && (
                    <span className="rounded-full border border-[#ddd6fe] bg-[#f3f0ff] px-3 py-0.5 text-xs font-bold text-violet-700" style={{ whiteSpace: 'nowrap' }}>
                      {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ── REVIEW TOOLBAR ── */}
            {!loadingReviews && reviews.length > 0 && (
              <div
                className="mb-8 flex items-center rounded-2xl border border-[#e5e7eb] bg-white shadow-sm"
                style={{ overflow: "visible" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 200, paddingLeft: 16 }}>
                  <Search size={15} color="#9ca3af" />
                  <input
                    type="text"
                    placeholder="Search reviews or guest names…"
                    value={searchReview}
                    onChange={(e) => setSearchReview(e.target.value)}
                    className="rmr-no-outline w-full border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
                  />
                  {searchReview && (
                    <button
                      onClick={() => setSearchReview('')}
                      className="rmr-no-outline flex-shrink-0 text-gray-300 transition hover:text-gray-500"
                      style={{ border: "none", background: "none", outline: "none", marginRight: 8 }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="h-6 w-px flex-shrink-0 bg-[#e5e7eb]" />

                {/* Rating filter */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => { setFilterOpen((o) => !o); setSortOpen(false); }}
                    className="rmr-no-outline flex items-center gap-1.5 px-4 py-3 text-sm transition hover:text-[#374151]"
                    style={{ border: "none", background: "none", outline: "none", boxShadow: "none" }}
                  >
                    <Filter size={13} className="text-gray-400" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Filter:</span>
                    <span className="text-sm font-medium text-[#374151]">
                      {ratingFilter > 0 ? `${ratingFilter}★` : "All"}
                    </span>
                    <ChevronDown size={13} className="text-gray-400"
                      style={{ transform: filterOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }} />
                  </button>
                  {filterOpen && (
                    <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[160px] overflow-hidden rounded-2xl border border-[#f3f4f6] bg-white shadow-lg">
                      {[0, 1, 2, 3, 4, 5].map((r) => (
                        <button key={r}
                          onClick={() => { setRatingFilter(r === ratingFilter ? 0 : r); setFilterOpen(false); }}
                          className="rmr-no-outline flex w-full items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-violet-50"
                          style={{ background: ratingFilter === r ? "#f3eaff" : "transparent", color: ratingFilter === r ? PURPLE : "#374151", fontWeight: ratingFilter === r ? 600 : 400, border: "none", outline: "none" }}
                        >
                          {r === 0 ? "All" : <>{r}&nbsp;<Star size={11} fill={ratingFilter === r ? PURPLE : "#f59e0b"} color={ratingFilter === r ? PURPLE : "#f59e0b"} /></>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-6 w-px flex-shrink-0 bg-[#e5e7eb]" />

                {/* Sort */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => { setSortOpen((o) => !o); setFilterOpen(false); }}
                    className="rmr-no-outline flex items-center gap-1.5 px-4 py-3 text-sm transition hover:text-[#374151]"
                    style={{ border: "none", background: "none", outline: "none", boxShadow: "none" }}
                  >
                    <SlidersHorizontal size={13} className="text-gray-400" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Sort:</span>
                    <span className="text-sm font-medium text-[#374151]">
                      {sort === "Newest First" ? "Newest First" : "Oldest First"}
                    </span>
                    <ChevronDown size={13} className="text-gray-400"
                      style={{ transform: sortOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[150px] overflow-hidden rounded-2xl border border-[#f3f4f6] bg-white shadow-lg">
                      {SORT_OPTIONS.map((option) => (
                        <button key={option}
                          onClick={() => { setSort(option); setSortOpen(false); }}
                          className="rmr-no-outline flex w-full items-center px-4 py-2.5 text-sm transition hover:bg-violet-50"
                          style={{ background: sort === option ? "#faf7ff" : "transparent", color: sort === option ? "#7c3aed" : "#374151", fontWeight: sort === option ? 600 : 400, border: "none", outline: "none" }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── REVIEW LIST ── */}
            {loadingReviews ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-violet-200 bg-[#faf7ff] py-16 text-center">
                <MessageSquare size={30} color="#ddd6fe" />
                <p className="mt-3 text-sm font-semibold text-gray-500">No reviews yet</p>
                <p className="mt-1 text-xs text-gray-400">Guests haven't reviewed this room type yet.</p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-violet-200 bg-[#faf7ff] py-16 text-center">
                <MessageSquare size={30} color="#ddd6fe" />
                <p className="mt-3 text-sm font-semibold text-gray-500">No reviews match your filters</p>
                <p className="mt-1 text-xs text-gray-400">Try adjusting your search or rating filter.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredReviews.map((rev) => {
                  const userId    = String(rev.userId);
                  const user      = userMap[userId];
                  const isPinning = pinningId === (rev._id || rev.id);
                  return (
                    <div
                      key={rev._id || rev.id}
                      className="rev-card"
                      style={{
                        background: '#fff',
                        borderRadius: 16,
                        border: rev.isPinned ? `2px solid ${PURPLE}` : '1px solid #ede9fe',
                        boxShadow: rev.isPinned
                          ? '0 4px 18px rgba(124,34,232,0.1)'
                          : '0 2px 12px rgba(0,0,0,0.06)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Pinned badge - at top in a strip */}
                      {rev.isPinned && (
                        <div style={{ background: '#f3eaff', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${PURPLE_BORDER}` }}>
                          <Pin size={11} color={PURPLE} style={{ transform: 'rotate(45deg)', flexShrink: 0 }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pinned Review</span>
                        </div>
                      )}

                      <div style={{ padding: '20px 22px' }}>
                        {/* Guest info + Stars row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                              {user?.photo ? (
                                <img src={user.photo} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                              ) : (
                                <span style={{ fontSize: 13, fontWeight: 700, color: PURPLE }}>
                                  {String(user?.name || rev.userId || 'G')[0].toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1f2430' }}>
                                {user?.name || (rev.userId ? `User ${String(rev.userId).slice(-6)}` : 'Guest')}
                              </p>
                              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>{formatDate(rev.createdAt)}</p>
                            </div>
                          </div>

                          {/* Stars + Rating Badge */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginLeft: 'auto', flexShrink: 0 }}>
                            <StarDisplay rating={rev.rating} size={16} />
                            <RatingBadge rating={rev.rating} />
                          </div>
                        </div>

                        {/* Comment - full width below */}
                        <p style={{ margin: '0 0 14px 0', fontSize: "0.9rem", color: "#374151", lineHeight: 1.7 }}>
                          {rev.comment}
                        </p>

                        {/* Action buttons - bottom right */}
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: '1px solid #f0ecff' }}>
                          {rev.isPinned ? (
                            <button
                              type="button"
                              disabled={isPinning}
                              onClick={() => handleUnpin(rev._id || rev.id)}
                              style={{ display: "flex", alignItems: "center", gap: 6, background: "#fef2f2", color: "#dc2626", border: "1.5px solid #fecaca", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, outline: "none", transition: "background .15s", opacity: isPinning ? 0.6 : 1 }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "#fef2f2"}
                            >
                              <PinOff size={12} color="#dc2626" />
                              {isPinning ? 'Unpinning...' : 'Unpin'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isPinning}
                              onClick={() => handlePin(rev._id || rev.id)}
                              style={{ display: "flex", alignItems: "center", gap: 6, background: PURPLE_PALE, color: PURPLE, border: `1.5px solid ${PURPLE_BORDER}`, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, outline: "none", transition: "background .15s", opacity: isPinning ? 0.6 : 1 }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#ddd6fe"}
                              onMouseLeave={(e) => e.currentTarget.style.background = PURPLE_PALE}
                            >
                              <Pin size={12} color={PURPLE} style={{ transform: 'rotate(45deg)' }} />
                              {isPinning ? 'Pinning...' : 'Pin to Top'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      </>    </AdminPageLayout>
  );
}