import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const statusStyles = {
  pending: 'bg-yellow-200 text-yellow-800',
  processing: 'bg-blue-200 text-blue-800',
  shipped: 'bg-green-200 text-green-800',
  delivery: 'bg-purple-200 text-purple-800',
  cancelled: 'bg-red-200 text-red-800',
  complete: 'bg-gray-200 text-gray-800',
};

const BookingForKoiList = () => {
  const [bookings, setBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookies] = useCookies(['accountId', 'token']);

  const token = cookies.token;
  const navigate = useNavigate();
  const accountId = cookies.accountId;
  console.log("Account ID:", accountId);
  const role = cookies.role; // Lấy vai trò từ cookie

  useEffect(() => {

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/bookings/kois/list/${accountId}`, {
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
  }, [token, role, navigate, accountId]);

  const handleContactStaff = () => {
    navigate('/contact-staff'); // Điều hướng đến trang liên hệ
  };

  return (
    <div className="p-6 max-w-full mx-auto bg-white shadow-lg rounded-lg mt-20 text-black">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Danh Sách Đặt Hàng Koi</h2>
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">Không có đơn đặt hàng nào.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} className="bg-gray-50 border border-gray-300 rounded-lg mb-3 p-3 hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <div className="flex flex-col md:flex-1">
                  <span className="font-semibold text-gray-700 text-sm">ID Đặt Hàng:</span>
                  <span className="font-medium text-sm">{booking.id}</span>
                </div>
                <div className="flex flex-col md:flex-1">
                  <span className="font-semibold text-gray-700 text-sm">Tên Khách Hàng:</span>
                  <span className="font-medium text-sm">{booking.nameCus}</span>
                </div>
                <div className="flex flex-col md:flex-1">
                  <span className="font-semibold text-gray-700 text-sm">Tổng Số Tiền Với VAT:</span>
                  <span className="font-medium text-green-600 text-sm">{booking.totalAmountWithVAT} VNĐ</span>
                </div>
                <div className="flex flex-col md:flex-1">
                  <span className="font-semibold text-gray-700 text-sm">Trạng Thái Thanh Toán:</span>
                  <span className={`font-medium text-xs py-1 px-2 rounded inline-block ${statusStyles[booking.paymentStatus]}`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleContactStaff}
                className="mt-2 bg-green-500 text-white rounded py-1 px-3 hover:bg-green-600 transition duration-200">
                Liên hệ với Nhân viên
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingForKoiList;
