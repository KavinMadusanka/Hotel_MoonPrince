import { Link, useNavigate } from "react-router-dom";

function GuestRoomCard({ roomType, availabilityInfo }) {
  const navigate = useNavigate();

  const isAvailable =
    availabilityInfo?.available !== undefined ? availabilityInfo.available : true;

  const handleCardClick = () => {
    navigate(`/guest-rooms/${roomType._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer overflow-hidden rounded-[18px] border border-[#ececf1] bg-white shadow-[0_4px_18px_rgba(15,23,42,0.05)] transition hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
    >
      <div className="relative">
        <img
          src={
            roomType.images?.[0] ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945"
          }
          alt={roomType.name}
          className="h-[210px] w-full object-cover"
        />

        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold text-white ${
            isAvailable ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {isAvailable ? "Available" : "Fully Booked"}
        </span>
      </div>

      <div className="p-4">
        <h3 className="mb-2 line-clamp-1 text-[22px] font-semibold text-[#1f2937]">
          {roomType.name}
        </h3>

        <p className="min-h-[44px] text-[14px] leading-6 text-[#6b7280]">
          {roomType.description || "Comfortable stay with modern facilities."}
        </p>

        <div className="my-4 flex flex-wrap gap-2">
          {roomType.amenities?.slice(0, 4).map((amenity, index) => (
            <span
              key={index}
              className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] text-[#6b7280]"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#9ca3af]">
              Per Night
            </p>
            <p className="mt-1 text-[30px] font-bold leading-none text-violet-700">
              LKR {roomType.basePrice}
            </p>
          </div>

          <Link
            to={`/guest-rooms/${roomType._id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex min-w-[120px] items-center justify-center rounded-full !bg-violet-700 px-5 py-2.5 text-[13px] font-semibold !text-white no-underline transition hover:!bg-violet-800 hover:!text-white"
          >
            Reserve
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GuestRoomCard;