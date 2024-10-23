import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { color } from "framer-motion";

const { Sider } = Layout;

const menuItems = [
  {
    key: "1",
    icon: <DashboardOutlined style={{ color: "black" }} />,
    label: (
      <Link style={{ color: "black" }} to="/admin/dashboard">
        Dashboard
      </Link>
    ), // Đảm bảo route đúng
  },
  {
    key: "2",
    icon: <UserOutlined style={{ color: "black" }} />,
    label: (
      <Link style={{ color: "black" }} to="/admin/users">
        Users
      </Link>
    ), // Đảm bảo route đúng
  },
  {
    key: "3",
    icon: <FileSearchOutlined style={{ color: "black" }} />,
    label: (
      <Link style={{ color: "black" }} to="/admin/tour-management">
        Tour Management
      </Link>
    ), // Đảm bảo route đúng
  },
  {
    key: "4",
    icon: <SettingOutlined style={{ color: "black" }} />,
    label: (
      <Link style={{ color: "black" }} to="/admin/farm-management">
        Farm Management
      </Link>
    ), // Đảm bảo route đúng
  },
  {
    key: "5",
    icon: <SettingOutlined style={{ color: "black" }} />,
    label: (
      <Link style={{ color: "black" }} to="/admin/settings">
        Settings
      </Link>
    ), // Đảm bảo route đúng
  },
];

const SiderBoard = () => {
  return (
    <Sider className="bg-[#98b7a1]">
      <div className="text-gray-900 text-center my-4 ">
        <h1 className="text-2xl font-bold text-black-900">Admin Dashboard</h1>
      </div>
      <Menu theme="light bg-[#98b7a1] " mode="inline" items={menuItems} />
    </Sider>
  );
};

export default SiderBoard;
