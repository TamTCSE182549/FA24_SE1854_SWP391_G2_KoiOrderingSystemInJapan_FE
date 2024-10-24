import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useCookies } from "react-cookie"; // Thêm useCookies để lấy token từ cookie

const BookingInformation = () => {
    const [cookies] = useCookies(["token"]);
    const token = cookies.token;
    const [bookingList, setBookingList] = useState([]);
    const navigate = useNavigate();

//   useEffect(() => {
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setUserId(decodedToken.sub); // Cập nhật userId từ decoded token
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, [token]);

  // Lấy dữ liệu từ API
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const bookingListResponse = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/bookings/listBookingTourResponse',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setBookingList(response.data);
      }
    } catch (error) {
      console.error("Error fetching Booking data:", error);
      setError("Failed to fetch Booking data.");
    }
  };

  const handleCreateQuotation = (booking) => {
    if(!token) {
      toast.warning("You are not logged in. Please login.");
      navigate(`/login`);
    } else {
      navigate(`/createQuotation/${booking.id}`, { state: { bookingData: booking } });
    }
  };

  useEffect(() => {
    bookingListResponse();
  }, []);

  if (!bookingList.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-32 pl-60 pr-60 grid grid-cols-1 gap-6 p-6">
      {bookingList.map((booking, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row"
        >
          <div className="md:w-2/4 text-center">
            <img
              src=".\src\assets\koicart.jpg"
              alt="Koi Fish"
              className="rounded-lg object-cover w-full h-60"
            />
            <p className="mt-4 text-gray-700 text-2xl font-semibold pt-20">
              BOOKING TIME: {formatDateTime(booking.createdDate)}
            </p>
          </div>
          <div className="md:w-2/3 mt-4 md:mt-0 md:ml-6 shadow-[60px_60px_60px_60px_rgba(0,0,0,0.3)] p-10 rounded-2xl ">
            <h2 className="text-5xl font-bold text-red-600"><text>Booking Information</text></h2>
            <div className="mt-4 text-lg">
              <p className="mt-1 text-black text-2xl">
                VAT: <span className="text-red-600"><strong>{booking.vat}</strong></span>
              </p>
              <p className="mt-1 text-black text-2xl">
                VAT AMOUNT: <span className="text-red-600"><strong>{booking.vatAmount}</strong></span>
              </p>
              <p className="mt-1 text-black text-2xl">
                DISCOUNT AMOUNT: <span className="text-red-600"><strong>{booking.discountAmount}</strong></span>
              </p>
              <p className="mt-1 text-black text-2xl">
                TOTAL AMOUNT: <span className="text-red-600"><strong>{booking.totalAmount}</strong></span>
              </p>
              <p className="mt-1 text-black text-2xl">
                PAYMENT METHOD: <span className="text-red-600"><strong>{booking.paymentMethod}</strong></span>
              </p>
              <p className="mt-1 text-black text-2xl">
                PAYMENT STATUS: <span className="text-blue-600 uppercase"><strong>{booking.paymentStatus}</strong></span>
              </p>
              <p className="mt-1 text-2xl underline font-bold text-black">
              <strong>TOTAL AMOUNT WITH VAT:</strong> {booking.totalAmountWithVAT}
              </p>
            </div>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              View Detail
            </button>
            <span className="px-2"></span>
            <button 
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => handleCreateQuotation(booking)}
            >
              Create Quotation
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingInformation;