import { useEffect, useMemo, useState } from "react";
import FiltersSidebar from "../../../components/room-inventory/FiltersSidebar";
import GuestRoomCard from "../../../components/room-inventory/GuestRoomCard";
import { ChevronDown, CalendarDays, BedDouble } from "lucide-react";
import { getAvailability, getRoomTypes } from "../../../apiService/roomService";
import Layout from "../../../layouts/Layout.jsx";

function GuestRoomsPage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [sortBy, setSortBy] = useState("priceLowHigh");

  const [filters, setFilters] = useState({
    maxPrice: 100000,
    roomType: "",
    amenities: [],
    checkIn: "",
    checkOut: "",
    qty: 1
  });

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await getRoomTypes();
        setRoomTypes(res.data || []);
      } catch (error) {
        console.error("Failed to fetch room types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomTypes();
  }, []);

  useEffect(() => {
    const fetchAvailabilityForAll = async () => {
      if (!filters.checkIn || !filters.checkOut || roomTypes.length === 0) {
        setAvailabilityMap({});
        return;
      }

      try {
        setAvailabilityLoading(true);

        const responses = await Promise.all(
          roomTypes.map(async (roomType) => {
            try {
              const res = await getAvailability({
                roomTypeId: roomType._id,
                checkIn: filters.checkIn,
                checkOut: filters.checkOut,
                qty: filters.qty
              });

              return {
                roomTypeId: roomType._id,
                data: res.data
              };
            } catch (error) {
              console.error(`Availability fetch failed for ${roomType.name}`, error);
              return {
                roomTypeId: roomType._id,
                data: null
              };
            }
          })
        );

        const nextMap = {};
        responses.forEach((item) => {
          nextMap[item.roomTypeId] = item.data;
        });

        setAvailabilityMap(nextMap);
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchAvailabilityForAll();
  }, [roomTypes, filters.checkIn, filters.checkOut, filters.qty]);

  const allAmenities = useMemo(() => {
    const set = new Set();

    roomTypes.forEach((room) => {
      room.amenities?.forEach((item) => set.add(item));
    });

    return Array.from(set);
  }, [roomTypes]);

  const filteredRoomTypes = useMemo(() => {
    let filtered = roomTypes.filter((room) => {
      const liveInfo = availabilityMap[room._id];
      const displayPrice = liveInfo?.finalPricePerNight ?? room.basePrice ?? 0;

      const matchesPrice = Number(displayPrice) <= filters.maxPrice;
      const matchesType = !filters.roomType || room._id === filters.roomType;
      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((amenity) => room.amenities?.includes(amenity));

      return matchesPrice && matchesType && matchesAmenities;
    });

    if (sortBy === "priceLowHigh") {
      filtered = [...filtered].sort((a, b) => {
        const aPrice = availabilityMap[a._id]?.finalPricePerNight ?? a.basePrice ?? 0;
        const bPrice = availabilityMap[b._id]?.finalPricePerNight ?? b.basePrice ?? 0;
        return Number(aPrice) - Number(bPrice);
      });
    } else if (sortBy === "priceHighLow") {
      filtered = [...filtered].sort((a, b) => {
        const aPrice = availabilityMap[a._id]?.finalPricePerNight ?? a.basePrice ?? 0;
        const bPrice = availabilityMap[b._id]?.finalPricePerNight ?? b.basePrice ?? 0;
        return Number(bPrice) - Number(aPrice);
      });
    } else if (sortBy === "nameAZ") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [roomTypes, availabilityMap, filters, sortBy]);

  return (
    <Layout>
    <div className="min-h-screen w-full bg-[#f8f7fc] px-4 pb-6 pt-24 md:px-6 md:pt-20">
      <div className="mx-auto max-w-[1520px]">
        <div className="mb-5 rounded-[28px] bg-gradient-to-r from-[#ffffff] via-[#faf7ff] to-[#f5efff] px-6 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] md:px-8 md:py-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <h2 className="text-[24px] font-bold leading-tight text-[#1f2937] md:text-[30px]">
                Find Your Perfect Stay
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
                Browse room categories, compare prices, and view available rooms in one place.
              </p>

              <div className="mt-4">
                <h2 className="text-[20px] font-bold text-[#1f2937]">
                  Available Rooms
                </h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  {filteredRoomTypes.length} room categories available
                  {availabilityLoading ? " • Checking availability..." : ""}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-[#ede9fe]">
                  <div className="mb-1.5 flex items-center gap-2 text-violet-700">
                    <CalendarDays size={15} />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Check-In
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1f2937]">
                    {filters.checkIn || "Not selected"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-[#ede9fe]">
                  <div className="mb-1.5 flex items-center gap-2 text-violet-700">
                    <CalendarDays size={15} />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Check-Out
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1f2937]">
                    {filters.checkOut || "Not selected"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-[#ede9fe]">
                  <div className="mb-1.5 flex items-center gap-2 text-violet-700">
                    <BedDouble size={15} />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Rooms
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1f2937]">
                    {filters.qty} room(s)
                  </p>
                </div>
              </div>

              <div className="relative sm:min-w-[190px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-[#ddd6fe] bg-[#faf7ff] py-3 pl-4 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-violet-700"
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
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_1fr]">
          <FiltersSidebar
            filters={filters}
            setFilters={setFilters}
            roomTypes={roomTypes}
            allAmenities={allAmenities}
          />

          <main className="min-w-0">
            {loading ? (
              <div className="rounded-[24px] bg-white p-10 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-violet-100" />
                <p className="text-sm font-medium text-gray-500">
                  Loading room categories...
                </p>
              </div>
            ) : filteredRoomTypes.length === 0 ? (
              <div className="rounded-[24px] bg-white p-10 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                <h3 className="text-lg font-semibold text-[#1f2937]">
                  No rooms found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try changing your filters or selecting different dates.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 justify-items-start">
                {filteredRoomTypes.map((roomType) => (
                  <GuestRoomCard
                    key={roomType._id}
                    roomType={roomType}
                    availabilityInfo={availabilityMap[roomType._id]}
                    bookingFilters={filters}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
    </Layout>
  );
}

export default GuestRoomsPage;