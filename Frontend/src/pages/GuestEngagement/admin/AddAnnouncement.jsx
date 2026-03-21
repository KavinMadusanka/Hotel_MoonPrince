import { useMemo, useState } from "react";
import AdminPageLayout from "../../../layouts/AdminPageLayout";
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
  Trash2,
  AlertCircle,
  Clock,
  Flag,
  X
} from "lucide-react";

function AddAnnouncementsPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "normal",
    publishDate: "",
    expiryDate: "",
    isPinned: false,
    isDraft: false,
    createdBy: "Admin",
  });

  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const previewUrl = useMemo(() => {
    return image ? URL.createObjectURL(image) : null;
  }, [image]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const removeImage = () => setImage(null);

  const handleSubmit = async (isDraft) => {
    try {
      setSubmitting(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("priority", form.priority);
      formData.append(
        "publishDate",
        form.publishDate || new Date().toISOString()
      );
      if (form.expiryDate) formData.append("expiryDate", form.expiryDate);
      formData.append("isPinned", form.isPinned);
      formData.append("isDraft", isDraft);
      formData.append("createdBy", form.createdBy);
      if (image) formData.append("image", image);

      // await createAnnouncement(formData); // ← wire up your API call here

      setMessage({
        type: "success",
        text: isDraft
          ? "Announcement saved as draft."
          : "Announcement published successfully.",
      });

      setForm({
        title: "",
        content: "",
        priority: "normal",
        publishDate: "",
        expiryDate: "",
        isPinned: false,
        isDraft: false,
        createdBy: "Admin",
      });
      setImage(null);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "Failed to save announcement.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const priorityOptions = [
    {
      value: "normal",
      label: "Normal",
      color: "#22c55e",
      bg: "#f0fdf4",
      ring: "#bbf7d0",
    },
    {
      value: "important",
      label: "Important",
      color: "#f59e0b",
      bg: "#fffbeb",
      ring: "#fde68a",
    },
    {
      value: "urgent",
      label: "Urgent",
      color: "#ef4444",
      bg: "#fef2f2",
      ring: "#fecaca",
    },
  ];

  return (
    <AdminPageLayout>
      <div className="rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
        {/* PAGE HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              <Megaphone size={14} />
              Admin Panel
            </div>
            <h2 className="m-0 text-[20px] font-bold leading-tight text-[#1f2430] md:text-[24px]">
              Add New Announcement
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6b7280]">
              Create and publish announcements for hotel guests. Set priority,
              schedule dates, and pin important notices to the top.
            </p>
          </div>

          <div className="rounded-2xl bg-[#faf7ff] px-4 py-3 text-sm text-gray-600">
            <p className="m-0 font-semibold text-violet-700">
              Announcement Setup
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Fill in the details and publish or save as draft.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* ── SECTION 1: BASIC INFO ── */}
          <section className="rounded-[26px] bg-[#fcfbff] p-5 ring-1 ring-[#ede9fe]">
            <SectionHeader
              icon={<FileText size={20} />}
              title="Basic Information"
              subtitle="Enter the title, priority level, and schedule for this announcement."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Title */}
              <div className="md:col-span-2">
                <InputField
                  icon={<Megaphone size={18} />}
                  label="Announcement Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Royal Weekend Escape: 30% Off Luxury Suites"
                  required
                />
              </div>

              {/* Priority */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#374151]">
                  Priority Level
                </label>
                <div className="flex gap-3">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, priority: opt.value }))
                      }
                      style={
                        form.priority === opt.value
                          ? {
                              backgroundColor: opt.bg,
                              border: `2px solid ${opt.ring}`,
                              color: opt.color,
                            }
                          : {
                              backgroundColor: "#fff",
                              border: "2px solid #e5e7eb",
                              color: "#6b7280",
                            }
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-semibold transition"
                    >
                      <Flag size={14} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Publish Date */}
              <InputField
                icon={<Calendar size={18} />}
                label="Publish Date"
                name="publishDate"
                type="date"
                value={form.publishDate}
                onChange={handleChange}
                placeholder=""
                hint="Defaults to today if left empty"
              />

              {/* Expiry Date */}
              <InputField
                icon={<Clock size={18} />}
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleChange}
                placeholder=""
                hint="Optional — leave blank for no expiry"
              />
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
              <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 transition focus-within:border-violet-700">
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write the full announcement message here..."
                  rows={6}
                  required
                  className="w-full resize-none border-none bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-gray-400"
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
                <h3 className="mt-4 text-base font-semibold text-[#1f2430]">
                  Upload Featured Image
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  PNG, JPG, JPEG or WEBP — one image only.
                </p>
                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800">
                  <UploadCloud size={16} />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[22px] border border-[#ece7ff] bg-white shadow-sm">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="h-56 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-none bg-white shadow-md transition hover:bg-red-50"
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="truncate text-sm font-medium text-[#1f2430]">
                      {image?.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {image ? (image.size / 1024).toFixed(1) : 0} KB
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
              onClick={() =>
                setForm((p) => ({ ...p, isPinned: !p.isPinned }))
              }
              style={{
                backgroundColor: form.isPinned ? "#faf7ff" : "#fff",
                border: form.isPinned
                  ? "2px solid #ede9fe"
                  : "2px solid #e5e7eb",
              }}
              className="flex w-full items-center justify-between rounded-2xl px-5 py-4 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: form.isPinned ? "#ede9fe" : "#f3f4f6",
                  }}
                >
                  <Pin
                    size={18}
                    style={{
                      color: form.isPinned ? "#7c3aed" : "#9ca3af",
                      transform: "rotate(45deg)",
                    }}
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#1f2430]">
                    Pin to Top
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    This announcement will be shown first to all guests
                  </p>
                </div>
              </div>

              {/* Toggle pill */}
              <div
                style={{
                  backgroundColor: form.isPinned ? "#7c3aed" : "#e5e7eb",
                  transition: "background 0.2s",
                }}
                className="relative h-6 w-11 rounded-full"
              >
                <div
                  style={{
                    transform: form.isPinned
                      ? "translateX(20px)"
                      : "translateX(2px)",
                    transition: "transform 0.2s",
                  }}
                  className="absolute top-1 h-4 w-4 rounded-full bg-white shadow"
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
              <h3 className="m-0 text-base font-semibold text-[#1f2430]">
                Ready to publish?
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Publish now or save as a draft to review later.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Cancel */}
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-gray-50"
              >
                <X size={16} />
                Cancel
              </button>

              {/* Save as Draft */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit(true)}
                className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save size={16} />
                Save as Draft
              </button>

              {/* Publish */}
              <button
                type="button"
                disabled={submitting || !form.title || !form.content}
                onClick={() => handleSubmit(false)}
                className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Send size={16} />
                {submitting ? "Publishing..." : "Publish Announcement"}
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

function InputField({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  hint,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#374151]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
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
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default AddAnnouncementsPage;