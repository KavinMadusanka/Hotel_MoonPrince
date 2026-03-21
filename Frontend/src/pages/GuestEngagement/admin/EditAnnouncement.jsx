import { useMemo, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import AdminPageLayout from "../../../layouts/AdminPageLayout";
import { getAnnouncement, updateAnnouncement, pinAnnouncement } from "../../../apiService/announcementService";
import {
  Megaphone,
  FileText,
  Calendar,
  Image,
  Pin,
  Save,
  Send,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flag,
  X
} from "lucide-react";

function EditAnnouncementPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "normal",
    publishDate: null,
    expiryDate: null,
    isPinned: false,
    isDraft: false,
    createdBy: "Admin",
  });

  const [imageFile, setImageFile] = useState(null);
  const [remoteImage, setRemoteImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const today = new Date();

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return remoteImage || null;
  }, [imageFile, remoteImage]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnnouncement(id);
        if (res?.data?.data) {
          const a = res.data.data;
          setForm({
            title: a.title || "",
            content: a.content || "",
            priority: a.priority || "normal",
            publishDate: a.publishDate ? new Date(a.publishDate) : null,
            expiryDate: a.expiryDate ? new Date(a.expiryDate) : null,
            isPinned: !!a.isPinned,
            isDraft: !!a.isDraft,
            createdBy: a.createdBy || "Admin",
          });
          setRemoteImage(a.image || null);
        }
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Failed to load announcement." });
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setRemoteImage(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setRemoteImage(null);
  };

  const priorityOptions = [
    { value: "normal",    label: "Normal",    color: "#16a34a", bg: "#f0fdf4", border: "#86efac" },
    { value: "important", label: "Important", color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
    { value: "urgent",    label: "Urgent",    color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  ];

  const handleSubmit = async (isDraft) => {
    try {
      setSubmitting(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("priority", form.priority);
      formData.append("publishDate", form.publishDate ? form.publishDate.toISOString() : new Date().toISOString());
      if (form.expiryDate) formData.append("expiryDate", form.expiryDate.toISOString());
      formData.append("isPinned", form.isPinned);
      formData.append("isDraft", isDraft);
      formData.append("createdBy", form.createdBy || "Admin");
      if (imageFile) formData.append("image", imageFile);

      const res = await updateAnnouncement(id, formData);
      if (res?.status === 200) {
        // if updated and should be pinned (and not saved as draft), call pin endpoint
        if (!isDraft && form.isPinned) {
          try {
            await pinAnnouncement(id);
          } catch (err) {
            console.error("Pin failed:", err);
          }
        }

        setMessage({ type: "success", text: "Announcement updated successfully." });
        navigate("/all-announcements");
      } else {
        setMessage({ type: "error", text: res?.data?.message || "Unexpected response from server." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error?.response?.data?.message || "Failed to update announcement." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminPageLayout>
      <style>{`
        .no-outline:focus { outline: none !important; box-shadow: none !important; }
        .no-outline:focus-visible { outline: none !important; box-shadow: none !important; }
      `}</style>

      <div className="rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">

        {/* ── PAGE HEADER ── */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              <Megaphone size={14} /> Admin Panel
            </div>
            <h2 className="m-0 text-[20px] font-bold leading-tight text-[#1f2430] md:text-[24px]">
              Edit Announcement
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6b7280]">
              Update the announcement details, reschedule dates, or change the pin status.
            </p>
          </div>
          <div className="rounded-2xl bg-[#faf7ff] px-4 py-3 text-sm text-gray-600">
            <p className="m-0 font-semibold text-violet-700">Announcement Edit</p>
            <p className="mt-1 text-xs text-gray-500">
              Save as draft or republish when ready.
            </p>
          </div>
        </div>

        <div className="grid gap-6">

          {/* ── SECTION 1: BASIC INFO ── */}
          <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
            <SectionHeader
              icon={<FileText size={20} />}
              title="Basic Information"
              subtitle="Update the title, priority level, and schedule for this announcement."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* Title */}
              <div className="md:col-span-3">
                <label className="mb-2 block text-sm font-medium text-[#374151]">
                  Announcement Title <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-400">
                  <span className="flex-shrink-0 text-violet-700"><Megaphone size={18} /></span>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Royal Weekend Escape: 30% Off Luxury Suites"
                    className="no-outline w-full border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
                    style={{ outline: "none", boxShadow: "none" }}
                  />
                </div>
              </div>

              {/* Priority + Dates — same row */}
              <div className="md:col-span-3 flex flex-col gap-4 md:flex-row md:items-end md:gap-4">

                {/* Priority */}
                <div className="w-full md:w-1/3 min-w-0">
                  <label className="mb-2 block text-sm font-medium text-[#374151]">Priority Level</label>
                  <div className="flex flex-wrap gap-3">
                    {priorityOptions.map((opt) => {
                      const isActive = form.priority === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, priority: opt.value }))}
                          className="no-outline flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all w-full sm:w-auto md:flex-1 flex-shrink-0"
                          style={{
                            backgroundColor: isActive ? opt.bg : "#fff",
                            border: `2px solid ${isActive ? opt.border : "#e5e7eb"}`,
                            color: isActive ? opt.color : "#9ca3af",
                            outline: "none",
                            boxShadow: "none",
                          }}
                        >
                          <Flag size={14} />{opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Publish Date */}
                <div className="w-full md:w-1/3 min-w-0">
                  <label className="mb-2 block text-sm font-medium text-[#374151]">Publish Date</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-400">
                    <span className="flex-shrink-0 text-violet-700"><Calendar size={18} /></span>
                    <DatePicker
                      selected={form.publishDate}
                      onChange={(date) => setForm((p) => ({ ...p, publishDate: date }))}
                      minDate={today}
                      placeholderText="Select publish date"
                      className="no-outline w-full border-none bg-transparent text-sm text-[#1f2430] outline-none"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="w-full md:w-1/3 min-w-0">
                  <label className="mb-2 block text-sm font-medium text-[#374151]">Expiry Date</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-400">
                    <span className="flex-shrink-0 text-violet-700"><Clock size={18} /></span>
                    <DatePicker
                      selected={form.expiryDate}
                      onChange={(date) => setForm((p) => ({ ...p, expiryDate: date }))}
                      minDate={form.publishDate || today}
                      placeholderText="Optional expiry date"
                      className="no-outline w-full border-none bg-transparent text-sm text-[#1f2430] outline-none"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ── SECTION 2: CONTENT ── */}
          <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
            <SectionHeader
              icon={<FileText size={20} />}
              title="Announcement Content"
              subtitle="Write the full message that guests will see."
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-[#374151]">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-400">
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write the full announcement message here..."
                  rows={6}
                  className="no-outline w-full resize-none border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </section>

          {/* ── SECTION 3: IMAGE ── */}
          <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
            <SectionHeader
              icon={<Image size={20} />}
              title="Featured Image"
              subtitle="Upload a cover image to display with this announcement."
            />

            {!previewUrl ? (
              <div className="rounded-[24px] border-2 border-dashed border-violet-200 bg-white p-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <UploadCloud size={24} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[#1f2430]">Upload Featured Image</h3>
                <p className="mt-1 text-sm text-gray-500">PNG, JPG, JPEG or WEBP — one image only.</p>
                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800">
                  <UploadCloud size={16} />
                  Choose Image
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[22px] border border-[#ece7ff] bg-white shadow-sm">
                <div className="relative">
                  <img src={previewUrl} alt="preview" className="h-56 w-full object-cover" />
                  {/* ── White bg, gray X ── */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="no-outline absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-none shadow-md transition hover:bg-gray-100"
                    style={{ background: "#ffffff", outline: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                  >
                    <X size={15} style={{ color: "#6b7280" }} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="truncate text-sm font-medium text-[#1f2430]">
                      {imageFile?.name ?? "Current image"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : "Uploaded"}
                    </p>
                  </div>
                  <CheckCircle2 size={18} className="text-violet-700" />
                </div>
              </div>
            )}
          </section>

          {/* ── SECTION 4: PIN ── */}
          <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
            <SectionHeader
              icon={<Pin size={20} />}
              title="Pin Settings"
              subtitle="Pinned announcements always appear at the top of the announcements page."
            />

            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, isPinned: !p.isPinned }))}
              className="no-outline flex w-full items-center justify-between rounded-2xl px-5 py-4 transition"
              style={{
                backgroundColor: form.isPinned ? "#faf7ff" : "#fff",
                border: form.isPinned ? "2px solid #ede9fe" : "2px solid #e5e7eb",
                outline: "none",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition"
                  style={{ backgroundColor: form.isPinned ? "#ede9fe" : "#f3f4f6" }}
                >
                  <Pin
                    size={18}
                    style={{ color: form.isPinned ? "#6A0DAD" : "#9ca3af", transform: "rotate(45deg)" }}
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#1f2430]">Pin to Top</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    This announcement will be shown first to all guests
                  </p>
                </div>
              </div>

              <div
                className="relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200"
                style={{ backgroundColor: form.isPinned ? "#6A0DAD" : "#e5e7eb" }}
              >
                <div
                  className="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: form.isPinned ? "translateX(20px)" : "translateX(2px)" }}
                />
              </div>
            </button>
          </section>

          {/* ── MESSAGE ── */}
          {message && (
            <div
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <AlertCircle size={16} />
              {message.text}
            </div>
          )}

          {/* ── ACTION BAR ── */}
          <div className="flex flex-col gap-3 rounded-[26px] bg-[#fffdf7] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="m-0 text-base font-semibold text-[#1f2430]">Save your changes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Republish immediately or save as draft to review later.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              {/* Cancel */}
              <button
                type="button"
                onClick={() => navigate("/all-announcements")}
                className="no-outline inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[#6b7280] transition hover:text-[#374151]"
                style={{ background: "none", border: "none", outline: "none", boxShadow: "none" }}
              >
                Cancel
              </button>

              {/* Save as Draft */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit(true)}
                className="no-outline inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: "#fff", border: "2px solid #6A0DAD", color: "#6A0DAD", outline: "none", boxShadow: "none" }}
              >
                <Save size={15} />
                Save as Draft
              </button>

              {/* Update / Publish */}
              <button
                type="button"
                disabled={submitting || !form.title || !form.content}
                onClick={() => handleSubmit(false)}
                className="no-outline inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "#6A0DAD", border: "none", outline: "none", boxShadow: "none" }}
              >
                <Send size={15} />
                {submitting ? "Saving..." : "Update Announcement"}
              </button>

            </div>
          </div>

        </div>
      </div>
    </AdminPageLayout>
  );
}

/* ── Reusable sub-components ── */

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
        {icon}
      </span>
      <div>
        <h2 className="m-0 text-lg font-semibold text-[#1f2430]">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default EditAnnouncementPage;