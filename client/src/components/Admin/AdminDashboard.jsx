import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminHome from "./AdminHome";
import UserManagement from "./UserManagement";
import TicketManagement from "./TicketManagement"; // Import component quản lý vé
import Sidebar from "./Sidebar"; // Đảm bảo import default export từ Sidebar.jsx

// Tạo router cho AdminDashboard
const adminRouter = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminHome />,
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
  },
  {
    path: "/admin/tickets",
    element: <TicketManagement />,
  },
]);

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Sử dụng RouterProvider để cung cấp router cho AdminDashboard */}
        <RouterProvider router={adminRouter} />
      </div>
    </div>
  );
};

export default AdminDashboard;
