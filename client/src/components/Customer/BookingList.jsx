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
        `http://localhost:8080/bookings/listBookingTourResponse/${userId}`,
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tour Booking List</h1>
      {tourlist.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Tour Name</th>
              <th className="py-2">Customer Name</th>
              <th className="py-2">Created By</th>
              <th className="py-2">Updated By</th>
            </tr>
          </thead>
          <tbody>
            {tourlist.map((booking) => (
              <tr key={booking.id}>
                <td className="border px-4 py-2">{booking.tourName}</td>
                <td className="border px-4 py-2">{booking.nameCus}</td>
                <td className="border px-4 py-2">
                  {booking.createdBy || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {booking.updatedBy || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingList;
