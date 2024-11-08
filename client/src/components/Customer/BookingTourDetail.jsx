import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Table, Button } from "antd";

const BookingTourDetail = () => {
  const [bookingTourDetails, setBookingTourDetails] = useState([]);
  const [tourDetails, setTourDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { booking } = location.state || {};
  // Lấy token từ cookies
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  // Gọi API để lấy chi tiết booking tour
  const fetchBookingTourDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/BookingTourDetail/${booking.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setBookingTourDetails(response.data);
        if (response.data && response.data.length > 0 && response.data[0].tourID) {
          await fetchTourDetails(response.data[0].tourID);
        }
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error("Failed to fetch Booking Tour Details");
    } finally {
      setLoading(false);
    }
  };

  // Add new function to fetch tour details
  const fetchTourDetails = async (tourId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/tour/findById/${tourId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setTourDetails(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch Tour Details");
    }
  };

  useEffect(() => {
    fetchBookingTourDetails();
  }, [booking]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: "Tour Name",
      dataIndex: "tourName",
      key: "tourName",
      align: "center",
    },
    {
      title: "Participants",
      dataIndex: "participant",
      key: "participant",
      align: "center",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => <span>${text.toFixed(2)}</span>,
      align: "center",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-indigo-900 mb-4">
            Booking Details
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
            Review your booking information and explore the exciting details of your upcoming adventure
          </p>
        </div>
      </div>

      {/* Booking Table Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500">
            <h3 className="text-xl font-semibold text-white">Booking Summary</h3>
          </div>
          <div className="p-6">
            <Table
              columns={columns}
              dataSource={bookingTourDetails}
              rowKey="bookingTourDetailID"
              pagination={false}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Tour Details Section */}
      {tourDetails && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
            {/* Tour Image Container */}
            <div className="relative h-[500px]">
              <img 
                src={tourDetails.tourImg} 
                alt={tourDetails.tourName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    tourDetails.tourStatus === 'active' 
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                      : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                  }`}>
                    {tourDetails.tourStatus}
                  </span>
                  <span className="text-white bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
                    ${tourDetails.unitPrice}
                  </span>
                </div>
                <h3 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{tourDetails.tourName}</h3>
              </div>
            </div>

            {/* Tour Information */}
            <div className="p-8 bg-gradient-to-b from-white to-indigo-50">
              {/* Description */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-indigo-900 mb-4">About This Tour</h4>
                <p className="text-indigo-700 leading-relaxed">{tourDetails.description}</p>
              </div>

              {/* Tour Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Time Information */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-indigo-900 mb-1">Start Time</p>
                      <p className="text-indigo-700">
                        {new Date(tourDetails.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-indigo-900 mb-1">End Time</p>
                      <p className="text-indigo-700">
                        {new Date(tourDetails.endTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-indigo-900 mb-1">Price</p>
                      <p className="text-indigo-700">${tourDetails.unitPrice}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default BookingTourDetail;
