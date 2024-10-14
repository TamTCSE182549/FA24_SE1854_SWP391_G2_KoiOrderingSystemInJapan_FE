import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode"; // Ensure correct import

const BookingTrip = () => {
  const [tourID, setTourID] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [participants, setParticipants] = useState(1);
  const [message, setMessage] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);

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

    if (!token) {
      setMessage("Token not found or invalid. Please log in.");
      return;
    }

    // Dữ liệu booking tương ứng với BookingRequest class
    // const bookingData = {
    //   tourID: Number(tourID),
    //   paymentMethod: paymentMethod,
    //   participants: participants,
    // };

    try {
      const response = await axios.post(
        "http://localhost:8080/bookings/create",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the token is correctly passed
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Booking successful:", response.data);
      setMessage("Booking successful!");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        setMessage(
          error.response.data.message ||
            "Failed to book the trip. Please try again."
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        setMessage("No response from server. Please check your connection.");
      } else {
        console.error("Error message:", error.message);
        setMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="text-black">
      <h1 className="text-xl font-bold">Book a Trip</h1>
      <form onSubmit={handleBooking}>
        <div className="mb-4">
          <label className="block">Tour ID: </label>
          <input
            type="text"
            value={tourID}
            onChange={(e) => setTourID(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
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
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default BookingTrip;
