import { useEffect, useMemo, useState } from "react";
import FiltersSidebar from "../../../components/room-inventory/FiltersSidebar";
import GuestRoomCard from "../../../components/room-inventory/GuestRoomCard";
import { ChevronDown } from "lucide-react";
import { getRoomTypes } from "../../../apiService/roomService";

function GuestRoomsPage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [availabilityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("priceLowHigh");

  const [filters, setFilters] = useState({
    maxPrice: 100000,
    roomType: "",
    amenities: [],
    checkIn: "",
    checkOut: "",
    qty: 1
  });

  const fetchRoomTypes = async () => {
    try {
      const res = await getRoomTypes();
      setRoomTypes(res.data);
    } catch (error) {
      console.error("Failed to fetch room types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const allAmenities = useMemo(() => {
    const set = new Set();

    roomTypes.forEach((room) => {
      room.amenities?.forEach((item) => set.add(item));
    });

    return Array.from(set);
  }, [roomTypes]);

  const filteredRoomTypes = useMemo(() => {
    let filtered = roomTypes.filter((room) => {
      const matchesPrice = Number(room.basePrice || 0) <= filters.maxPrice;
      const matchesType = !filters.roomType || room._id === filters.roomType;
      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((amenity) => room.amenities?.includes(amenity));

      return matchesPrice && matchesType && matchesAmenities;
    });

    if (sortBy === "priceLowHigh") {
      filtered = [...filtered].sort(
        (a, b) => Number(a.basePrice || 0) - Number(b.basePrice || 0)
      );
    } else if (sortBy === "priceHighLow") {
      filtered = [...filtered].sort(
        (a, b) => Number(b.basePrice || 0) - Number(a.basePrice || 0)
      );
    } else if (sortBy === "nameAZ") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [roomTypes, filters, sortBy]);

  return (
    <div className="w-screen min-h-screen bg-[#f5f5f7] px-4 py-5 md:px-6">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-5 xl:grid-cols-[250px_1fr]">
        <FiltersSidebar
          filters={filters}
          setFilters={setFilters}
          roomTypes={roomTypes}
          allAmenities={allAmenities}
        />

        <main className="min-w-0">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="m-0 !text-[20px] font-bold !leading-tight text-[#1f2937] md:!text-[24px]">
                Available Rooms
              </h1>
              <p className="mt-2 text-[13px] text-[#6b7280]">
                {filteredRoomTypes.length} room categories available for browsing
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-xl border border-[#d1d5db] bg-white py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:border-violet-700"
                >
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="nameAZ">Name: A to Z</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-sm text-gray-600">
              Loading rooms...
            </div>
          ) : filteredRoomTypes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              No room categories match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3">
              {filteredRoomTypes.map((roomType) => (
                <GuestRoomCard
                  key={roomType._id}
                  roomType={roomType}
                  availabilityInfo={availabilityMap[roomType._id]}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default GuestRoomsPage;