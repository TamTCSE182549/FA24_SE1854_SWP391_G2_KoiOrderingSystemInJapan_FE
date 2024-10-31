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
      <Link style={{ color: "black" }} to="/staff/dashboard">
        Dashboard
      </Link>
    ), // Đảm bảo route đúng
  },
  {
    key: "2",
    icon: <UserOutlined style={{ color: "black" }} />,
    label: (
      <Link style={{ color: "black" }} to="/staff/quotation">
        Quotation
      </Link>
    ),
  },
  {
    key: "3",
    icon: <FileSearchOutlined style={{ color: "black" }} />,
    label: (
      <Link style={{ color: "black" }} to="/staff/booking-list-for-staff">
        Booking List
      </Link>
    ),
  },
  {
    key: "4",
    icon: <FileSearchOutlined style={{ color: "black" }} />,
    label: (
      <Link style={{ color: "black" }} to="/staff/checkin-service">
        Checkin Service
      </Link>
    ),
  },
  {
    key: "5",
    icon: <FileSearchOutlined style={{ color: "black" }} />,
    label: (
      <Link style={{ color: "black" }} to="/staff/view-checkin">
        View Checkin
      </Link>
    ),
  },
  {
    key: "6",
    icon: <FileSearchOutlined style={{ color: "black" }} />,
    label: (
      <Link style={{ color: "black" }} to="/staff/booking-for-koi-list">
        Booking For Koi List
      </Link>
    ),
  },
  {
    key: "7",
    icon: <FileSearchOutlined style={{ color: "black" }} />,
    label: (
      <Link style={{ color: "black" }} to="/staff/deposit-list">
        Deposit List
      </Link>
    ),
  },
];


const SiderBoard = () => {
  return (
    <Sider className="bg-[#98b7a1]">
      <div className="text-gray-900 text-center my-4">
        <h1 className="text-2xl font-bold text-black-900">Staff Dashboard</h1>
      </div>
      <Menu theme="light bg-[#98b7a1] " mode="inline" items={menuItems} />
    </Sider>
  );
};

export default SiderBoard;
