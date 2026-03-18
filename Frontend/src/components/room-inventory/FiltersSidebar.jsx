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
    <aside className="h-fit rounded-[26px] bg-[#ffffffde] p-4 lg:sticky lg:top-5">
      <h2 className="mb-6 text-[18px] font-semibold text-violet-700">Filters</h2>

      <div className="mb-7">
        <label className="mb-3 block text-[13px] font-semibold text-[#1f2937]">
          Max Price
        </label>

        <input
          type="range"
          min="0"
          max="100000"
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
      className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-left !text-[14px] font-medium shadow-none transition ${
        !filters.roomType
          ? "border-0 !bg-violet-700 !text-white hover:!bg-violet-800"
          : "border-0 !bg-transparent !text-[#1f2937] hover:!bg-white"
      }`}
    >
      <span>All Room Types</span>
    </button>

    {roomTypes.map((type) => (
      <button
        type="button"
        key={type._id}
        onClick={() => setFilters({ ...filters, roomType: type._id })}
        className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-left !text-[14px] font-medium shadow-none transition ${
          filters.roomType === type._id
            ? "border-0 !bg-violet-700 !text-white hover:!bg-violet-800"
            : "border-0 !bg-transparent !text-[#1f2937] hover:!bg-white"
        }`}
      >
        <span>{type.name}</span>
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
              className="flex items-center gap-2.5 text-[13px] text-gray-700"
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
  className="w-full rounded-full border-0 !bg-violet-700 px-4 py-3 text-[13px] font-semibold !text-white shadow-none transition hover:!bg-violet-800"
>
  Reset All Filters
</button>
    </aside>
  );
}

export default FiltersSidebar;