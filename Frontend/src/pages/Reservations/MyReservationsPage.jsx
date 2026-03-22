import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import { getUserDetails } from "../../apiService/userService";
import {
  cancelReservation,
  getReservationsByUserId
} from "../../apiService/reservationService";
import { CalendarDays, UserCircle2, Star } from "lucide-react";

function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState("");
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const userRes = await getUserDetails();
      const user = userRes.data?.user;

      if (!user?._id) {
        toast.error("Please sign in to view your reservations");
        navigate("/signin");
        return;
      }

      const res = await getReservationsByUserId(user._id);
      setReservations(res.data?.data || []);
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 401) {
        toast.error("Please sign in to view your reservations");
        navigate("/signin");
        return;
      }
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    try {
      setCancellingId(id);
      const res = await cancelReservation(id, "Cancelled by guest from frontend");
      toast.success(res.data?.message || "Reservation cancelled");
      fetchReservations();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to cancel reservation"
      );
    } finally {
      setCancellingId("");
    }
  };

  const handleReview = (reservationId) => {
    navigate(`/write-review/${reservationId}`);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":    return "bg-amber-50 text-amber-700";
      case "confirmed":  return "bg-emerald-50 text-emerald-700";
      case "cancelled":  return "bg-red-50 text-red-700";
      case "checked_in": return "bg-blue-50 text-blue-700";
      case "completed":  return "bg-violet-50 text-violet-700";
      default:           return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Layout title="My Reservations">
      <div className="min-h-screen w-screen bg-[#f7f6fb] px-4 py-28 md:px-6">
        <div className="mx-auto max-w-7xl rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">

          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                <UserCircle2 size={14} />
                Guest Dashboard
              </div>
              <h1 className="text-[26px] font-bold text-[#1f2430]">
                My Reservations
              </h1>
              <p className="mt-2 text-sm text-[#6b7280]">
                View your booking records, reservation status, and manage your stays.
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf7ff] px-4 py-3 text-sm">
              <p className="font-semibold text-violet-700">Total Reservations</p>
              <p className="mt-1 text-xs text-gray-500">
                {reservations.length} records found
              </p>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="rounded-2xl bg-[#faf7ff] p-6 text-sm text-gray-500">
              Loading reservations...
            </div>
          ) : reservations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d8d8df] bg-[#faf7ff] p-8 text-center text-gray-500">
              No reservations found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {reservations.map((item) => (
                <div
                  key={item._id}
                  className="rounded-[26px] border border-[#ece7ff] bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.05)]"
                >
                  {/* Card Header */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        {item.reservationCode}
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-[#1f2430]">
                        {item.guestName}
                      </h3>
                      <p className="mt-1 text-sm text-[#6b7280]">
                        {item.guestEmail}
                      </p>
                    </div>

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(item.status)}`}>
                      {item.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <MiniCard
                      label="Check-In"
                      value={new Date(item.checkInDate).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    />
                    <MiniCard
                      label="Check-Out"
                      value={new Date(item.checkOutDate).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    />
                    <MiniCard label="Guests" value={item.guestsCount} />
                    <MiniCard label="Nights" value={item.nights} />
                    <MiniCard label="Room Type ID" value={item.roomTypeId} />
                    <MiniCard label="Hold ID" value={item.holdId} />
                  </div>

                  {/* Reservation Summary */}
                  <div className="mt-4 rounded-[22px] bg-[#faf7ff] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-700">
                      <CalendarDays size={16} />
                      Reservation Summary
                    </div>
                    <p className="text-sm text-[#4b5563]">
                      Base Amount:{" "}
                      <strong>LKR {Number(item.baseAmount || 0).toLocaleString()}</strong>
                    </p>
                    <p className="mt-1 text-sm text-[#4b5563]">
                      Payment Status: <strong>{item.paymentStatus}</strong>
                    </p>
                    <p className="mt-1 text-sm text-[#4b5563]">
                      Booking Source: <strong>{item.bookingSource}</strong>
                    </p>
                    {item.specialRequests && (
                      <p className="mt-1 text-sm text-[#4b5563]">
                        Special Requests: <strong>{item.specialRequests}</strong>
                      </p>
                    )}
                    {item.cancellationReason && (
                      <p className="mt-1 text-sm text-red-500">
                        Cancellation Reason: <strong>{item.cancellationReason}</strong>
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                    {/* ← Review button — checked_in OR completed */}
                    <div>
                      {(item.status === "checked_in" || item.status === "completed") && (
                        <button
                          type="button"
                          onClick={() => handleReview(item._id)}
                          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                        >
                          <Star size={14} />
                          Review
                        </button>
                      )}
                    </div>

                    {/* Cancel button — pending or confirmed only */}
                    <div>
                      {(item.status === "pending" || item.status === "confirmed") && (
                        <button
                          type="button"
                          onClick={() => handleCancel(item._id)}
                          disabled={cancellingId === item._id}
                          className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
                        >
                          {cancellingId === item._id
                            ? "Cancelling..."
                            : "Cancel Reservation"}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function MiniCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#faf7ff] p-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#1f2430] break-all">
        {value}
      </p>
    </div>
  );
}

export default MyReservationsPage;