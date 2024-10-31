import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Table, Button } from "antd";

const BookingTourDetail = () => {
  const [bookingTourDetails, setBookingTourDetails] = useState([]);
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
            Authorization: `Bearer ${token}`, // Ensure the token is correctly passed
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setBookingTourDetails(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch Booking Tour Details");
    } finally {
      setLoading(false);
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
      title: "Participant",
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
    <div className="flex flex-col items-center pt-32 px-6">
      <div className="bg-white shadow-md rounded-lg p-8 mb-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Booking Tour Details
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Explore the details of your bookings and get ready for an amazing experience!
        </p>
      </div>
      
      {bookingTourDetails.length === 0 ? (
        <div className="text-center text-gray-500">No details found for this booking.</div>
      ) : (
        <Table
          columns={columns}
          dataSource={bookingTourDetails}
          rowKey="bookingTourDetailID"
          pagination={false}
          className="w-full rounded-2xl shadow-lg"
          locale={{
            emptyText: <span className="text-center">No details found.</span>,
          }}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default BookingTourDetail;
