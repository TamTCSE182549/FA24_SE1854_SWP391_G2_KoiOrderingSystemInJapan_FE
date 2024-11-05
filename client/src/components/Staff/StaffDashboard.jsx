import React from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import Dashboard2 from "../Staff/Dashboard2";
import SiderBoard from "./SiderBoard"; // Reuse or create a new Sider component for staff
import Quotation from "./Quotation";
import BookingListForStaff from "./BookingListForStaff";
import CheckinService from "../SaleStaff/CheckinService";
// import ViewCheckin from "../Customer/ViewCheckin";
import BookingForKoiList from "./BookingForKoiList";
import DepositList from "./DepositList";

const { Header, Content } = Layout;

const StaffDashboard = () => {
  return (
    <Layout className="min-h-screen">
      <div className="h-24"></div> {/* Spacer for navbar */}
      <Layout className="min-h-[calc(100vh-6rem)]">
        <SiderBoard />
        <Layout>
          <Header className="bg-[#c5bd92] shadow-md p-4">
            <h2 className="text-xl font-semibold">Welcome, Staff</h2>
          </Header>
          <Content className="p-6 bg-[#e7ede0]">
            <Routes>
              <Route path="dashboard" element={<Dashboard2 />} />
              <Route path="quotation" element={<Quotation />} />
              <Route
                path="booking-list-for-staff"
                element={<BookingListForStaff />}
              />
              <Route path="checkin-service" element={<CheckinService />} />
              {/* <Route path="view-checkin" element={<ViewCheckin />} /> */}
              <Route path="booking-for-koi-list" element={<BookingForKoiList/>}/>
              <Route path="deposit-list" element={<DepositList/>}/>
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default StaffDashboard;
