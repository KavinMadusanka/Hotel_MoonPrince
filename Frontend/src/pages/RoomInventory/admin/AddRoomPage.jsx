import { useEffect, useState } from "react";
import AdminPageLayout from "../../../layouts/AdminPageLayout";
import {
  getRoomTypes,
  createRoom
} from "../../../apiService/roomService";
import {
  DoorOpen,
  Layers3,
  BedDouble,
  FileText,
  Save,
  Hotel,
  ClipboardList,
  CheckCircle2
} from "lucide-react";

function AddRoomPage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    roomNumber: "",
    floor: "",
    roomType: "",
    status: "ready",
    notes: ""
  });

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await getRoomTypes();
        setRoomTypes(res.data);
      } catch (error) {
        console.error(error);
        setMessage("Failed to load room types");
      } finally {
        setLoadingRoomTypes(false);
      }
    };

    fetchRoomTypes();
  }, []);

  const showTemporaryMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await createRoom({
        roomNumber: form.roomNumber,
        floor: Number(form.floor),
        roomType: form.roomType,
        status: form.status,
        notes: form.notes
      });

      showTemporaryMessage("Room created successfully");

      setForm({
        roomNumber: "",
        floor: "",
        roomType: "",
        status: "ready",
        notes: ""
      });
    } catch (error) {
      console.error(error);
      showTemporaryMessage(
        error?.response?.data?.message || "Failed to create room"
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
              Add New Room
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6b7280]">
              Create a new physical room and assign it to an existing room type
              for inventory and reservation management.
            </p>
          </div>

          <div className="rounded-2xl bg-[#faf7ff] px-4 py-3 text-sm text-gray-600">
            <p className="m-0 font-semibold text-violet-700">Room Setup</p>
            <p className="mt-1 text-xs text-gray-500">
              Add room number, floor, type, and operational status.
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6">
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
                  Enter the basic details of the physical room.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                icon={<DoorOpen size={18} />}
                label="Room Number"
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="101"
                required
              />

              <InputField
                icon={<Layers3 size={18} />}
                label="Floor"
                name="floor"
                type="number"
                value={form.floor}
                onChange={handleChange}
                placeholder="1"
                required
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
                <p className="mt-1 text-sm text-gray-500">
                  Select the room type and current operational status.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#374151]">
                  Room Type
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-700">
                  <span className="text-violet-700">
                    <BedDouble size={18} />
                  </span>
                  <select
                    name="roomType"
                    value={form.roomType}
                    onChange={handleChange}
                    required
                    disabled={loadingRoomTypes}
                    className="w-full border-none bg-transparent text-sm text-[#1f2430] outline-none"
                  >
                    <option value="">
                      {loadingRoomTypes
                        ? "Loading room types..."
                        : "Select Room Type"}
                    </option>
                    {roomTypes.map((rt) => (
                      <option key={rt._id} value={rt._id}>
                        {rt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#374151]">
                  Status
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-700">
                  <span className="text-violet-700">
                    <CheckCircle2 size={18} />
                  </span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border-none bg-transparent text-sm text-[#1f2430] outline-none"
                  >
                    <option value="ready">ready</option>
                    <option value="dirty">dirty</option>
                    <option value="maintenance">maintenance</option>
                    <option value="out_of_service">out_of_service</option>
                  </select>
                </div>
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
                <p className="mt-1 text-sm text-gray-500">
                  Add any optional note about the room condition or special
                  information.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#374151]">
                Notes
              </label>
              <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-700">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Optional note about the room..."
                  rows={4}
                  className="w-full resize-none border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 rounded-[26px] bg-[#fffdf7] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="m-0 text-base font-semibold text-[#1f2430]">
                Ready to save this room?
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Make sure the room number, floor, room type, and status are
                correct before saving.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || loadingRoomTypes}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={17} />
              {submitting ? "Saving..." : "Save Room"}
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

export default AddRoomPage;