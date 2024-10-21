// components/Admin/AdminDashboard.js
import React from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Users from "./Users";
import TourManagement from "./TourManagement";
import Settings from "./Settings";
import SiderBoard from "./SiderBoard";
import FarmManagement from "./FarmManagement";
import CreateNewFarm from "./CreateNewFarm";

const { Header, Content } = Layout;

const AdminDashboard = () => {
  return (
    <Layout className="min-h-screen mt-40 backdrop-filter backdrop-blur-3xl">
      <SiderBoard />

      <Layout>
        <Header className="shadow-md p-4 bg-green-800">
          <h2 className="text-xl font-serif text-white">Welcome, Admin</h2>
        </Header>
        <Content className="p-6 bg-green-800">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="tour-management" element={<TourManagement />} />
            <Route path="farm-management" element={<FarmManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="create-new-farm" element={<CreateNewFarm />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
