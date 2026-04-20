import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminPageLayout from "../../layouts/AdminPageLayout";
import {
  cancelReservation,
  checkInReservation,
  checkOutReservation,
  confirmReservation,
  getAllReservations
} from "../../apiService/reservationService";
import { CalendarClock, Hotel } from "lucide-react";
import { createBillForReservation } from './../../apiService/PaymentService';

function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");

  const fetchReservations = async () => {
    try {
      const res = await getAllReservations();
      setReservations(res.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const runAction = async (type, id, item) => {
    try {
      setProcessingId(id);

      if (type === "confirm") {
        await confirmReservation(id);
        toast.success("Reservation confirmed");
      } else if (type === "cancel") {
        await cancelReservation(id, "Cancelled by admin");
        toast.success("Reservation cancelled");
      } else if (type === "checkin") {
        await checkInReservation(id);
        await createBillForReservation(item.userId, item.roomTypeId);
        toast.success("Guest checked in");
      } else if (type === "checkout") {
        await checkOutReservation(id);
        toast.success("Guest checked out");
      }

      fetchReservations();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setProcessingId("");
    }
  };

  return (
    <AdminPageLayout>
      <div className="rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              <Hotel size={14} />
              Admin Panel
            </div>

            <h2 className="m-0 text-[20px] font-bold leading-tight text-[#1f2430] md:text-[24px]">
              Manage Reservations
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6b7280]">
              Review all guest reservations and perform reservation lifecycle
              actions such as confirm, cancel, check-in, and check-out.
            </p>
          </div>

          <div className="rounded-2xl bg-[#faf7ff] px-4 py-3 text-sm text-gray-600">
            <p className="m-0 font-semibold text-violet-700">Total Reservations</p>
            <p className="mt-1 text-xs text-gray-500">
              {reservations.length} records available
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-[#faf7ff] p-6 text-sm text-gray-500">
            Loading reservations...
          </div>
        ) : reservations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-[#faf7ff] p-8 text-center text-gray-500">
            No reservations found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {reservations.map((item) => (
              <div
                key={item._id}
                className="rounded-[26px] border border-[#ece7ff] bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.05)]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                      {item.reservationCode}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-[#1f2430]">
                      {item.guestName}
                    </h3>
                    <p className="mt-1 text-sm text-[#6b7280]">{item.guestEmail}</p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : item.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : item.status === "cancelled"
                        ? "bg-red-50 text-red-700"
                        : item.status === "checked_in"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MiniInfo label="User ID" value={item.userId} />
                  <MiniInfo label="Room ID" value={item.roomId} />
                  <MiniInfo label="Room Type ID" value={item.roomTypeId} />
                  <MiniInfo label="Guests" value={item.guestsCount} />
                  <MiniInfo
                    label="Check-In"
                    value={new Date(item.checkInDate).toLocaleDateString()}
                  />
                  <MiniInfo
                    label="Check-Out"
                    value={new Date(item.checkOutDate).toLocaleDateString()}
                  />
                </div>

                <div className="mt-4 rounded-[22px] bg-[#faf7ff] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-700">
                    <CalendarClock size={16} />
                    Reservation Info
                  </div>

                  <p className="text-sm text-[#4b5563]">
                    Amount: <strong>LKR {item.baseAmount}</strong>
                  </p>
                  <p className="mt-1 text-sm text-[#4b5563]">
                    Payment Status: <strong>{item.paymentStatus}</strong>
                  </p>
                  <p className="mt-1 text-sm text-[#4b5563]">
                    Special Requests:{" "}
                    <strong>{item.specialRequests || "None"}</strong>
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {item.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => runAction("confirm", item._id)}
                      disabled={processingId === item._id}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
                    >
                      Confirm
                    </button>
                  )}

                  {(item.status === "pending" || item.status === "confirmed") && (
                    <button
                      type="button"
                      onClick={() => runAction("cancel", item._id)}
                      disabled={processingId === item._id}
                      className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
                    >
                      Cancel
                    </button>
                  )}

                  {item.status === "confirmed" && (
                    <button
                      type="button"
                      onClick={() => runAction("checkin", item._id, item)}
                      disabled={processingId === item._id}
                      className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:opacity-70"
                    >
                      Check-In
                    </button>
                  )}

                  {item.status === "checked_in" && (
                    <button
                      type="button"
                      onClick={() => runAction("checkout", item._id)}
                      disabled={processingId === item._id}
                      className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
                    >
                      Check-Out
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#faf7ff] p-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-semibold text-[#1f2430]">
        {value}
      </p>
    </div>
  );
}

export default AdminReservationsPage;