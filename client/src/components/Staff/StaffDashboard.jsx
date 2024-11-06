import React from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import Dashboard2 from "../Staff/Dashboard2";
import SiderBoard from "./SiderBoard";
import Quotation from "./Quotation";
import BookingListForStaff from "./BookingListForStaff";
import CheckinService from "../SaleStaff/CheckinService";
import BookingForKoiList from "./BookingForKoiList";
import DepositList from "./DepositList";

const { Content } = Layout;

const StaffDashboard = () => {
  return (
    <Layout>
      {/* Main Layout */}
      <Layout style={{ marginTop: '96px' }}> {/* Tăng margin-top để tránh navbar */}
        {/* Sidebar */}
        <SiderBoard />
        
        {/* Main Content Area */}
        <Layout className="transition-all duration-300 ml-[280px] bg-gray-50">
          {/* Content */}
          <Content className="m-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Routes>
                <Route path="dashboard" element={<Dashboard2 />} />
                <Route path="quotation" element={<Quotation />} />
                <Route path="booking-list-for-staff" element={<BookingListForStaff />} />
                <Route path="checkin-service" element={<CheckinService />} />
                <Route path="booking-for-koi-list" element={<BookingForKoiList/>}/>
                <Route path="deposit-list" element={<DepositList/>}/>
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default StaffDashboard;
