import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode"; // Ensure correct import
import { useLocation } from "react-router-dom";
import 'react-notifications/lib/notifications.css';
// import {NotificationContainer, NotificationManager} from 'react-notifications';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer và toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho Toast

const BookingTrip = () => {
  const [tourID, setTourID] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [participants, setParticipants] = useState(1);
  const [message, setMessage] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);
  const location = useLocation();
  const { tour } = location.state || {};

  //mesage
  // useEffect(() => {
  //   if (message) {
  //     const timer = setTimeout(() => {
  //       setMessage(""); // Ẩn thông báo sau 5 giây
  //     }, 5000);
  //     return () => clearTimeout(timer); // Dọn dẹp bộ hẹn giờ khi component unmount
  //   }
  // }, [message]);

  // Lấy token từ cookies
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  // Sử dụng useEffect để giải mã token khi token thay đổi
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded); // Lưu token đã giải mã vào state
        console.log("Decoded Token:", decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.log("No token found");
    }
  }, [token]);

  // Hàm gửi yêu cầu booking
  const handleBooking = async (e) => {
    e.preventDefault();

    // if (!token) {
    //   setMessage("Token not found or invalid. Please log in.");
    //   return;
    // }

    if (!token) {
      toast.error("Token not found or invalid. Please log in."); // Hiển thị thông báo lỗi
      return;
    }

    // Dữ liệu booking tương ứng với BookingRequest class
    const bookingData = {
      tourID: Number(tour.id),
      paymentMethod: paymentMethod,
      participants: Number(participants),
    };

    try {
      if(participants<=tour.remaining){
        const response = await axios.post(
          "http://localhost:8080/bookings/CreateForTour",
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure the token is correctly passed
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Booking successful:", response.data);
        // NotificationManager.success("Booking successful!", "Success", 5000);
        toast.success("Booking successful!");
      } else {
        toast.warning("Participants must be less than or equal remaning of tour AND must be greater than 0");
      }
      
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(error.response.data.message || "Failed to book the trip. Please try again."); // Hiển thị thông báo lỗi
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        console.error("Error message:", error.message);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="text-black">
      {/* <h1 className="text-xl font-bold">Book a Trip</h1> */}
      {/* <form onSubmit={handleBooking}>
        <div className="mb-4">
          <label className="block">Tour: </label>
          <input 
            value={tour.tourName} // Hiển thị tên tour
            readOnly
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <input 
            type="hidden" 
            value={tour.tourID} // Lưu tourID ẩn
            onChange={(e) => setTourID(e.target.value)} 
          />
        </div>
        <div className="mb-4">
          <label className="block">Payment Method: </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="CASH">Cash</option>
            <option value="VISA">Visa</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Number of Participants: </label>
          <input
            type="number"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            min="1"
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Book Trip
        </button>
      </form> */}

      <form
        onSubmit={handleBooking}
        className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Book Your Trip
        </h2>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Tour:</label>
          <input
            value={tour.tourName} // Hiển thị tên tour
            readOnly
            className="border border-gray-300 rounded-md p-2 w-full bg-gray-100"
          />
          <input
            type="hidden"
            value={tourID} // Lưu tourID ẩn
            onChange={(e) => setTourID(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Remaning of Tour:</label>
          <input
            value={tour.remaining} // Hiển thị tên tour
            readOnly
            className="border border-gray-300 rounded-md p-2 w-full bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="CASH">Cash</option>
            <option value="VISA">Visa</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Number of Participants:
          </label>
          <input
            type="number"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            min="1"
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Book Trip
        </button>
      </form>
      {/* <NotificationContainer /> Đặt NotificationContainer ở đây */}
      <ToastContainer />
    </div>
  );
};

export default BookingTrip;
