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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Tour List</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full  bg-[#c5bd92]">
          <thead>
            <tr>
              <th className="py-2 border px-4 text-black">Tour Name</th>
              <th className="py-2 border px-4 text-black">Unit Price</th>
              <th className="py-2 border px-4 text-black">Max Participants</th>
              <th className="py-2 border px-4 text-black">Description</th>
              <th className="py-2 border px-4 text-black">Start Time</th>
              <th className="py-2 border px-4 text-black">End Time</th>
            </tr>
          </thead>
          <tbody>
            {/* Kiểm tra nếu tours là một mảng */}
            {Array.isArray(tours) && tours.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No tours found.
                </td>
              </tr>
            ) : (
              Array.isArray(tours) &&
              tours.map((tour) => (
                <tr key={tour.id}>
                  <td className="border px-4 py-2">{tour.tourName}</td>
                  <td className="border px-4 py-2">{tour.unitPrice}</td>
                  <td className="border px-4 py-2">{tour.maxParticipants}</td>
                  <td className="border px-4 py-2">{tour.description}</td>
                  <td className="border px-4 py-2">
                    {new Date(tour.startTime).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(tour.endTime).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tour;
