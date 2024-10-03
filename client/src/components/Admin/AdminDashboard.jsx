import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminHome from "./AdminHome";
import UserManagement from "./UserManagement";
import TicketManagement from "./TicketManagement"; // Import component quản lý vé
import Sidebar from "./Sidebar"; // Đảm bảo import default export từ Sidebar.jsx

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/tickets" element={<TicketManagement />} />{" "}
          {/* Thêm route quản lý vé */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
