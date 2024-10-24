import React, { useState } from "react";

const CreateBooking = () => {
  const [bookingData, setBookingData] = useState({
    vat: "",
    vatAmount: "",
    discountAmount: "",
    totalAmount: "",
    paymentMethod: "",
    paymentStatus: "",
    totalWithVat: "",
    bookingTime: "",
  });

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Created:", bookingData);
    // Implement logic to save the booking data
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-40">
      <h2 className="text-2xl font-bold mb-4 text-black">Create New Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <strong className="text-center font-bold text-lg text-black">
          Booking Information
        </strong>

        <label className="block mb-1 text-black">
          <strong>VAT:</strong>
        </label>
        <input
          type="text"
          name="vat"
          placeholder="VAT"
          value={bookingData.vat}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block mb-1 text-black">
          <strong>VAT Amount:</strong>
        </label>
        <input
          type="text"
          name="vatAmount"
          placeholder="VAT Amount"
          value={bookingData.vatAmount}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block mb-1 text-black">
          <strong>Discount Amount:</strong>
        </label>
        <input
          type="text"
          name="discountAmount"
          placeholder="Discount Amount"
          value={bookingData.discountAmount}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block mb-1 text-black">
          <strong>Total Amount:</strong>
        </label>
        <input
          type="text"
          name="totalAmount"
          placeholder="Total Amount"
          value={bookingData.totalAmount}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block mb-1 text-black">
          <strong>Payment Method:</strong>
        </label>
        <input
          type="text"
          name="paymentMethod"
          placeholder="Payment Method"
          value={bookingData.paymentMethod}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block mb-1 text-black">
          <strong>Payment Status:</strong>
        </label>
        <input
          type="text"
          name="paymentStatus"
          placeholder="Payment Status"
          value={bookingData.paymentStatus}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block mb-1 text-black">
          <strong>Total Amount with VAT:</strong>
        </label>
        <input
          type="text"
          name="totalWithVat"
          placeholder="Total Amount with VAT"
          value={bookingData.totalWithVat}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block mb-1 text-black">
          <strong>Booking Time:</strong>
        </label>
        <input
          type="text"
          name="bookingTime"
          placeholder="Booking Time"
          value={bookingData.bookingTime}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700"
        >
          Save Booking
        </button>
      </form>
    </div>
  );
};

export default CreateBooking;
