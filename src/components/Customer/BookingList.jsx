import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie"; // Thêm useCookies để lấy token từ cookie
import { jwtDecode } from "jwt-decode"; // Import đúng jwtDecode (không cần {})

const BookingList = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [userId, setUserId] = useState(null);
  const [tourlist, setTourlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm để lấy dữ liệu đặt chỗ
  const fetchBookingList = async (userId) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/bookings/listBookingTourResponse",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTourlist(response.data); // Cập nhật danh sách tour vào state
      setLoading(false); // Dừng loading sau khi có dữ liệu
    } catch (error) {
      console.log("Error fetching booking list:", error);
      setError("Failed to fetch booking list. Please try again.");
      setLoading(false); // Dừng loading khi gặp lỗi
    }
  };

  // useEffect để decode token
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.sub); // Cập nhật userId từ decoded token
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  // useEffect để gọi API khi userId được cập nhật
  useEffect(() => {
    if (userId) {
      fetchBookingList(userId); // Gọi API sau khi userId đã có giá trị
    }
  }, [userId]);

  // Nếu đang loading
  if (loading) {
    return <p>Loading...</p>;
  }

  // Nếu có lỗi khi tải dữ liệu
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Hiển thị dữ liệu booking
  return (
    // 
    <div className="grid grid-cols-1 gap-6 p-6">
      {bookingList.map((booking, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row"
        >
          <div className="md:w-1/3 text-center">
            <img
              src="https://pics.craiyon.com/2023-11-06/0bf2f94c7ce64f9688d24f54e24b034f.webp"
              alt="Koi Fish"
              className="rounded-lg object-cover w-full h-48"
            />
            <p className="mt-4 text-gray-600 text-sm">
              BOOKING TIME: {booking.bookingTime}
            </p>
          </div>
          <div className="md:w-2/3 mt-4 md:mt-0 md:ml-6">
            <h2 className="text-xl font-bold text-red-600">Booking Information</h2>
            <p className="mt-2">
              <strong>VAT:</strong> {booking.vat}
            </p>
            <p className="mt-2">
              <strong>VAT AMOUNT:</strong> {booking.vatAmount}
            </p>
            <p className="mt-2">
              <strong>DISCOUNT AMOUNT:</strong> {booking.discountAmount}
            </p>
            <p className="mt-2 text-red-600">
              <strong>TOTAL AMOUNT:</strong> {booking.totalAmount}
            </p>
            <p className="mt-2 text-red-600">
              <strong>PAYMENT METHOD:</strong> {booking.paymentMethod}
            </p>
            <p className="mt-2 text-blue-600">
              <strong>PAYMENT STATUS:</strong> {booking.paymentStatus}
            </p>
            <p className="mt-2 font-bold">
              <strong>TOTAL AMOUNT WITH VAT:</strong> {booking.totalAmountWithVAT}
            </p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              View Detail
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
