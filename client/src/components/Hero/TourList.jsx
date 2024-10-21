import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode"; // Để decode JWT
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";


const Tour = () => {
  const [tours, setTours] = useState([]); // State to store tour data
  const [error, setError] = useState(null); // State to store any errors
  const [filters, setFilters] = useState({
    privatePool: false,
    villas: false,
    swimmingPool: false,
    beachfront: false,
    parking: false,
  });
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại (bắt đầu từ 0)
  const [totalPage, setTotalPage] = useState(1); // Tổng số trang (giả sử mặc định là 1)
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;

  const hardcodedTours = [
    {
      id: 1,
      tourName: "Amazing Vung Tau Beach Tour",
      unitPrice: 150,
      maxParticipants: 30,
      description: "Enjoy the beautiful beaches of Vung Tau with this tour.",
      startTime: "2024-10-20T09:00:00",
      endTime: "2024-10-21T18:00:00",
      facilities: { privatePool: true, villas: true, swimmingPool: true },
    },
    {
      id: 2,
      tourName: "Luxury Mekong Delta Cruise",
      unitPrice: 300,
      maxParticipants: 20,
      description: "Experience the tranquility of the Mekong Delta.",
      startTime: "2024-11-01T08:00:00",
      endTime: "2024-11-03T16:00:00",
      facilities: { privatePool: false, villas: true, swimmingPool: false },
    },
    {
      id: 3,
      tourName: "Adventure to Fansipan",
      unitPrice: 200,
      maxParticipants: 15,
      description:
        "Conquer the roof of Indochina with this thrilling adventure.",
      startTime: "2024-12-10T07:00:00",
      endTime: "2024-12-12T17:00:00",
      facilities: { privatePool: true, villas: false, swimmingPool: true },
    },
    {
      id: 4,
      tourName: "Adventure to Fansipan",
      unitPrice: 200,
      maxParticipants: 15,
      description:
        "Conquer the roof of Indochina with this thrilling adventure.",
      startTime: "2024-12-10T07:00:00",
      endTime: "2024-12-12T17:00:00",
      facilities: { privatePool: true, villas: false, swimmingPool: true },
    },
  ];

  const navigate = useNavigate();

  const handleBooking = (tour) => {
    // Điều hướng sang trang booking và truyền tour object qua state

    navigate(`/tourdetail/${tour.id}`);

  };

  const fetchTourData = async (page = 0) => {
    try {
      // const response = await axios.get("http://localhost:8080/tour/listTourResponseActive");
      const response = await axios.get(

        `http://localhost:8080/tour/showAllPageable?page=${page}`

      );
      if (Array.isArray(response.data.content)) {
        setTours(response.data.content);
        setTotalPage(response.data.totalPage);
      } else {
        setTours(hardcodedTours);
      }
      console.log("Tour Data:", response.data.content);
    } catch (error) {
      console.error("Error fetching tour data:", error);
      setError("Failed to fetch tour data. Displaying fallback data.");
      setTours(hardcodedTours); // Display hardcoded data on API failure
    }
  };

  useEffect(() => {
    fetchTourData(currentPage); // Gọi API mỗi khi `currentPage` thay đổi
  }, [currentPage]);

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const filteredTours = tours.filter((tour) => {
    if (filters.privatePool && !tour.facilities.privatePool) return false;
    if (filters.villas && !tour.facilities.villas) return false;
    if (filters.swimmingPool && !tour.facilities.swimmingPool) return false;
    return true; // Return all tours that match the filters
  });

  useEffect(() => {
    fetchTourData();
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPage - 1) {
      setCurrentPage((prevPage) => prevPage + 1); // Tăng trang nếu chưa đến trang cuối
      window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn về đầu trang
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1); // Giảm trang nếu chưa đến trang đầu
      window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn về đầu trang
    }
  };

  return (
    <div className="min-h-screen flex flex-col mt-40">
      <div className="flex-grow">
        <div className="container mx-auto p-40">
          <div className="flex">
            {/* Sidebar Filters */}
            <div className="w-1/4 p-4  rounded-lg bg-[#c5bd92] shadow-md">
              <h2 className="text-xl text-gray-800 font-bold mb-4">
                Filter by:
              </h2>
              {/* Popular Filters */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Popular Filters</h3>
                <div className="mb-2">
                  <input
                    type="checkbox"
                    name="privatePool"
                    checked={filters.privatePool}
                    onChange={handleFilterChange}
                  />
                  <label className="ml-2">Private pool</label>
                </div>
                <div className="mb-2">
                  <input
                    type="checkbox"
                    name="villas"
                    checked={filters.villas}
                    onChange={handleFilterChange}
                  />
                  <label className="ml-2">Villas</label>
                </div>
                <div className="mb-2">
                  <input
                    type="checkbox"
                    name="swimmingPool"
                    checked={filters.swimmingPool}
                    onChange={handleFilterChange}
                  />
                  <label className="ml-2">Swimming Pool</label>
                </div>
              </div>
              {/* Beach Access */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Beach Access</h3>
                <div className="mb-2">
                  <input
                    type="checkbox"
                    name="beachfront"
                    checked={filters.beachfront}
                    onChange={handleFilterChange}
                  />
                  <label className="ml-2">Beachfront</label>
                </div>
              </div>
              {/* Facilities */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Facilities</h3>
                <div className="mb-2">
                  <input
                    type="checkbox"
                    name="parking"
                    checked={filters.parking}
                    onChange={handleFilterChange}
                  />
                  <label className="ml-2">Parking</label>
                </div>
              </div>
            </div>

            {/* Tour List */}
            <div className="w-3/4 ml-4">

              <div className="flex items-center mb-4">
                <h1 className="text-2xl font-bold text-white mr-4">
                  Tour List
                </h1>
                <input
                  type="search"
                  placeholder="Tìm kiếm..."
                  aria-label="Search"
                  className="border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600"
                >
                  Search
                </button>
              </div>

              {error && <p className="text-red-500">{error}</p>}
              <div className="space-y-6">
                {filteredTours.length === 0 ? (
                  <p>No tours found.</p>
                ) : (
                  filteredTours.map((tour) => (
                    <div
                      key={tour.id}
                      className="bg-slate-300 shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
                    >
                      <img
                        src={
                          tour.tourImg
                            ? tour.tourImg
                            : `https://via.placeholder.com/400x200?text=No+image`
                        }
                        alt={tour.tourName}
                        className="w-full h-64 object-none shadow-2xl"
                      />
                      <div className="p-4 flex-grow">
                        <h3 className="text-xl font-bold mb-2 text-black">
                          {tour.tourName}
                        </h3>
                        <p className="text-gray-700 mb-2">{tour.description}</p>
                        <p className="text-sm text-gray-500">
                          Price: {tour.unitPrice} USD
                        </p>
                        <p className="text-sm text-gray-500">
                          Max Participants: {tour.maxParticipants}
                        </p>
                        <p className="text-sm text-gray-500">
                          Remaining: {tour.remaining}
                        </p>
                        <p className="text-sm text-gray-500">
                          Start Time:{" "}
                          {new Date(tour.startTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          End Time: {new Date(tour.endTime).toLocaleString()}
                        </p>
                      </div>

                      {role === "CUSTOMER" && (
                        <div className="p-4">
                          <button
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            onClick={() => handleBooking(tour)}
                          >
                            Book Now
                          </button>
                        </div>
                      )}
                      {role === "MANAGER" && (
                        <div className="flex p-4 gap-2">
                          <button
                            className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            onClick={() => handleBooking(tour)}
                          >
                            Update Tour
                          </button>
                          <button
                            className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            onClick={() => handleBooking(tour)}
                          >
                            Delete Tour
                          </button>
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>
              {/* Pagination Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  className={`px-4 py-2 bg-gray-300 rounded-lg ${
                    currentPage === 0
                      ? "cursor-not-allowed"
                      : "hover:bg-blue-400"
                  }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
                <button
                  className={`px-4 py-2 bg-gray-300 rounded-lg ${
                    currentPage === totalPage - 1
                      ? "cursor-not-allowed"
                      : "hover:bg-blue-400"
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPage - 1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tour;
