import { useMemo, useState } from "react";
import AdminPageLayout from "../../../layouts/AdminPageLayout";
import { createRoomType } from "../../../apiService/roomService";
import {
  BedDouble,
  Images,
  Tag,
  Percent,
  Save,
  UploadCloud,
  CheckCircle2,
  FileText,
  Users,
  StickyNote,
  CircleDollarSign,
  Hotel,
  Trash2
} from "lucide-react";

function AddRoomTypePage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    maxGuests: "",
    bedType: "",
    amenities: "",
    basePrice: "",
    discountActive: false,
    discountType: "PERCENT",
    discountValue: 0
  });

  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const previewUrls = useMemo(() => {
    return images.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
  }, [images]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("maxGuests", form.maxGuests);
      formData.append("bedType", form.bedType);
      formData.append("amenities", form.amenities);
      formData.append("basePrice", form.basePrice);
      formData.append("discountActive", form.discountActive);
      formData.append("discountType", form.discountType);
      formData.append("discountValue", form.discountValue);

      images.forEach((file) => {
        formData.append("images", file);
      });

      await createRoomType(formData);

      setMessage("Room type created successfully.");

      setForm({
        name: "",
        description: "",
        maxGuests: "",
        bedType: "",
        amenities: "",
        basePrice: "",
        discountActive: false,
        discountType: "PERCENT",
        discountValue: 0
      });
      setImages([]);
    } catch (error) {
      console.error(error);
      setMessage(error?.response?.data?.message || "Failed to create room type");
    } finally {
      setSubmitting(false);
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
              Add New Room Type
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6b7280]">
              Create a new room category with pricing, amenities, discount
              options, and image uploads for the guest-facing booking pages.
            </p>
          </div>

          <div className="rounded-2xl bg-[#faf7ff] px-4 py-3 text-sm text-gray-600">
            <p className="m-0 font-semibold text-violet-700">Room Type Setup</p>
            <p className="mt-1 text-xs text-gray-500">
              Fill all essential details carefully before saving.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <FileText size={20} />
              </span>
              <div>
                <h2 className="m-0 text-lg font-semibold text-[#1f2430]">
                  Basic Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the main details for this room category.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                icon={<BedDouble size={18} />}
                label="Room Type Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Deluxe Ocean Suite"
                required
              />

              <InputField
                icon={<Users size={18} />}
                label="Max Guests"
                name="maxGuests"
                type="number"
                value={form.maxGuests}
                onChange={handleChange}
                placeholder="2"
                required
              />

              <InputField
                icon={<BedDouble size={18} />}
                label="Bed Type"
                name="bedType"
                value={form.bedType}
                onChange={handleChange}
                placeholder="King / Queen / Twin"
              />

              <InputField
                icon={<CircleDollarSign size={18} />}
                label="Base Price (LKR)"
                name="basePrice"
                type="number"
                value={form.basePrice}
                onChange={handleChange}
                placeholder="12000"
                required
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-[#374151]">
                Description
              </label>
              <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-700">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Write a short description about the room type..."
                  rows={4}
                  className="w-full resize-none border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <StickyNote size={20} />
              </span>
              <div>
                <h2 className="m-0 text-lg font-semibold text-[#1f2430]">
                  Amenities & Features
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add guest-visible facilities separated by commas.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#374151]">
                Amenities
              </label>
              <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-700">
                <textarea
                  name="amenities"
                  value={form.amenities}
                  onChange={handleChange}
                  placeholder="WiFi, Air Conditioning, Smart TV, Mini Bar, Balcony"
                  rows={3}
                  className="w-full resize-none border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Example: WiFi, AC, TV, Mini Bar, Ocean View
              </p>
            </div>
          </section>

          <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Percent size={20} />
              </span>
              <div>
                <h2 className="m-0 text-lg font-semibold text-[#1f2430]">
                  Discount Configuration
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure optional discounts for this room type.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3">
                <label className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                  <input
                    type="checkbox"
                    name="discountActive"
                    checked={form.discountActive}
                    onChange={handleChange}
                    className="h-4 w-4 accent-violet-700"
                  />
                  Discount Active
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#374151]">
                  Discount Type
                </label>
                <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3">
                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleChange}
                    className="w-full border-none bg-transparent text-sm text-[#1f2430] outline-none"
                  >
                    <option value="PERCENT">PERCENT</option>
                    <option value="FIXED">FIXED</option>
                  </select>
                </div>
              </div>

              <InputField
                icon={<Tag size={18} />}
                label="Discount Value"
                name="discountValue"
                type="number"
                value={form.discountValue}
                onChange={handleChange}
                placeholder="10"
              />
            </div>
          </section>

          <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Images size={20} />
              </span>
              <div>
                <h2 className="m-0 text-lg font-semibold text-[#1f2430]">
                  Room Type Images
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Upload high-quality images to show this room category to guests.
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border-2 border-dashed border-violet-200 bg-white p-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <UploadCloud size={24} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-[#1f2430]">
                Upload Images
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                PNG, JPG, JPEG or WEBP. You can upload multiple images.
              </p>

              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800">
                <UploadCloud size={16} />
                Choose Files
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {previewUrls.length > 0 && (
              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1f2430]">
                  <CheckCircle2 size={16} className="text-violet-700" />
                  Selected Images ({previewUrls.length})
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {previewUrls.map((item, index) => (
                    <div
                      key={`${item.file.name}-${index}`}
                      className="overflow-hidden rounded-[22px] border border-[#ece7ff] bg-white shadow-sm"
                    >
                      <img
                        src={item.url}
                        alt={item.file.name}
                        className="h-44 w-full object-cover"
                      />
                      <div className="p-3">
                        <p className="truncate text-sm font-medium text-[#1f2430]">
                          {item.file.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {(item.file.size / 1024).toFixed(1)} KB
                        </p>

                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            title="Remove image"
                            className="border-none !bg-transparent p-0 text-red-500 shadow-none hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {message && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                message.toLowerCase().includes("successfully")
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col gap-3 rounded-[26px] bg-[#fffdf7] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="m-0 text-base font-semibold text-[#1f2430]">
                Ready to save this room type?
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Double-check the details, pricing, discount, and uploaded images
                before saving.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={17} />
              {submitting ? "Saving..." : "Save Room Type"}
            </button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
}

function InputField({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#374151]">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-700">
        <span className="text-violet-700">{icon}</span>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

export default AddRoomTypePage;