import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoomTypeById } from "../../../apiService/roomService";
import {
  BedDouble,
  Users,
  FileText,
  CircleDollarSign,
  BadgeCheck,
  StickyNote
} from "lucide-react";

function RoomDetailsPage() {
  const { id } = useParams();
  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const images = useMemo(() => {
    if (!roomType?.images || roomType.images.length === 0) {
      return [
        "https://via.placeholder.com/800x600?text=No+Image",
        "https://via.placeholder.com/400x300?text=No+Image",
        "https://via.placeholder.com/400x300?text=No+Image",
        "https://via.placeholder.com/400x300?text=No+Image"
      ];
    }

    const filled = [...roomType.images];
    while (filled.length < 4) {
      filled.push(filled[0]);
    }
    return filled.slice(0, 4);
  }, [roomType]);

  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-[#f7f6fb] px-4 py-6 md:px-6">
        <div className="mx-auto max-w-7xl rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-sm text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!roomType) {
    return (
      <div className="w-screen min-h-screen bg-[#f7f6fb] px-4 py-6 md:px-6">
        <div className="mx-auto max-w-7xl rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-sm text-red-500">Room not found.</p>
        </div>
      </div>
    );
  }

  const amenities = roomType.amenities || [];
  const price = roomType.basePrice || 0;

  return (
    <div className="w-screen min-h-screen bg-[#f7f6fb] px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl rounded-[30px] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.8fr]">
          <div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.45fr_1fr]">
              <div>
                <img
                  src={images[0]}
                  alt={roomType.name || "Room"}
                  className="h-[360px] w-full rounded-[24px] object-cover md:h-[460px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
                <img
                  src={images[1]}
                  alt="Room"
                  className="h-[220px] w-full rounded-[20px] object-cover"
                />
                <img
                  src={images[2]}
                  alt="Room"
                  className="h-[220px] w-full rounded-[20px] object-cover"
                />
                <img
                  src={images[3]}
                  alt="Room"
                  className="col-span-2 h-[220px] w-full rounded-[20px] object-cover"
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-[13px] tracking-wide text-[#d4a514]">
                  ★★★★★
                </span>
                <span className="text-xs text-gray-400">Room category</span>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="m-0 !text-[28px] font-semibold leading-tight text-[#1f2430] md:!text-[34px]">
                    {roomType.name}
                  </h1>
                  <p className="mt-2 max-w-3xl text-[14px] leading-6 text-[#6b7280] md:text-[15px]">
                    {roomType.description ||
                      "A beautifully designed room with elegant comfort and premium facilities for a memorable stay."}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf7ff] px-4 py-3 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-500">
                    Exclusive Rate
                  </p>
                  <p className="mt-1 text-[30px] font-bold leading-none text-[#d4a514]">
                    LKR {price}
                    <span className="ml-1 text-sm font-medium text-gray-400">
                      / night
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-[18px] font-semibold text-[#1f2430]">
                Room Details
              </h2>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                <DetailMiniCard
                  icon={<FileText size={18} />}
                  title="Category"
                  value={roomType.name || "N/A"}
                />
                <DetailMiniCard
                  icon={<Users size={18} />}
                  title="Guests"
                  value={roomType.maxGuests || "N/A"}
                />
                <DetailMiniCard
                  icon={<BedDouble size={18} />}
                  title="Bed Type"
                  value={roomType.bedType || "N/A"}
                />
                <DetailMiniCard
                  icon={<CircleDollarSign size={18} />}
                  title="Price"
                  value={`LKR ${roomType.basePrice || 0}`}
                />
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-[18px] font-semibold text-[#1f2430]">
                World-Class Amenities
              </h2>

              {amenities.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-2xl bg-[#faf7ff] px-4 py-3 text-sm text-[#4b5563]"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                        <BadgeCheck size={16} />
                      </span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#faf7ff] px-4 py-4 text-sm text-gray-500">
                  No amenities available.
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-[18px] font-semibold text-[#1f2430]">
                Additional Notes
              </h2>

              <div className="rounded-[24px] bg-[#fbfbfd] p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    <StickyNote size={18} />
                  </span>
                  <p className="m-0 text-[14px] leading-7 text-[#6b7280]">
                    Premium room category with elegant interior styling and a comfortable stay experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-5 rounded-[28px] bg-[#fffdf7] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-[30px] font-bold leading-none text-[#1f2430]">
                    LKR {price}
                    <span className="ml-1 text-sm font-medium text-gray-400">
                      / night
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[13px] font-semibold text-[#d4a514]">
                  <span>★</span>
                  <span>5.0</span>
                </div>
              </div>

              <div className="space-y-3 rounded-[22px] bg-white p-4">
                <SummaryRow label="Room Type" value={roomType.name || "N/A"} />
                <SummaryRow label="Guests" value={roomType.maxGuests || "N/A"} />
                <SummaryRow label="Bed Type" value={roomType.bedType || "N/A"} />
                <SummaryRow label="Base Price" value={`LKR ${price}`} />
              </div>

              <div className="mt-5 rounded-[22px] bg-white p-4">
                <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
                  <span>LKR {price} × 5 nights</span>
                  <span>LKR {price * 5}</span>
                </div>

                <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
                  <span>Cleaning fee</span>
                  <span>LKR 120</span>
                </div>

                <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
                  <span>Luxury tax (12%)</span>
                  <span>LKR {Math.round((price * 5 + 120) * 0.12)}</span>
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
                  <span className="text-[16px] font-semibold text-[#1f2430]">
                    Total
                  </span>
                  <span className="text-[22px] font-bold text-[#1f2430]">
                    LKR {price * 5 + 120 + Math.round((price * 5 + 120) * 0.12)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-full !bg-violet-700 px-4 py-3.5 text-sm font-semibold !text-white shadow-none transition hover:!bg-violet-800"
              >
                Reserve Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailMiniCard({ icon, title, value }) {
  return (
    <div className="rounded-[22px] bg-[#faf7ff] p-4">
      <div className="mb-2 text-violet-700">{icon}</div>
      <p className="m-0 text-[11px] uppercase tracking-[0.12em] text-gray-400">
        {title}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#1f2430]">{value}</p>
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

export default RoomDetailsPage;