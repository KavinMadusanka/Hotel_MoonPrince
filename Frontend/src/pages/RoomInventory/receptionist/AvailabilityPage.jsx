import { useEffect, useMemo, useRef, useState } from "react";
import { getAvailability, getRoomTypes } from "../../../apiService/roomService";
import {
  CalendarDays,
  BedDouble,
  Search,
  CircleDollarSign,
  BadgeCheck,
  Clock3,
  Hotel,
  Hash,
  Building2,
  CheckCircle2,
  ClipboardCheck
} from "lucide-react";

function AvailabilityPage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(true);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    roomTypeId: "",
    checkIn: "",
    checkOut: "",
    qty: 1
  });

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await getRoomTypes();
        const data = res.data || [];
        setRoomTypes(data);

        if (data.length > 0) {
          setForm((prev) => ({
            ...prev,
            roomTypeId: data[0]._id
          }));
        }
      } catch (error) {
        console.error("Failed to fetch room types", error);
      } finally {
        setLoadingRoomTypes(false);
      }
    };

    fetchRoomTypes();
  }, []);

  const selectedRoomType = useMemo(() => {
    return roomTypes.find((item) => item._id === form.roomTypeId) || null;
  }, [roomTypes, form.roomTypeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "qty" ? Math.max(1, Number(value) || 1) : value
    }));
  };

  const handleCheckAvailability = async (e) => {
    e.preventDefault();

    if (!form.roomTypeId || !form.checkIn || !form.checkOut) {
      alert("Please select room type, check-in date, and check-out date.");
      return;
    }

    try {
      setChecking(true);
      setResult(null);

      const res = await getAvailability({
        roomTypeId: form.roomTypeId,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        qty: form.qty
      });

      setResult(res.data);
    } catch (error) {
      console.error("Availability check failed", error);
      alert(
        error?.response?.data?.message || "Failed to check room availability."
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f4fb] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1550px]">
        <div className="mb-6 rounded-[30px] bg-gradient-to-r from-white via-[#faf7ff] to-[#f4efff] px-6 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-semibold text-violet-700">
                <ClipboardCheck size={14} />
                Reception Desk
              </div>

              <h2 className="text-[24px] font-bold tracking-tight text-[#1f2937] md:text-[28px]">
                Room Availability Checker
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280] md:text-[15px]">
                Check live room inventory, pricing, and available room numbers for
                guest inquiries, walk-ins, and front desk requests.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <TopInfoCard
                label="Check-In"
                value={form.checkIn || "Not selected"}
                icon={<CalendarDays size={16} />}
              />
              <TopInfoCard
                label="Check-Out"
                value={form.checkOut || "Not selected"}
                icon={<CalendarDays size={16} />}
              />
              <TopInfoCard
                label="Rooms Needed"
                value={`${form.qty} room(s)`}
                icon={<BedDouble size={16} />}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
          <section className="h-fit rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Search size={20} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-[#1f2937]">
                  Check Room Availability
                </h2>
                <p className="text-sm text-gray-500">
                  Enter stay details and get a live result instantly.
                </p>
              </div>
            </div>

            <form onSubmit={handleCheckAvailability} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2937]">
                  Room Type
                </label>
                <select
                  name="roomTypeId"
                  value={form.roomTypeId}
                  onChange={handleChange}
                  disabled={loadingRoomTypes}
                  className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcff] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-violet-700"
                >
                  {roomTypes.map((roomType) => (
                    <option key={roomType._id} value={roomType._id}>
                      {roomType.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2937]">
                  Check-In Date
                </label>
                <div className="relative">
                  <input
                    ref={checkInRef}
                    type="date"
                    name="checkIn"
                    value={form.checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcff] px-4 pr-12 py-3 text-sm text-[#1f2937] outline-none transition focus:border-violet-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (checkInRef.current?.showPicker) {
                        checkInRef.current.showPicker();
                      } else {
                        checkInRef.current?.focus();
                        checkInRef.current?.click();
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0 text-violet-600 hover:text-violet-800"
                    style={{
                        background: "transparent",
                        border: "none",
                        boxShadow: "none"
                    }}
                  >
                    <CalendarDays size={18} />
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2937]">
                  Check-Out Date
                </label>
                <div className="relative">
                  <input
                    ref={checkOutRef}
                    type="date"
                    name="checkOut"
                    value={form.checkOut}
                    min={form.checkIn || new Date().toISOString().split("T")[0]}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcff] px-4 pr-12 py-3 text-sm text-[#1f2937] outline-none transition focus:border-violet-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (checkOutRef.current?.showPicker) {
                        checkOutRef.current.showPicker();
                      } else {
                        checkOutRef.current?.focus();
                        checkOutRef.current?.click();
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0 text-violet-600 hover:text-violet-800"
                    style={{
                        background: "transparent",
                        border: "none",
                        boxShadow: "none"
                    }}
                  >
                    <CalendarDays size={18} />
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2937]">
                  Rooms Needed
                </label>
                <input
                  type="number"
                  name="qty"
                  min="1"
                  value={form.qty}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcff] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-violet-700"
                />
              </div>

              <button
                type="submit"
                disabled={checking || loadingRoomTypes}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search size={16} />
                {checking ? "Checking..." : "Check Availability"}
              </button>
            </form>
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            {!result ? (
              <div className="flex min-h-[560px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  <Hotel size={28} />
                </div>
                <h3 className="text-xl font-semibold text-[#1f2937]">
                  Availability Result
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Select a room type, dates, and quantity, then click check availability
                  to view inventory status, pricing, and available room numbers.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6 rounded-[24px] bg-gradient-to-r from-[#fcfbff] to-[#f7f2ff] p-5 ring-1 ring-[#ede9fe]">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-700">
                        Selected Room Type
                      </p>
                      <h3 className="mt-2 text-[24px] font-bold text-[#1f2937]">
                        {result.roomTypeName || selectedRoomType?.name || "-"}
                      </h3>
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                        result.canFulfill
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      <BadgeCheck size={16} />
                      {result.canFulfill
                        ? "Can Fulfill Request"
                        : "Cannot Fulfill Request"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ResultCard icon={<BedDouble size={18} />} label="Total Rooms" value={result.totalRooms} />
                  <ResultCard icon={<Clock3 size={18} />} label="Held Qty" value={result.heldQty} />
                  <ResultCard icon={<BadgeCheck size={18} />} label="Confirmed Qty" value={result.confirmedQty} />
                  <ResultCard icon={<Hotel size={18} />} label="Available Count" value={result.availableCount} />
                  <ResultCard icon={<CalendarDays size={18} />} label="Nights" value={result.nights} />
                  <ResultCard icon={<BedDouble size={18} />} label="Requested Qty" value={result.requestedQty} />
                </div>

                <div className="mt-6 rounded-[24px] bg-gradient-to-r from-[#faf7ff] to-[#f3ebff] p-5 ring-1 ring-[#ede9fe]">
                  <div className="mb-4 flex items-center gap-2 text-violet-700">
                    <CircleDollarSign size={18} />
                    <p className="text-sm font-semibold uppercase tracking-[0.14em]">
                      Price Summary
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <PriceBox
                      label="Base Price / Night"
                      value={`LKR ${Number(result.basePricePerNight || 0).toLocaleString()}`}
                    />
                    <PriceBox
                      label="Final Price / Night"
                      value={`LKR ${Number(result.finalPricePerNight || 0).toLocaleString()}`}
                    />
                    <PriceBox
                      label="Estimated Total"
                      value={`LKR ${Number(result.estimatedTotal || 0).toLocaleString()}`}
                      highlighted
                    />
                  </div>

                  <div className="mt-4 text-sm">
                    {result.discountApplied ? (
                      <span className="font-medium text-emerald-600">
                        Discount applied successfully
                      </span>
                    ) : (
                      <span className="font-medium text-gray-500">
                        No active discount applied
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[280px_1fr]">
                  <div className="rounded-[24px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
                    <div className="mb-4 flex items-center gap-2 text-violet-700">
                      <CheckCircle2 size={18} />
                      <p className="text-sm font-semibold uppercase tracking-[0.14em]">
                        Suggested Rooms
                      </p>
                    </div>

                    {result.suggestedRoomNumbers?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.suggestedRoomNumbers.map((roomNumber) => (
                          <span
                            key={roomNumber}
                            className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700"
                          >
                            Room {roomNumber}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No suggested room numbers available.
                      </p>
                    )}
                  </div>

                  <div className="rounded-[24px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
                    <div className="mb-4 flex items-center gap-2 text-violet-700">
                      <Hash size={18} />
                      <p className="text-sm font-semibold uppercase tracking-[0.14em]">
                        Available Room Numbers
                      </p>
                    </div>

                    {result.availableRooms?.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {result.availableRooms.map((room) => (
                          <div
                            key={room._id}
                            className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-[#ede9fe] transition hover:shadow-md"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700">
                                  Room Number
                                </p>
                                <p className="mt-1 text-xl font-bold text-[#1f2937]">
                                  {room.roomNumber}
                                </p>
                              </div>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  room.status === "ready"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {room.status}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                              <Building2 size={14} />
                              <span>Floor {room.floor ?? "-"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No available room numbers found for the selected dates.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function TopInfoCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-[#ede9fe]">
      <div className="mb-1.5 flex items-center gap-2 text-violet-700">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#1f2937]">{value}</p>
    </div>
  );
}

function ResultCard({ icon, label, value }) {
  return (
    <div className="rounded-[22px] bg-[#fcfbff] p-4 ring-1 ring-[#ede9fe]">
      <div className="mb-2 flex items-center gap-2 text-violet-700">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-[#1f2937]">{value}</p>
    </div>
  );
}

function PriceBox({ label, value, highlighted = false }) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        highlighted ? "bg-violet-700 text-white" : "bg-white text-[#1f2937]"
      }`}
    >
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
          highlighted ? "text-white/80" : "text-gray-400"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}

export default AvailabilityPage;