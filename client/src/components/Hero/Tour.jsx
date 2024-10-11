import React, { useState, useEffect } from "react";
import axios from "axios";

const Tour = () => {
  const [tours, setTours] = useState([]); // State để lưu trữ dữ liệu tour
  const [error, setError] = useState(null); // State để lưu trữ lỗi nếu có

  // Hàm lấy dữ liệu từ API
  const fetchTourData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/tour/list");
      setTours(response.data); // Lưu dữ liệu tour vào state
      console.log(response.data); // In ra console để kiểm tra
    } catch (error) {
      console.error("Error fetching tour data:", error);
      setError("Failed to fetch tour data"); // Lưu lỗi vào state
    }
  };

  // Sử dụng useEffect để gọi API khi component được render lần đầu
  useEffect(() => {
    fetchTourData();
  }, []);

  return <></>;
};

export default Tour;
