import { useEffect, useState } from "react";
import AdminPageLayout from "../../../layouts/AdminPageLayout";
import {
  getRooms,
  getRoomTypes,
  updateRoom,
  deleteRoom
} from "../../../apiService/roomService";
import {
  DoorOpen,
  Layers3,
  BedDouble,
  FileText,
  Hotel,
  X,
  Trash2,
  Save,
  CheckCircle2,
  ClipboardList,
  AlertTriangle
} from "lucide-react";

function ManageRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editForm, setEditForm] = useState({
    roomNumber: "",
    floor: "",
    roomType: "",
    status: "ready",
    notes: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const [roomsRes, roomTypesRes] = await Promise.all([
        getRooms(),
        getRoomTypes()
      ]);

      setRooms(roomsRes.data);
      setRoomTypes(roomTypesRes.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showTemporaryMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const openModal = (room) => {
    setSelectedRoom(room);

    setEditForm({
      roomNumber: room?.roomNumber ? String(room.roomNumber) : "",
      floor:
        room?.floor !== undefined && room?.floor !== null
          ? String(room.floor)
          : "",
      roomType: room?.roomType?._id || room?.roomType || "",
      status: room?.status || "ready",
      notes: room?.notes || ""
    });

    setIsModalOpen(true);
    setShowDeleteConfirm(false);
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setIsModalOpen(false);
    setShowDeleteConfirm(false);
    setEditForm({
      roomNumber: "",
      floor: "",
      roomType: "",
      status: "ready",
      notes: ""
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (!selectedRoom) return;

    try {
      setSubmitting(true);

      const payload = {
        roomNumber: editForm.roomNumber.trim(),
        floor: Number(editForm.floor),
        roomType: editForm.roomType,
        status: editForm.status,
        notes: editForm.notes
      };

      const res = await updateRoom(selectedRoom._id, payload);
      const updatedRoom = res.data.room || res.data;

      setRooms((prev) =>
        prev.map((item) =>
          item._id === selectedRoom._id ? updatedRoom : item
        )
      );

      showTemporaryMessage(res.data.message || "Room updated successfully");
      closeModal();
      fetchData();
    } catch (error) {
      console.error(error);
      showTemporaryMessage(
        error?.response?.data?.message || "Failed to update room"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRoom) return;

    try {
      setSubmitting(true);

      const res = await deleteRoom(selectedRoom._id);

      setRooms((prev) =>
        prev.filter((item) => item._id !== selectedRoom._id)
      );

      closeModal();
      showTemporaryMessage(res.data.message || "Room deleted successfully");
    } catch (error) {
      console.error(error);
      showTemporaryMessage(
        error?.response?.data?.message || "Failed to delete room"
      );
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
              Manage Rooms
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6b7280]">
              View all physical rooms and update or delete room details from the
              admin panel.
            </p>
          </div>

          <div className="rounded-2xl bg-[#faf7ff] px-4 py-3 text-sm text-gray-600">
            <p className="m-0 font-semibold text-violet-700">Total Rooms</p>
            <p className="mt-1 text-xs text-gray-500">
              {rooms.length} rooms available
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-[#faf7ff] p-6 text-sm text-gray-500">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-[#faf7ff] p-8 text-center text-gray-500">
            No rooms found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => (
              <button
                key={room._id}
                type="button"
                onClick={() => openModal(room)}
                className="rounded-[26px] border border-[#ece7ff] !bg-white p-5 text-left shadow-[0_8px_25px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                      Room {room.roomNumber}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-[#1f2430]">
                      {room.roomType?.name || "Unassigned Room Type"}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      room.status === "ready"
                        ? "bg-emerald-50 text-emerald-700"
                        : room.status === "dirty"
                        ? "bg-amber-50 text-amber-700"
                        : room.status === "maintenance"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {room.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MiniInfoCard
                    icon={<DoorOpen size={16} />}
                    label="Room No"
                    value={room.roomNumber}
                  />
                  <MiniInfoCard
                    icon={<Layers3 size={16} />}
                    label="Floor"
                    value={room.floor}
                  />
                  <MiniInfoCard
                    icon={<BedDouble size={16} />}
                    label="Room Type"
                    value={room.roomType?.name || "N/A"}
                  />
                  <MiniInfoCard
                    icon={<CheckCircle2 size={16} />}
                    label="Status"
                    value={room.status}
                  />
                </div>

                <div className="mt-4 rounded-[20px] bg-[#faf7ff] p-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400">
                    Notes
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                    {room.notes || "No notes added."}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedRoom && (
        <RoomModal
          room={selectedRoom}
          roomTypes={roomTypes}
          editForm={editForm}
          handleEditChange={handleEditChange}
          handleUpdate={handleUpdate}
          handleDelete={() => setShowDeleteConfirm(true)}
          closeModal={closeModal}
          submitting={submitting}
        />
      )}

      {showDeleteConfirm && selectedRoom && (
        <DeleteConfirmModal
          room={selectedRoom}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          submitting={submitting}
        />
      )}
    </AdminPageLayout>
  );
}

function RoomModal({
  room,
  roomTypes,
  editForm,
  handleEditChange,
  handleUpdate,
  handleDelete,
  closeModal,
  submitting
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div>
            <h3 className="text-xl font-bold text-[#1f2430]">
              Edit Room {room.roomNumber}
            </h3>
            <p className="text-sm text-gray-500">
              Update or delete this room directly
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="rounded-2xl !bg-transparent p-3 !text-gray-500 transition hover:bg-violet-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid gap-5">
            <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <DoorOpen size={20} />
                </span>
                <div>
                  <h2 className="m-0 text-lg font-semibold text-[#1f2430]">
                    Room Information
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Update the room details below.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <EditField
                  label="Room Number"
                  name="roomNumber"
                  value={editForm.roomNumber}
                  onChange={handleEditChange}
                />

                <EditField
                  label="Floor"
                  name="floor"
                  type="number"
                  value={editForm.floor}
                  onChange={handleEditChange}
                />
              </div>
            </section>

            <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <ClipboardList size={20} />
                </span>
                <div>
                  <h2 className="m-0 text-lg font-semibold text-[#1f2430]">
                    Assignment & Status
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Room Type
                  </label>
                  <select
                    name="roomType"
                    value={editForm.roomType}
                    onChange={handleEditChange}
                    className="w-full rounded-2xl border border-[#d1d5db] bg-white px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:border-violet-700"
                  >
                    <option value="">Select Room Type</option>
                    {roomTypes.map((rt) => (
                      <option key={rt._id} value={rt._id}>
                        {rt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full rounded-2xl border border-[#d1d5db] bg-white px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:border-violet-700"
                  >
                    <option value="ready">ready</option>
                    <option value="dirty">dirty</option>
                    <option value="maintenance">maintenance</option>
                    <option value="out_of_service">out_of_service</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <FileText size={20} />
                </span>
                <div>
                  <h2 className="m-0 text-lg font-semibold text-[#1f2430]">
                    Additional Notes
                  </h2>
                </div>
              </div>

              <textarea
                name="notes"
                value={editForm.notes}
                onChange={handleEditChange}
                rows={4}
                placeholder="Enter room notes"
                className="w-full rounded-2xl border border-[#d1d5db] bg-white px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-violet-700"
              />
            </section>

            <div className="flex flex-wrap gap-3">
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
                className="rounded-full !bg-gray-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ room, onClose, onConfirm, submitting }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1f2430]">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Are you sure you want to delete <strong>Room {room.roomNumber}</strong>?
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
          >
            <Trash2 size={16} />
            {submitting ? "Deleting..." : "Yes, Delete"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-full bg-gray-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-70"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function EditField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#374151]">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-[#d1d5db] bg-white px-4 py-3 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 focus:border-violet-700"
      />
    </div>
  );
}

function MiniInfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-[#faf7ff] p-3">
      <div className="mb-2 text-violet-700">{icon}</div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#1f2430]">{value}</p>
    </div>
  );
}

export default ManageRoomsPage;