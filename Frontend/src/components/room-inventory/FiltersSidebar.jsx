import { CalendarDays } from "lucide-react";

function FiltersSidebar({ filters, setFilters, roomTypes, allAmenities }) {
  const handleAmenityToggle = (amenity) => {
    const exists = filters.amenities.includes(amenity);

    if (exists) {
      setFilters({
        ...filters,
        amenities: filters.amenities.filter((item) => item !== amenity)
      });
    } else {
      setFilters({
        ...filters,
        amenities: [...filters.amenities, amenity]
      });
    }
  };

  const resetFilters = () => {
    setFilters({
      maxPrice: 100000,
      roomType: "",
      amenities: [],
      checkIn: "",
      checkOut: "",
      qty: 1
    });
  };

  return (
    <aside className="h-fit rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] xl:sticky xl:top-5">
      <div className="mb-6">
        <h2 className="text-[24px] font-bold text-violet-700">Filters</h2>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-[13px] font-semibold text-[#1f2937]">
          Check-In Date
        </label>

        <div className="relative">
          <input
            type="date"
            value={filters.checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setFilters({
                ...filters,
                checkIn: e.target.value
              })
            }
            className="w-full rounded-2xl border border-[#d9dbe3] bg-white px-4 py-3 pr-12 text-sm text-[#1f2937] outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-200 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
          <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" />
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-[13px] font-semibold text-[#1f2937]">
          Check-Out Date
        </label>

        <div className="relative">
          <input
            type="date"
            value={filters.checkOut}
            min={filters.checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setFilters({
                ...filters,
                checkOut: e.target.value
              })
            }
            className="w-full rounded-2xl border border-[#d9dbe3] bg-white px-4 py-3 pr-12 text-sm text-[#1f2937] outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-200 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
          <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" />
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-[13px] font-semibold text-[#1f2937]">
          Rooms Needed
        </label>
        <input
          type="number"
          min="1"
          value={filters.qty}
          onChange={(e) =>
            setFilters({
              ...filters,
              qty: Math.max(1, Number(e.target.value) || 1)
            })
          }
          className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcff] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-violet-700"
        />
      </div>

      <div className="mb-7">
        <label className="mb-3 block text-[13px] font-semibold text-[#1f2937]">
          Max Price
        </label>

        <input
          type="range"
          min="0"
          max="150000"
          step="1000"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#ddd6fe] accent-violet-700"
        />

        <div className="mt-2 flex items-center justify-between text-[12px] text-[#8b8b97]">
          <span>LKR 0</span>
          <span>LKR {filters.maxPrice}</span>
        </div>
      </div>

      <div className="mb-7">
        <label className="mb-3 block text-[13px] font-semibold text-[#1f2937]">
          Room Type
        </label>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setFilters({ ...filters, roomType: "" })}
            className={`w-full rounded-2xl !border px-4 py-3 text-left text-[14px] font-semibold transition ${
              !filters.roomType
                ? "!border-violet-700 !bg-violet-700 !text-white hover:!bg-violet-800"
                : "!border-[#e5e7eb] !bg-white !text-black hover:!border-violet-200 hover:!bg-[#faf7ff]"
            }`}
          >
            All Room Types
          </button>

          {roomTypes.map((type) => (
            <button
              type="button"
              key={type._id}
              onClick={() => setFilters({ ...filters, roomType: type._id })}
              className={`w-full rounded-2xl !border px-4 py-3 text-left text-[14px] font-semibold transition ${
                filters.roomType === type._id
                  ? "!border-violet-700 !bg-violet-700 !text-white hover:!bg-violet-800"
                  : "!border-[#e5e7eb] !bg-white !text-black hover:!border-violet-200 hover:!bg-[#faf7ff]"
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <label className="mb-3 block text-[13px] font-semibold text-[#1f2937]">
          Amenities
        </label>

        <div className="flex flex-col gap-2.5">
          {allAmenities.map((amenity, index) => (
            <label
              key={index}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1 text-[13px] text-gray-700 hover:bg-[#faf7ff]"
            >
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="h-4 w-4 accent-violet-700"
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full rounded-2xl !border !border-violet-700 !bg-violet-700 px-4 py-3 text-[14px] font-semibold !text-white transition hover:!bg-violet-800"
      >
        Reset Filters
      </button>
    </aside>
  );
}

export default FiltersSidebar;