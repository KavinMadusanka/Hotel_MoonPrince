import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../layouts/Layout";
import { getRoomTypeById } from "../../apiService/roomService";
import { createReservation } from "../../apiService/reservationService";
import { getUserDetails } from "../../apiService/userService";
import {
  CalendarDays,
  CircleDollarSign,
  Hotel,
  Mail,
  Phone,
  User,
  Users
} from "lucide-react";

function BookReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    roomId: "",
    roomTypeId: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    checkInDate: location.state?.checkIn || "",
    checkOutDate: location.state?.checkOut || "",
    guestsCount: 1,
    baseAmount: 0,
    specialRequests: "",
    bookingSource: "guest"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1 — verify user is logged in
        let user = null;
        try {
          const userRes = await getUserDetails();
          user = userRes.data?.user;
          if (!user?._id) throw new Error("Not authenticated");
        } catch {
          toast.error("Please sign in to make a reservation");
          navigate("/signin", {
            state: {
              redirectTo: `/book-reservation/${id}`,
              checkIn: location.state?.checkIn || "",
              checkOut: location.state?.checkOut || "",
              qty: location.state?.qty || 1
            }
          });
          return;
        }

        // Step 2 — fetch room type details
        const roomRes = await getRoomTypeById(id);
        const room = roomRes.data;
        setRoomType(room);

        // Step 3 — pre-fill form with user and room data
        setForm((prev) => ({
          ...prev,
          userId: user._id,
          roomId: `ROOMTYPE-${room._id}`,
          roomTypeId: room._id,
          guestName: user.name || "",
          guestEmail: user.email || "",
          guestPhone: String(user.contactNumber || ""),
          baseAmount: Number(room.basePrice || 0)
        }));
      } catch (error) {
        console.error(error);
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const nights = useMemo(() => {
    if (!form.checkInDate || !form.checkOutDate) return 0;
    const diff = new Date(form.checkOutDate) - new Date(form.checkInDate);
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [form.checkInDate, form.checkOutDate]);

  const totalAmount = useMemo(() => {
    return nights * Number(form.baseAmount || 0);
  }, [nights, form.baseAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "guestsCount" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userId) {
      toast.error("Please sign in before making a reservation");
      navigate("/signin");
      return;
    }

    if (nights <= 0) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (form.guestsCount < 1) {
      toast.error("Guests count must be at least 1");
      return;
    }

    if (form.guestsCount > Number(roomType?.maxGuests || 1)) {
      toast.error(`Maximum allowed guests for this room is ${roomType?.maxGuests}`);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        userId: form.userId,
        roomId: form.roomId,
        roomTypeId: form.roomTypeId,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        guestsCount: form.guestsCount,
        baseAmount: totalAmount,
        specialRequests: form.specialRequests,
        bookingSource: "guest"
      };

      const res = await createReservation(payload);
      toast.success(res.data?.message || "Reservation created successfully");
      navigate("/my-reservations");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to create reservation"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Book Reservation">
        <div className="min-h-screen w-screen bg-[#f7f6fb] px-4 py-28">
          <div className="mx-auto max-w-6xl rounded-[28px] bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-600">Loading booking page...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!roomType) {
    return (
      <Layout title="Book Reservation">
        <div className="min-h-screen w-screen bg-[#f7f6fb] px-4 py-28">
          <div className="mx-auto max-w-6xl rounded-[28px] bg-white p-8 shadow-sm">
            <p className="text-sm text-red-500">Room type not found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Book Reservation">
      <div className="min-h-screen w-screen bg-[#f7f6fb] px-4 py-28 md:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.8fr]">

          {/* LEFT — form */}
          <div className="rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
            <div className="mb-6">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                <Hotel size={14} />
                Guest Booking
              </div>
              <h1 className="text-[26px] font-bold text-[#1f2430]">
                Reserve {roomType.name}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                Your details have been pre-filled from your account. Add your
                stay dates and any special requests to complete your booking.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6">

              {/* Guest Info */}
              <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
                <h2 className="mb-4 text-lg font-semibold text-[#1f2430]">
                  Guest Information
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    icon={<User size={18} />}
                    label="Guest Name"
                    name="guestName"
                    value={form.guestName}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                  />
                  <InputField
                    icon={<Mail size={18} />}
                    label="Guest Email"
                    name="guestEmail"
                    type="email"
                    value={form.guestEmail}
                    onChange={handleChange}
                    placeholder="Email address"
                    required
                  />
                  <InputField
                    icon={<Phone size={18} />}
                    label="Guest Phone"
                    name="guestPhone"
                    value={form.guestPhone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                  />
                  <InputField
                    icon={<Users size={18} />}
                    label={`Guests Count (max ${roomType.maxGuests || 1})`}
                    name="guestsCount"
                    type="number"
                    value={form.guestsCount}
                    onChange={handleChange}
                    placeholder="1"
                    required
                  />
                </div>
              </section>

              {/* Stay Details */}
              <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
                <h2 className="mb-4 text-lg font-semibold text-[#1f2430]">
                  Stay Details
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    icon={<CalendarDays size={18} />}
                    label="Check-in Date"
                    name="checkInDate"
                    type="date"
                    value={form.checkInDate}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    icon={<CalendarDays size={18} />}
                    label="Check-out Date"
                    name="checkOutDate"
                    type="date"
                    value={form.checkOutDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={form.specialRequests}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Optional: early check-in, extra pillows, etc."
                    className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#1f2430] outline-none placeholder:text-gray-400 focus:border-violet-700"
                  />
                </div>
              </section>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-violet-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:opacity-70"
                >
                  {submitting ? "Creating Reservation..." : "Confirm Booking Request"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT — summary */}
          <div>
            <div className="sticky top-24 rounded-[28px] bg-[#fffdf7] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <img
                src={
                  roomType.images?.[0] ||
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                }
                alt={roomType.name}
                className="h-[240px] w-full rounded-[22px] object-cover"
              />

              <h2 className="mt-5 text-[24px] font-bold text-[#1f2430]">
                {roomType.name}
              </h2>

              <div className="mt-4 space-y-3 rounded-[22px] bg-white p-4">
                <SummaryRow label="Room Type" value={roomType.name} />
                <SummaryRow label="Bed Type" value={roomType.bedType || "N/A"} />
                <SummaryRow label="Max Guests" value={roomType.maxGuests || "N/A"} />
                <SummaryRow
                  label="Price Per Night"
                  value={`LKR ${Number(roomType.basePrice || 0).toLocaleString()}`}
                />
                <SummaryRow label="Nights" value={nights || "—"} />
              </div>

              <div className="mt-4 rounded-[22px] bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Estimated Total</span>
                  <span className="text-[24px] font-bold text-violet-700">
                    LKR {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-[22px] bg-violet-50 p-4 text-sm text-violet-800">
                <div className="flex items-center gap-2 font-semibold">
                  <CircleDollarSign size={16} />
                  Payment Note
                </div>
                <p className="mt-2 leading-6">
                  Online payment is not implemented yet. Your reservation will be
                  created without payment processing in the current phase.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

function InputField({ icon, label, name, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#374151]">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-700">
        <span className="text-violet-700">{icon}</span>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-[#1f2430]">{value}</span>
    </div>
  );
}

export default BookReservationPage;