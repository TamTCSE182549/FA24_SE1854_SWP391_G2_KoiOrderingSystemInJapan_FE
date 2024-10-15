import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const menuItems = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: <Link to="/admin/dashboard">Dashboard</Link>, // Đảm bảo route đúng
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: <Link to="/admin/users">Users</Link>, // Đảm bảo route đúng
  },
  {
    key: "3",
    icon: <FileSearchOutlined />,
    label: <Link to="/admin/tour-management">Tour Management</Link>, // Đảm bảo route đúng
  },
  {
    key: "4",
    icon: <SettingOutlined />,
    label: <Link to="/admin/farm-management">Farm Management</Link>, // Đảm bảo route đúng
  },
  {
    key: "5",
    icon: <SettingOutlined />,
    label: <Link to="/admin/settings">Settings</Link>, // Đảm bảo route đúng
  },
];

const SiderBoard = () => {
  return (
    <Sider className="bg-[#c5bd92]">
      <div className="text-gray-900 text-center my-4 ">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      <Menu theme="dark bg-[#c5bd92]" mode="inline" items={menuItems} />
    </Sider>
  );
};

export default SiderBoard;
