import AdminSidebar from "../components/admin/AdminSidebar";

function AdminPageLayout({ children }) {
  return (
    <div className="min-h-screen min-w-screen bg-purple-50 px-4 py-5 md:px-6">
      <div className="mx-auto grid max-w-screen grid-cols-1 gap-5 xl:grid-cols-[280px_1fr]">
        <AdminSidebar />

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

export default AdminPageLayout;