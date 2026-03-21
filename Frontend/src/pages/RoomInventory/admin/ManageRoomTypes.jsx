import { useEffect, useMemo, useState } from "react";
import AdminPageLayout from "../../../layouts/AdminPageLayout";
import {
  getRoomTypes,
  updateRoomType,
  deleteRoomType
} from "../../../apiService/roomService";
import {
  BedDouble,
  Users,
  CircleDollarSign,
  ImageOff,
  X,
  Trash2,
  Save,
  UploadCloud,
  Percent,
  Hotel,
  FileText,
  StickyNote,
  Tag,
  CheckCircle2,
  Images
} from "lucide-react";

function ManageRoomTypes() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editForm, setEditForm] = useState({
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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const fetchRoomTypes = async () => {
    try {
      const res = await getRoomTypes();
      setRoomTypes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load room types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const openModal = (roomType) => {
    setSelectedRoomType(roomType);

    setEditForm({
      name: roomType?.name ?? "",
      description: roomType?.description ?? "",
      maxGuests: roomType?.maxGuests ?? "",
      bedType: roomType?.bedType ?? "",
      amenities: Array.isArray(roomType?.amenities)
        ? roomType.amenities.join(", ")
        : roomType?.amenities ?? "",
      basePrice: roomType?.basePrice ?? "",
      discountActive: roomType?.discountActive ?? false,
      discountType: roomType?.discountType ?? "PERCENT",
      discountValue: roomType?.discountValue ?? 0
    });

    setExistingImages(Array.isArray(roomType?.images) ? roomType.images : []);
    setNewImages([]);
    setShowDeleteConfirm(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRoomType(null);
    setIsModalOpen(false);
    setExistingImages([]);
    setNewImages([]);
    setShowDeleteConfirm(false);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const previewUrls = useMemo(() => {
    return newImages.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
  }, [newImages]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewUrls]);

  const showTemporaryMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleUpdate = async () => {
    if (!selectedRoomType) return;

    try {
      setSubmitting(true);

      const formData = new FormData();

      const amenitiesArray = editForm.amenities
        ? editForm.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("maxGuests", Number(editForm.maxGuests));
      formData.append("bedType", editForm.bedType);
      formData.append("amenities", JSON.stringify(amenitiesArray));
      formData.append("basePrice", Number(editForm.basePrice));
      formData.append("discountActive", String(editForm.discountActive));
      formData.append("discountType", editForm.discountType);
      formData.append("discountValue", Number(editForm.discountValue));
      formData.append("existingImages", JSON.stringify(existingImages));

      newImages.forEach((file) => {
        formData.append("images", file);
      });

      const res = await updateRoomType(selectedRoomType._id, formData);

      const updatedRoomType = res.data.roomType || res.data;

      setRoomTypes((prev) =>
        prev.map((item) =>
          item._id === selectedRoomType._id ? updatedRoomType : item
        )
      );

      showTemporaryMessage(res.data.message || "Room type updated successfully");
      closeModal();
    } catch (error) {
      console.error(error);
      showTemporaryMessage(
        error?.response?.data?.message || "Failed to update room type"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteRoomType = async () => {
    if (!selectedRoomType) return;

    try {
      setSubmitting(true);

      const res = await deleteRoomType(selectedRoomType._id);

      setRoomTypes((prev) =>
        prev.filter((item) => item._id !== selectedRoomType._id)
      );

      closeModal();
      showTemporaryMessage(res.data.message || "Room type deleted successfully");
    } catch (error) {
      console.error(error);
      showTemporaryMessage(
        error?.response?.data?.message || "Failed to delete room type"
      );
    } finally {
      setSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <AdminPageLayout>
      <style>{`
        .room-action-btn,
        .room-close-btn {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
        }

        .room-action-btn svg,
        .room-close-btn svg {
          background: transparent !important;
          background-color: transparent !important;
          fill: none;
        }
      `}</style>

      <div className="rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              <Hotel size={14} />
              Admin Panel
            </div>

            <h2 className="m-0 text-[20px] font-bold leading-tight text-[#1f2430] md:text-[24px]">
              Room Types
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6b7280]">
              View and manage all created room categories, pricing details,
              amenities, and discounts.
            </p>
          </div>

          <div className="rounded-2xl bg-[#faf7ff] px-4 py-3 text-sm text-gray-600">
            <p className="m-0 font-semibold text-violet-700">Total Room Types</p>
            <p className="mt-1 text-xs text-gray-500">
              {roomTypes.length} categories available
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-5 rounded-2xl px-4 py-3 text-sm font-medium ${
              message.toLowerCase().includes("successfully")
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-[26px] bg-[#fcfbff] p-6 ring-1 ring-[#ede9fe] text-sm text-gray-500">
            Loading room types...
          </div>
        ) : roomTypes.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-[#ddd6fe] bg-[#fcfbff] p-8 text-center text-gray-500">
            No room types found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {roomTypes.map((roomType) => (
              <button
                key={roomType._id}
                type="button"
                onClick={() => openModal(roomType)}
                className="overflow-hidden rounded-[26px] border border-[#ece7ff] !bg-white text-left shadow-[0_8px_25px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)]"
              >
                <div className="relative bg-white">
                  {roomType.images && roomType.images.length > 0 ? (
                    <img
                      src={roomType.images[0]}
                      alt={roomType.name}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center bg-[#f9fafb] text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <ImageOff size={28} />
                        <span className="text-sm">No image available</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1f2430] shadow-sm">
                    {roomType.name}
                  </div>
                </div>

                <div className="bg-white p-5">
                  <h3 className="m-0 text-lg font-semibold text-[#1f2430]">
                    {roomType.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6b7280]">
                    {roomType.description || "No description available."}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <MiniInfoCard
                      icon={<Users size={16} />}
                      label="Guests"
                      value={roomType.maxGuests || "N/A"}
                    />
                    <MiniInfoCard
                      icon={<BedDouble size={16} />}
                      label="Bed Type"
                      value={roomType.bedType || "N/A"}
                    />
                    <MiniInfoCard
                      icon={<CircleDollarSign size={16} />}
                      label="Base Price"
                      value={`LKR ${roomType.basePrice || 0}`}
                    />
                    <MiniInfoCard
                      icon={<Percent size={16} />}
                      label="Discount"
                      value={
                        roomType.discountActive
                          ? `${roomType.discountType} ${roomType.discountValue}`
                          : "No discount"
                      }
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedRoomType && (
        <RoomTypeModal
          roomType={selectedRoomType}
          editForm={editForm}
          existingImages={existingImages}
          handleEditChange={handleEditChange}
          handleUpdate={handleUpdate}
          handleDelete={() => setShowDeleteConfirm(true)}
          closeModal={closeModal}
          handleImageChange={handleImageChange}
          handleRemoveExistingImage={handleRemoveExistingImage}
          handleRemoveNewImage={handleRemoveNewImage}
          previewUrls={previewUrls}
          submitting={submitting}
        />
      )}

      {showDeleteConfirm && selectedRoomType && (
        <ConfirmDeleteModal
          title="Delete Room Type"
          message={`Are you sure you want to delete "${selectedRoomType.name}"? This action cannot be undone.`}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDeleteRoomType}
          loading={submitting}
        />
      )}
    </AdminPageLayout>
  );
}

function RoomTypeModal({
  roomType,
  editForm,
  existingImages,
  handleEditChange,
  handleUpdate,
  handleDelete,
  closeModal,
  handleImageChange,
  handleRemoveExistingImage,
  handleRemoveNewImage,
  previewUrls,
  submitting
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div>
            <h3 className="text-xl font-bold text-[#1f2430]">Edit Room Type</h3>
            <p className="text-sm text-gray-500">
              Update room type details, pricing, amenities, and images
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="room-close-btn rounded-full border border-gray-200 p-2 text-gray-500 shadow-sm transition hover:bg-gray-100 hover:text-gray-800"
            style={{
              backgroundColor: "#ffffff",
              backgroundImage: "none",
              appearance: "none",
              WebkitAppearance: "none"
            }}
          >
            <X size={20} style={{ background: "transparent" }} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="grid gap-6">
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
                      Manage existing images and upload new ones.
                    </p>
                  </div>
                </div>

                <p className="mb-3 text-sm font-semibold text-[#374151]">
                  Existing Images
                </p>

                {existingImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {existingImages.map((img, index) => (
                      <div
                        key={`${img}-${index}`}
                        className="relative overflow-hidden rounded-[20px] border border-[#ece7ff] bg-white"
                      >
                        <img
                          src={img}
                          alt={`${roomType.name}-${index}`}
                          className="h-44 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="room-action-btn absolute right-2 top-2 border-none !bg-transparent p-0 text-red-500 shadow-none hover:text-red-600"
                          title="Remove existing image"
                        >
                          <Trash2 size={16} style={{ background: "transparent" }} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-52 items-center justify-center rounded-[24px] border border-[#ece7ff] bg-white text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ImageOff size={28} />
                      <span className="text-sm">No existing images</span>
                    </div>
                  </div>
                )}

                <div className="mt-5 rounded-[24px] border-2 border-dashed border-violet-200 bg-white p-5 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <UploadCloud size={24} />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-[#1f2430]">
                    Add New Images
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

                  <p className="mt-3 text-xs text-gray-500">
                    Newly added images will be saved together with the remaining
                    old images.
                  </p>
                </div>

                {previewUrls.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1f2430]">
                      <CheckCircle2 size={16} className="text-violet-700" />
                      New Selected Images ({previewUrls.length})
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {previewUrls.map((item, index) => (
                        <div
                          key={`${item.file.name}-${index}`}
                          className="overflow-hidden rounded-[20px] border border-[#ece7ff] bg-white"
                        >
                          <div className="relative">
                            <img
                              src={item.url}
                              alt={item.file.name}
                              className="h-44 w-full object-cover"
                            />

                            <button
                              type="button"
                              onClick={() => handleRemoveNewImage(index)}
                              className="room-action-btn absolute right-2 top-2 border-none !bg-transparent p-0 text-red-500 shadow-none hover:text-red-600"
                              title="Remove new image"
                            >
                              <Trash2
                                size={16}
                                style={{ background: "transparent" }}
                              />
                            </button>
                          </div>

                          <div className="p-3">
                            <p className="truncate text-sm font-medium text-[#1f2430]">
                              {item.file.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="grid gap-6">
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
                      Update the main room type details.
                    </p>
                  </div>
                </div>

                <EditField
                  icon={<BedDouble size={18} />}
                  label="Room Type Name"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                />

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <EditField
                    icon={<Users size={18} />}
                    label="Max Guests"
                    name="maxGuests"
                    type="number"
                    value={editForm.maxGuests}
                    onChange={handleEditChange}
                  />
                  <EditField
                    icon={<BedDouble size={18} />}
                    label="Bed Type"
                    name="bedType"
                    value={editForm.bedType}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="mt-4">
                  <EditField
                    icon={<CircleDollarSign size={18} />}
                    label="Base Price"
                    name="basePrice"
                    type="number"
                    value={editForm.basePrice}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Description
                  </label>
                  <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-700">
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
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
                      Update guest-visible facilities and features.
                    </p>
                  </div>
                </div>

                <label className="mb-2 block text-sm font-medium text-[#374151]">
                  Amenities
                </label>
                <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-700">
                  <textarea
                    name="amenities"
                    value={editForm.amenities}
                    onChange={handleEditChange}
                    rows={3}
                    placeholder="WiFi, TV, AC, Mini Bar"
                    className="w-full resize-none border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
                  />
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
                      Update optional discounts for this room type.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3">
                    <label className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                      <input
                        type="checkbox"
                        name="discountActive"
                        checked={editForm.discountActive}
                        onChange={handleEditChange}
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
                        value={editForm.discountType}
                        onChange={handleEditChange}
                        className="w-full border-none bg-transparent text-sm text-[#1f2430] outline-none"
                      >
                        <option value="PERCENT">PERCENT</option>
                        <option value="FIXED">FIXED</option>
                      </select>
                    </div>
                  </div>

                  <EditField
                    icon={<Tag size={18} />}
                    label="Discount Value"
                    name="discountValue"
                    type="number"
                    value={editForm.discountValue}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:opacity-70"
                  >
                    <Save size={16} />
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full !bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-[#e5e7eb] !bg-gray-500 px-5 py-2.5 text-sm font-semibold text-[#ffffff] transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ title, message, onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
        <h3 className="text-lg font-bold text-[#1f2430]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-gray-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-70"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditField({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text"
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
          className="w-full border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

function MiniInfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#ece7ff] bg-[#fcfbff] p-3 shadow-sm">
      <div className="mb-2 text-violet-700">{icon}</div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#1f2430]">{value}</p>
    </div>
  );
}

export default ManageRoomTypes;