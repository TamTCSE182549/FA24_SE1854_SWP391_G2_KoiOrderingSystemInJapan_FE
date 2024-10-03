import React from "react";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  return (
    <div className="h-screen w-60 bg-gray-800 text-white">
      <div className="text-center my-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <ul className="space-y-4 px-4">
        <li>
          <Link to="/admin" className="flex items-center space-x-2">
            <DashboardOutlined />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="flex items-center space-x-2">
            <UserOutlined />
            <span>Users</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/tickets" className="flex items-center space-x-2">
            <FileDoneOutlined />
            <span>Tickets</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

// Đảm bảo export mặc định
export default Sidebar;
