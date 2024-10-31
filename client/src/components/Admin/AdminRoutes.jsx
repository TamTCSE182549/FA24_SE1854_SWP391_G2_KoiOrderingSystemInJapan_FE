// components/Admin/AdminRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import PrivateRoute from "../PrivateRouter/PrivateRouter"; // Đường dẫn tới PrivateRoute

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Sử dụng PrivateRoute để bảo vệ các route admin */}
      <Route element={<PrivateRoute allowedRoles={["MANAGER"]} />}>
        {/* AdminDashboard là trang chính với các route con */}
        <Route path="/*" element={<AdminDashboard />} /> {/* Thêm * */}
      </Route>
    </Routes>
    //
  );
};

export default AdminRoutes;
