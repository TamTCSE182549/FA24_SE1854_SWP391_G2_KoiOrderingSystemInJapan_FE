import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const BookingManagement = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // Fetch bookings data from the API
  useEffect(() => {
    axios
      .get("http://localhost:8080/bookings/BookingForTour", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }) // Adjust API endpoint if needed
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Error fetching booking data:", error));
  }, []);

  // Handle delete action
  const handleDelete = (booking) => {
    console.log("Deleting booking:", booking);
  };

  // Handle update action
  const handleUpdate = (booking) => {
    console.log("Updating booking:", booking);
  };

  const handleCreateBookingKoi = (bookingId) => {
    navigate(`/booking-koi/${bookingId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Booking Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                ID
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Customer ID
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Customer Name
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Total Amount
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                VAT
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                VAT Amount
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Discount Amount
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Total Amount with VAT
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Booking Type
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Payment Method
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Payment Status
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Payment Date
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Created By
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Created Date
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Updated By
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Updated Date
              </th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.id}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.customerID}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.nameCus}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.totalAmount}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.vat}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.vatAmount}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.discountAmount}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.totalAmountWithVAT}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.bookingType}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.paymentMethod}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.paymentStatus}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.paymentDate}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.createdBy}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.createdDate}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.updatedBy}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {booking.updatedDate}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleUpdate(booking)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(booking)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleCreateBookingKoi(booking.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded"
                  >
                    Create Booking Koi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
