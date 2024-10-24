import React from "react";
import BookingInfoCard from "./BookingKoiDetailCard";
import { useNavigate } from "react-router-dom";
const BookingInfoList = ({ role }) => {
  const navigate = useNavigate();
  const handleCreateBooking = () => {
    navigate("/createbooking");
  };
  // Mock Data: List of bookings
  const bookings = [
    {
      image: "https://via.placeholder.com/150",
      bookingTime: "10/19/2024 16:30:00",
      vat: 0.2,
      vatAmount: 1000,
      discountAmount: 100,
      totalAmount: 2000,
      paymentMethod: "VISA",
      paymentStatus: "PENDING",
      totalWithVat: 2400,
    },
    {
      image: "https://via.placeholder.com/150",
      bookingTime: "10/20/2024 12:00:00",
      vat: 0.15,
      vatAmount: 800,
      discountAmount: 50,
      totalAmount: 1500,
      paymentMethod: "MASTERCARD",
      paymentStatus: "COMPLETED",
      totalWithVat: 1725,
    },
    {
      image: "https://via.placeholder.com/150",
      bookingTime: "10/21/2024 08:15:00",
      vat: 0.18,
      vatAmount: 900,
      discountAmount: 75,
      totalAmount: 1800,
      paymentMethod: "PAYPAL",
      paymentStatus: "PENDING",
      totalWithVat: 2125,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-40">
      {/* Conditionally render the Create Button */}
      {role !== "customer" && (
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
            onClick={handleCreateBooking}
          >
            Create
          </button>
        </div>
      )}

      {/* List of BookingInfoCard */}
      {bookings.map((booking, index) => (
        <BookingInfoCard key={index} booking={booking} role={role} />
      ))}
    </div>
  );
};

export default BookingInfoList;
