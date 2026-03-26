import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getAvailability, getRoomTypeById } from "../../../apiService/roomService";
import {
  BedDouble,
  Users,
  FileText,
  CircleDollarSign,
  BadgeCheck,
  StickyNote,
  CalendarDays
} from "lucide-react";
import Layout from "../../../layouts/Layout.jsx";
import RoomReviewsContainer from "../../GuestEngagement/guest/RoomReviewsContainer.jsx";

function RoomDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const reviewsRef = useRef(null);

  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityInfo, setAvailabilityInfo] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    checkIn: location.state?.checkIn || "",
    checkOut: location.state?.checkOut || "",
    qty: location.state?.qty || 1
  });

  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        const res = await getRoomTypeById(id);
        setRoomType(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomType();
  }, [id]);

  // Scroll to reviews container if coming from reviews page
  useEffect(() => {
    if (!loading && location.state?.scrollToReviews && reviewsRef.current) {
      setTimeout(() => {
        reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [loading, location.state?.scrollToReviews]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!bookingForm.checkIn || !bookingForm.checkOut || !id) {
        setAvailabilityInfo(null);
        return;
      }

      try {
        setAvailabilityLoading(true);

        const res = await getAvailability({
          roomTypeId: id,
          checkIn: bookingForm.checkIn,
          checkOut: bookingForm.checkOut,
          qty: bookingForm.qty
        });

        setAvailabilityInfo(res.data);
      } catch (error) {
        console.error("Failed to fetch availability", error);
        setAvailabilityInfo(null);
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchAvailability();
  }, [id, bookingForm.checkIn, bookingForm.checkOut, bookingForm.qty]);

  const images = useMemo(() => {
    if (!roomType?.images || roomType.images.length === 0) {
      return [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945"
      ];
    }

    const filled = [...roomType.images];
    while (filled.length < 4) {
      filled.push(filled[0]);
    }
    return filled.slice(0, 4);
  }, [roomType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: name === "qty" ? Math.max(1, Number(value) || 1) : value
    }));
  };

  const handleContinueToReservation = () => {
    if (
      !bookingForm.checkIn ||
      !bookingForm.checkOut ||
      availabilityLoading ||
      !canFulfill
    ) {
      return;
    }

    navigate(`/book-reservation/${roomType._id}`, {
      state: {
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        qty: bookingForm.qty,
        livePrice,
        estimatedTotal,
        nights
      }
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen w-screen bg-[#f7f6fb] px-4 py-28">
          <div className="mx-auto max-w-7xl rounded-[28px] bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-600">Loading room details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!roomType) {
    return (
      <Layout>
        <div className="min-h-screen w-screen bg-[#f7f6fb] px-4 py-28">
          <div className="mx-auto max-w-7xl rounded-[28px] bg-white p-8 shadow-sm">
            <p className="text-sm text-red-500">Room not found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const amenities = roomType.amenities || [];
  const livePrice = availabilityInfo?.finalPricePerNight ?? roomType.basePrice ?? 0;
  const estimatedTotal = availabilityInfo?.estimatedTotal ?? null;
  const nights = availabilityInfo?.nights ?? 0;
  const canFulfill =
    availabilityInfo?.canFulfill !== undefined
      ? availabilityInfo.canFulfill
      : true;
  const availableCount = availabilityInfo?.availableCount ?? null;
  const discountApplied = availabilityInfo?.discountApplied ?? false;

  return (
    <Layout>
      <div className="min-h-screen w-full bg-[#f8f7fc] px-4 pb-6 pt-24 md:px-6 md:pt-20">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Main card */}
          <div className="rounded-[28px] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="m-0 text-[20px] font-bold text-[#1f2430] md:text-[28px]">
                {roomType.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">

              {/* Images */}
              <div className="space-y-4">
                <img
                  src={images[0]}
                  alt={roomType.name}
                  className="h-[360px] w-full rounded-[24px] object-cover"
                />
                <div className="grid grid-cols-3 gap-4">
                  {images.slice(1, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${roomType.name}-${index + 2}`}
                      className="h-[110px] w-full rounded-[20px] object-cover"
                    />
                  ))}
                </div>
              </div>

              {/* Booking panel */}
              <div className="space-y-5">
                <section className="rounded-[24px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                      <CalendarDays size={20} />
                    </span>
                    <div>
                      <h2 className="m-0 text-lg font-semibold text-[#1f2430]">
                        Check Availability
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Select your stay dates and required rooms.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#374151]">
                        Check-In
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        value={bookingForm.checkIn}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#1f2430] outline-none focus:border-violet-700"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#374151]">
                        Check-Out
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        value={bookingForm.checkOut}
                        min={bookingForm.checkIn || new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#1f2430] outline-none focus:border-violet-700"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#374151]">
                        Rooms Needed
                      </label>
                      <input
                        type="number"
                        name="qty"
                        min="1"
                        value={bookingForm.qty}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#1f2430] outline-none focus:border-violet-700"
                      />
                    </div>
                  </div>

                  {/* Availability result */}
                  <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
                    {availabilityLoading ? (
                      <p className="text-sm text-gray-500">
                        Checking live availability...
                      </p>
                    ) : bookingForm.checkIn && bookingForm.checkOut ? (
                      <div className="space-y-2">
                        <p className={`text-sm font-semibold ${canFulfill ? "text-emerald-600" : "text-red-600"}`}>
                          {canFulfill
                            ? availableCount === 1
                              ? "Available — only 1 room left"
                              : `Available — ${availableCount} room(s) left`
                            : "Not available for selected dates"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Nights: <span className="font-semibold">{nights}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Price per night:{" "}
                          <span className="font-semibold text-violet-700">
                            LKR {Number(livePrice).toLocaleString()}
                          </span>
                        </p>
                        {estimatedTotal !== null && (
                          <p className="text-sm text-gray-600">
                            Estimated total:{" "}
                            <span className="font-semibold text-violet-700">
                              LKR {Number(estimatedTotal).toLocaleString()}
                            </span>
                          </p>
                        )}
                        {discountApplied && (
                          <p className="text-xs text-emerald-600">
                            Discount has been applied to this stay.
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-amber-600">
                        Please select check-in and check-out dates to view live
                        pricing and availability.
                      </p>
                    )}
                  </div>

                  {/* ← Reserve button with navigate */}
                  <button
                    type="button"
                    onClick={handleContinueToReservation}
                    disabled={
                      !bookingForm.checkIn ||
                      !bookingForm.checkOut ||
                      availabilityLoading ||
                      !canFulfill
                    }
                    className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold text-white transition ${
                      !bookingForm.checkIn ||
                      !bookingForm.checkOut ||
                      availabilityLoading ||
                      !canFulfill
                        ? "cursor-not-allowed bg-gray-300"
                        : "bg-violet-700 hover:bg-violet-800"
                    }`}
                  >
                    {!bookingForm.checkIn || !bookingForm.checkOut
                      ? "Select Dates to Reserve"
                      : !canFulfill
                      ? "Unavailable for Selected Dates"
                      : "Continue to Reservation"}
                  </button>
                </section>

                {/* Mini info cards */}
                <section className="grid grid-cols-2 gap-3">
                  <MiniInfoCard
                    icon={<Users size={18} />}
                    label="Max Guests"
                    value={roomType.maxGuests || "-"}
                  />
                  <MiniInfoCard
                    icon={<BedDouble size={18} />}
                    label="Bed Type"
                    value={roomType.bedType || "-"}
                  />
                  <MiniInfoCard
                    icon={<CircleDollarSign size={18} />}
                    label="Base Price"
                    value={`LKR ${Number(roomType.basePrice || 0).toLocaleString()}`}
                  />
                  <MiniInfoCard
                    icon={<BadgeCheck size={18} />}
                    label="Discount"
                    value={
                      roomType.discountActive
                        ? `${roomType.discountType} - ${roomType.discountValue}`
                        : "No active discount"
                    }
                  />
                </section>
              </div>
            </div>
          </div>

          {/* Description + Amenities */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <section className="rounded-[28px] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <FileText size={20} />
                </span>
                <div>
                  <h2 className="m-0 text-lg font-semibold text-[#1f2430]">
                    Room Description
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Overview of the selected room category.
                  </p>
                </div>
              </div>
              <p className="text-sm leading-7 text-[#4b5563]">
                {roomType.description ||
                  "This room category offers a comfortable and pleasant stay experience with carefully selected amenities and convenient features."}
              </p>
            </section>

            <section className="rounded-[28px] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <StickyNote size={20} />
                </span>
                <div>
                  <h2 className="m-0 text-lg font-semibold text-[#1f2430]">
                    Amenities
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Facilities included in this room type.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {amenities.length > 0 ? (
                  amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-[#f3f4f6] px-3 py-1.5 text-[12px] font-medium text-[#4b5563]"
                    >
                      {amenity}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No amenities listed.</p>
                )}
              </div>
            </section>
          </div>

          {/* Guest Reviews */}
          <div ref={reviewsRef}>
            <RoomReviewsContainer roomTypeId={roomType._id} />
          </div>

        </div>
      </div>
    </Layout>
  );
}

function MiniInfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#ece7ff] bg-[#fcfbff] p-3 shadow-sm">
      <div className="mb-2 text-violet-700">{icon}</div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#1f2430]">{value}</p>
    </div>
  );
}

export default RoomDetailsPage;