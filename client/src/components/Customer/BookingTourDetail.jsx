import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

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

  return (
    <div className="pt-32 pl-80 pr-80">
      <h2 className="text-3xl font-bold text-center mb-8 bg-black">
        Booking Tour Details
      </h2>
      {bookingTourDetails.length === 0 ? (
        <p>No details found for this booking.</p>
      ) : (
        <table className="min-w-full bg-white rounded-2xl mb-20">
          <thead>
            <tr>
              <th className="py-2 px-4 text-center text-black">Tour Name</th>
              <th className="py-2 px-4 text-center text-black">Participant</th>
              <th className="py-2 px-4 text-center text-black">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookingTourDetails.map((detail) => (
              <tr
                key={detail.bookingTourDetailID}
                className="hover:bg-gray-100"
              >
                <td className="py-2 px-4 text-black text-center">{detail.tourName}</td>
                <td className="py-2 px-4 text-black text-center">{detail.participant}</td>
                <td className="py-2 px-4 text-black text-center">
                  ${detail.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ToastContainer />
    </div>
  );
};

export default BookingTourDetail;
