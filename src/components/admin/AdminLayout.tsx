import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background" dir="ltr">
      <AdminSidebar />
      <main className="lg:ml-64 p-6 pt-16 lg:pt-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
