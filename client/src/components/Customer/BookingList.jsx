import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie"; // Thêm useCookies để lấy token từ cookie
import { jwtDecode } from "jwt-decode"; // Import đúng jwtDecode (không cần {})

const BookingList = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [userId, setUserId] = useState(null);
  const [tourlist, setTourlist] = useState([]);

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
      setTourlist(response.data);

      console.log(response.data);

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.log("Error fetching booking list:", error);
    }
  };

  // useEffect để decode token
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.sub); // Cập nhật userId từ decoded token
        console.log("Decoded Token:", decodedToken.sub);
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
  }, [userId]); // Chỉ gọi khi userId được cập nhật

  return (
    <div>
      <h1>Booking List</h1>
      <ul>
        {tourlist.map((tour) => (
          <li key={tour.id}>{tour.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
