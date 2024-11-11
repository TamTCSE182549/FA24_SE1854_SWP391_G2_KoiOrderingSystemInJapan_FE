import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import Dashboard2 from "../Staff/Dashboard2";
import SiderBoard from "./SiderBoard";
import Quotation from "./Quotation";
import BookingListForStaff from "./BookingListForStaff";
import CheckinService from "../SaleStaff/CheckinService";
import BookingForKoiList from "./BookingForKoiList";
import DepositList from "./DepositList";
import BookingKoiForDelivery from "./BookingKoiForDelivery";
import DeliveryManagement from "./DeliveryManagement";
import AcceptedTourList from "./AcceptedTourList";
const { Content } = Layout;

const StaffDashboard = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [bookingStats, setBookingStats] = useState({
    tourBookings: 0,
    koiBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Current token:", token);

    const fetchBookingStats = async () => {
      setIsLoading(true);
      try {
        // Fetch tour bookings
        const tourResponse = await axios.get(
          "http://localhost:8080/bookings/BookingForTour",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Validate response data
        if (!Array.isArray(tourResponse.data)) {
          console.error("Tour response is not an array:", tourResponse.data);
          return;
        }

        // Fetch koi bookings
        const koiResponse = await axios.get(
          "http://localhost:8080/bookings/BookingForKoi",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Validate response data
        if (!Array.isArray(koiResponse.data)) {
          console.error("Koi response is not an array:", koiResponse.data);
          return;
        }

        setBookingStats({
          tourBookings: tourResponse.data.length,
          koiBookings: koiResponse.data.length,
        });

        console.log("Updated booking stats:", {
          tourBookings: tourResponse.data.length,
          koiBookings: koiResponse.data.length,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching booking stats:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          console.error("Error status:", error.response.status);
        }
        setIsLoading(false);
      }
    };

    if (token) {
      fetchBookingStats();
    } else {
      console.error("No token available");
    }
  }, [token]);

  return (
    <div className="relative">
      {/* Main content starts below Navbar (24rem from top) */}
      <div className="min-h-screen bg-gray-100 pt-24">
        <Layout>
          {/* Sidebar */}
          <SiderBoard />

          {/* Main Content Area */}
          <Layout className="ml-[280px]">
            <Content className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-9xl">
              {/* Header Stats */}
              <div className="relative bg-blue-600 md:pt-32 pb-32 pt-12">
                <div className="px-4 md:px-10 mx-auto w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Tour Bookings Stats Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 font-semibold">
                            TOUR BOOKINGS
                          </p>
                          <h5 className="text-xl font-bold text-gray-800">
                            {isLoading
                              ? "Loading..."
                              : bookingStats.tourBookings}
                          </h5>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-full">
                          <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm text-blue-500 mt-4">
                        <span className="font-bold">Tour</span>
                        <span className="ml-2">Bookings</span>
                      </p>
                    </div>

                    {/* Koi Bookings Stats Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 font-semibold">
                            KOI BOOKINGS
                          </p>
                          <h5 className="text-xl font-bold text-gray-800">
                            {bookingStats.koiBookings}
                          </h5>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-full">
                          <svg
                            className="w-6 h-6 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm text-red-500 mt-4">
                        <span className="font-bold">Koi</span>
                        <span className="ml-2">Bookings</span>
                      </p>
                    </div>

                    {/* Total Bookings Stats Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 font-semibold">
                            TOTAL BOOKINGS
                          </p>
                          <h5 className="text-xl font-bold text-gray-800">
                            {bookingStats.tourBookings +
                              bookingStats.koiBookings}
                          </h5>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-full">
                          <svg
                            className="w-6 h-6 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm text-green-500 mt-4">
                        <span className="font-bold">All</span>
                        <span className="ml-2">Bookings</span>
                      </p>
                    </div>

                    {/* You can add more stat cards here */}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="-mt-24 pb-12">
                <div className="container mx-auto px-4">
                  <div className="flex flex-wrap">
                    <div className="w-full">
                      <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg shadow-lg">
                        <div className="px-6 py-6">
                          <Routes>
                            <Route path="dashboard" element={<Dashboard2 />} />
                            <Route path="quotation" element={<Quotation />} />
                            <Route
                              path="booking-list-for-staff"
                              element={<BookingListForStaff />}
                            />
                            <Route
                              path="checkin-service"
                              element={<CheckinService />}
                            />
                            <Route
                              path="booking-for-koi-list"
                              element={<BookingForKoiList />}
                            />
                            <Route
                              path="deposit-list"
                              element={<DepositList />}
                            />
                            <Route
                              path="booking-koi-for-delivery"
                              element={<BookingKoiForDelivery />}
                            />
                            <Route
                              path="delivery-management"
                              element={<DeliveryManagement />}
                            />
                            <Route
                              path="accepted-tour-list"
                              element={<AcceptedTourList />}
                            />
                          </Routes>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>

      {/* Footer */}
      <footer className="block py-4 bg-white shadow-lg rounded-lg mx-4 -mb-4">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-gray-200" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm text-gray-500 font-semibold py-1 text-center md:text-left">
                © {new Date().getFullYear()}{" "}
                <span className="text-gray-500 hover:text-gray-700 text-sm font-semibold">
                  Koi Legend
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StaffDashboard;
