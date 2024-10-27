// BookingForKoiList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingForKoiList = () => {
  const [bookings, setBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const token = cookies.token;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/bookings/BookingForKoi`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to fetch bookings");
        setErrorMessage("Failed to fetch bookings");
      }
    };

    fetchBookings();
  }, [token]);

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow-md rounded-lg mt-40 text-black">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4 text-black">Booking For Koi List</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} className="border-b mb-4 pb-2">
              <p><strong>Booking ID:</strong> {booking.id}</p>
              <p><strong>Customer ID:</strong> {booking.customerID}</p>
              <p><strong>Name:</strong> {booking.nameCus}</p>
              <p><strong>Total Amount:</strong> {booking.totalAmount}</p>
              <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingForKoiList;
