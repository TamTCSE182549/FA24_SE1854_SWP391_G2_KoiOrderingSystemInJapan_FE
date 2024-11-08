// components/Admin/AdminDashboard.js
import React from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Dashboard2 from "./Dashboard2";
import Users from "./Users";
import TourManagement from "./TourManagement";
import Settings from "./Settings";
import SiderBoard from "./SiderBoard";
import FarmManagement from "./FarmManagement";
import BookingManagement from "./BookingManagement";
import KoiManagement from "./KoiManagement";
import FarmDetail from "./Farmdetail";
import TourDetail from "./TourDetail";
import ServiceManagement from "./ServiceManagement";

const { Content } = Layout;

const AdminDashboard = () => {
  return (
    <Layout>
      <Layout style={{ marginTop: '96px' }}>
        <SiderBoard />
        <Layout className="transition-all duration-300 ml-[280px] bg-gray-50">
          <Content className="m-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Routes>
                <Route path="dashboard" element={<Dashboard2 />} />
                <Route path="users" element={<Users />} />
                <Route path="tour-management" element={<TourManagement />} />
                <Route path="farm-management" element={<FarmManagement />} />
                <Route path="BookingManagement" element={<BookingManagement />} />
                <Route path="settings" element={<Settings />} />
                <Route path="tourdetail/:id" element={<TourDetail />} />
                <Route path="koi-management" element={<KoiManagement />} />
                <Route path="farm/:id" element={<FarmDetail />} />
                <Route path="ServiceManagement" element={<ServiceManagement />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
