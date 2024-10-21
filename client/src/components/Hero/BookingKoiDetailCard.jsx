import React from "react";

const BookingInfoCard = ({ booking, role }) => {
  return (
    <div className="flex p-4 backdrop-filter backdrop-blur-3xl rounded-xl shadow-md mb-6">
      {/* Image Section */}
      <div className="w-1/3 flex items-center justify-center">
        <img
          src={booking.image}
          alt="Koi Fish"
          className="w-48 h-32 object-cover rounded-lg"
        />
      </div>

      {/* Divider */}
      <div className="border-l border-gray-300 mx-4"></div>

      {/* Booking Information Section */}
      <div className="w-2/3">
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          Booking Information
        </h2>
        <p className="mb-1 font-light text-sm">
          <strong className="text-white">VAT:</strong>{" "}
          <span className="text-green-400">{booking.vat}</span>
        </p>
        <p className="mb-1 font-light text-sm">
          <strong className="text-white">VAT Amount:</strong>{" "}
          <span className="text-green-400">{booking.vatAmount}</span>
        </p>
        <p className="mb-1 font-light text-sm">
          <strong className="text-white">Discount Amount:</strong>{" "}
          <span className="text-green-400">{booking.discountAmount}</span>
        </p>
        <p className="mb-1 font-light text-sm">
          <strong className="text-white">Total Amount:</strong>{" "}
          <span className="text-green-400">{booking.totalAmount}</span>
        </p>
        <p className="mb-1 font-light text-sm">
          <strong className="text-white">Payment Method:</strong>{" "}
          <span className="text-green-400">{booking.paymentMethod}</span>
        </p>
        <p className="mb-1 font-light text-sm">
          <strong className="text-white">Payment Status:</strong>{" "}
          <span className="text-green-400">{booking.paymentStatus}</span>
        </p>
        <p className="mb-1 font-light text-sm">
          <strong className="text-white">Total Amount with VAT:</strong>{" "}
          <span className="text-green-400">{booking.totalWithVat}</span>
        </p>
        <p className="mt-2 font-light text-sm">
          <strong className="text-white">Booking Time:</strong>{" "}
          <span className="text-green-400">{booking.bookingTime}</span>
        </p>
      </div>

      {/* Conditional Buttons */}
      <div className="flex items-center ml-4">
        {role === "customer" ? (
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md shadow hover:bg-gray-700">
            View
          </button>
        ) : (
          <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700">
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingInfoCard;
