import { Link, useNavigate } from "react-router-dom";
import { Users, BedDouble, Sparkles } from "lucide-react";

function GuestRoomCard({ roomType, availabilityInfo, bookingFilters }) {
  const navigate = useNavigate();

  const hasSearchDates = bookingFilters?.checkIn && bookingFilters?.checkOut;
  const canFulfill =
    availabilityInfo?.canFulfill !== undefined ? availabilityInfo.canFulfill : true;
  const availableCount = availabilityInfo?.availableCount ?? null;
  const finalPricePerNight =
    availabilityInfo?.finalPricePerNight ?? roomType.basePrice;
  const discountApplied = availabilityInfo?.discountApplied ?? false;

  const handleCardClick = () => {
    navigate(`/guest-rooms/${roomType._id}`, {
      state: {
        checkIn: bookingFilters?.checkIn || "",
        checkOut: bookingFilters?.checkOut || "",
        qty: bookingFilters?.qty || 1
      }
    });
  };

  const getAvailabilityLabel = () => {
    if (!hasSearchDates) return "View details";
    if (!canFulfill) return "Unavailable";
    if (availableCount === 0) return "Fully booked";
    if (availableCount === 1) return "Only 1 left";
    return `${availableCount} available`;
  };

  const getAvailabilityBadgeClasses = () => {
    if (!hasSearchDates) return "bg-slate-800";
    if (!canFulfill) return "bg-red-500";
    return "bg-emerald-500";
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden rounded-[18px] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.09)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={
            roomType.images?.[0] ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945"
          }
          alt={roomType.name}
          className="h-[155px] w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold text-white shadow-md ${getAvailabilityBadgeClasses()}`}
        >
          {getAvailabilityLabel()}
        </span>
      </div>

      <div className="p-3.5">
        <div className="mb-2.5">
          <h3 className="line-clamp-1 text-[18px] font-bold leading-tight text-[#1f2937]">
            {roomType.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#6b7280]">
            {roomType.description || "Comfortable stay with modern facilities."}
          </p>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {roomType.amenities?.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[10px] font-medium text-[#6b7280]"
            >
              {amenity}
            </span>
          ))}
        </div>


        <div className="rounded-[16px] bg-gradient-to-br from-[#faf7ff] to-[#f4edff] p-3 ring-1 ring-[#ece7ff]">
          <div className="flex items-center gap-2 text-violet-700">
            <Sparkles size={13} />
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em]">
              Per Night
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-[22px] font-bold leading-none text-violet-700">
              LKR {Number(finalPricePerNight || 0).toLocaleString()}
            </p>

            {discountApplied &&
              Number(roomType.basePrice) > Number(finalPricePerNight) && (
                <p className="text-[11px] text-gray-400 line-through">
                  LKR {Number(roomType.basePrice || 0).toLocaleString()}
                </p>
              )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-[10px] font-medium">
            {hasSearchDates ? (
              canFulfill ? (
                <span className="text-emerald-600">Available</span>
              ) : (
                <span className="text-red-600">Unavailable</span>
              )
            ) : (
              <span className="text-slate-500">Select dates</span>
            )}
          </div>

          <Link
            to={`/guest-rooms/${roomType._id}`}
            state={{
              checkIn: bookingFilters?.checkIn || "",
              checkOut: bookingFilters?.checkOut || "",
              qty: bookingFilters?.qty || 1
            }}
            onClick={(e) => e.stopPropagation()}
            className={`inline-flex min-w-[105px] items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold no-underline transition ${
              hasSearchDates && !canFulfill
                ? "pointer-events-none bg-gray-300 !text-white"
                : "bg-violet-700 !text-white hover:bg-violet-800 hover:!text-white"
            }`}
          >
            {hasSearchDates && !canFulfill ? "Unavailable" : "Reserve"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GuestRoomCard;