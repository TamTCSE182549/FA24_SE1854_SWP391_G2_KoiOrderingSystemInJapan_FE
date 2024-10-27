import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Sử dụng named import cho jwt_decode
// Component bảo vệ các tuyến đường cần phân quyền
import { Cookies, useCookies } from "react-cookie";
const PrivateRoute = ({ allowedRoles }) => {
  // Lấy token từ localStorage
  const [cookies] = useCookies(["token"]);

  const token = cookies.token;

  if (token) {
    try {
      // Decode JWT để lấy payload và role
      const decodedToken = jwtDecode(token); // Dùng jwt_decode để giải mã token
      const userRole = decodedToken.role; // Giả sử JWT có chứa trường 'role'

      // Kiểm tra nếu vai trò người dùng thuộc danh sách các vai trò được phép
      if (allowedRoles.includes(userRole)) {
        return <Outlet />; // Cho phép truy cập nếu role hợp lệ
      } else {
        return <Navigate to="/unauthorized" />; // Chuyển hướng đến trang không có quyền truy cập
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return <Navigate to="/login" />; // Chuyển hướng nếu có lỗi giải mã token
    }
  } else {
    return <Navigate to="/login" />; // Chuyển hướng nếu không có token
  }
};

export default PrivateRoute;
