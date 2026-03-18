import AdminSidebar from "../components/admin/AdminSidebar";

function AdminPageLayout({ children }) {
  return (
    <div className="min-h-screen w-screen bg-[#f7f6fb] px-4 py-5 md:px-6">
      <div className="mx-auto grid max-w-[1450px] grid-cols-1 gap-5 xl:grid-cols-[280px_1fr]">
        <AdminSidebar />

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

export default AdminPageLayout;