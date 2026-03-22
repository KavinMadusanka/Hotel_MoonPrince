import AdminPageLayout from "../../layouts/AdminPageLayout";
import { BedDouble, DoorOpen, Archive, ShieldCheck } from "lucide-react";

function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="rounded-[28px] border border-[#ece7ff] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
            {title}
          </p>
          <h3 className="mt-3 text-3xl font-bold text-[#1f2430]">{value}</h3>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-violet-100 p-4 text-violet-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <AdminPageLayout>
      <div className="space-y-8">
        <div className="rounded-[30px] bg-gradient-to-r from-violet-700 to-fuchsia-600 p-8 text-white shadow-[0_20px_60px_rgba(109,40,217,0.25)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-violet-100">
                MoonPrince Admin Panel
              </p>
              <h1 className="mt-2 text-3xl font-bold">
                Welcome to the Admin Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-violet-100">
                Manage room types, rooms, and holds from one protected admin area.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="Room Types"
            value="Manage"
            subtitle="Create, update, and remove room categories."
            icon={<BedDouble className="h-7 w-7" />}
          />
          <StatCard
            title="Rooms"
            value="Manage"
            subtitle="Control room records and operational status."
            icon={<DoorOpen className="h-7 w-7" />}
          />
          <StatCard
            title="Holds"
            value="Manage"
            subtitle="Review and handle temporary reservation holds."
            icon={<Archive className="h-7 w-7" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-[#ece7ff] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <h2 className="text-lg font-semibold text-[#1f2430]">Quick Actions</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <a href="/add-room-types" className="rounded-2xl border border-[#ece7ff] bg-[#fcfbff] px-4 py-4 text-sm font-medium text-[#1f2430] transition hover:-translate-y-0.5 hover:shadow-md">Add Room Type</a>
              <a href="/manage-room-types" className="rounded-2xl border border-[#ece7ff] bg-[#fcfbff] px-4 py-4 text-sm font-medium text-[#1f2430] transition hover:-translate-y-0.5 hover:shadow-md">Manage Room Types</a>
              <a href="/add-room" className="rounded-2xl border border-[#ece7ff] bg-[#fcfbff] px-4 py-4 text-sm font-medium text-[#1f2430] transition hover:-translate-y-0.5 hover:shadow-md">Add Room</a>
              <a href="/manage-rooms" className="rounded-2xl border border-[#ece7ff] bg-[#fcfbff] px-4 py-4 text-sm font-medium text-[#1f2430] transition hover:-translate-y-0.5 hover:shadow-md">Manage Rooms</a>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#ece7ff] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <h2 className="text-lg font-semibold text-[#1f2430]">Access Control</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-600">
              <li>• Only admin users can access room inventory admin pages.</li>
              <li>• Guest room browsing and availability stay public.</li>
              <li>• This supports least-privilege security for your demo/report.</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}

export default AdminDashboard;