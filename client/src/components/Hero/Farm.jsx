import React, { useState, useEffect } from "react";
import axios from "axios";

import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode"; // Correct import

import { Pagination, Button } from "antd"; // Import Button from Ant Design
import { useNavigate } from "react-router-dom"; // Use navigate to go to the detailed page

const Farm = () => {
  const [farm, setFarm] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho trang hiện tại
  const farmsPerPage = 8; // Số farm mỗi trang

  // Add new state for search
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate(); // Initialize navigate for redirection

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/koi-farm/list-farm-active"
        );
        setFarm(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(
          "Error fetching farm data:",
          error.response || error.message
        );
        setError("Failed to fetch farm data");
      }
    };

    fetchFarmData();
  }, []); // Empty dependency array ensures this runs once on mount

  // Function to handle View More button click
  const handleViewMore = (farmId) => {
    navigate(`/farmdetail/${farmId}`); // Redirect to the farm details page using the farm ID
  };

  // Add search filter function
  const filteredFarms = Array.isArray(farm)
    ? farm.filter((farmItem) =>
        farmItem.farmName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Update pagination calculation to use filtered farms
  const indexOfLastFarm = currentPage * farmsPerPage;
  const indexOfFirstFarm = indexOfLastFarm - farmsPerPage;
  const currentFarms = filteredFarms.slice(indexOfFirstFarm, indexOfLastFarm);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of the page smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 mt-16 sm:mt-20 lg:mt-24">
        {/* Modern Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-950 mb-4">
            Koi Farms
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover traditional Japanese koi farms and their exceptional
            collections
          </p>

          {/* Update search input with better styling */}
          <div className="mt-8 max-w-md mx-auto relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search farms by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-12 py-4 rounded-full border-2 border-gray-200 
                           bg-white/90 backdrop-blur-md
                           text-gray-900 placeholder-gray-500
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           transition-all duration-300
                           shadow-lg hover:shadow-xl"
              />
              {/* Search icon */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Clear button */}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2
                             text-gray-500 hover:text-gray-700
                             transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid container */}
        <div className="grid gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
              {error}
            </div>
          )}

          {filteredFarms.length > 0 ? (
            currentFarms.map((farmItem, index) => {
              const mainImage =
                farmItem.koiFarmImages?.[0]?.imageUrl || "default-image-url";

              return (
                <div
                  key={farmItem.id || index}
                  className="group bg-white rounded-2xl overflow-hidden 
                              shadow-sm hover:shadow-xl transition-all duration-300
                              border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row h-full">
                    {/* Image container */}
                    <div className="sm:w-2/5 lg:w-1/3 relative overflow-hidden h-[300px]">
                      <img
                        src={mainImage}
                        alt={`${farmItem.farmName}`}
                        className="w-full h-full object-cover transform 
                                 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=No+Image"; // Fallback image
                          e.target.onerror = null;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>

                    {/* Content container */}
                    <div className="sm:w-3/5 lg:w-2/3 p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        <h2
                          className="text-2xl sm:text-3xl font-bold text-indigo-950 mb-4 
                                     group-hover:text-indigo-600 transition-colors duration-300"
                        >
                          {farmItem.farmName}
                        </h2>

                        {/* Info grid with modern icons */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-gray-600">
                          {farmItem.farmAddress && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                <span className="text-indigo-600">📍</span>
                              </div>
                              <p className="line-clamp-1">
                                {farmItem.farmAddress}
                              </p>
                            </div>
                          )}
                          {farmItem.farmPhoneNumber && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                <span className="text-indigo-600">📞</span>
                              </div>
                              <p>{farmItem.farmPhoneNumber}</p>
                            </div>
                          )}
                          {farmItem.farmEmail && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                <span className="text-indigo-600">📧</span>
                              </div>
                              <p className="line-clamp-1">
                                {farmItem.farmEmail}
                              </p>
                            </div>
                          )}
                          {farmItem.website && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                <span className="text-indigo-600">🌐</span>
                              </div>
                              <p className="line-clamp-1">{farmItem.website}</p>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {farmItem.description && (
                          <p className="mt-6 text-gray-600 line-clamp-2 sm:line-clamp-3">
                            {farmItem.description}
                          </p>
                        )}
                      </div>

                      {/* Button container */}
                      <div className="mt-6 flex justify-end">
                        <Button
                          onClick={() => handleViewMore(farmItem.id)}
                          type="primary"
                          size="large"
                          className="!bg-indigo-600 hover:!bg-indigo-700 !border-none
                                   !px-8 !h-12 !rounded-lg !font-semibold
                                   !shadow-lg hover:!shadow-xl !transition-all
                                   group-hover:!bg-indigo-500"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <p className="text-gray-600 text-xl">
                {searchTerm
                  ? "No farms found matching your search"
                  : "No farms available at the moment"}
              </p>
            </div>
          )}
        </div>

        {/* Modern Pagination */}
        <div className="flex justify-center mt-10 sm:mt-12 lg:mt-16">
          <Pagination
            current={currentPage}
            onChange={handlePageChange}
            total={filteredFarms.length}
            pageSize={farmsPerPage}
            className="[&_.ant-pagination-item-active]:!bg-indigo-600 
                       [&_.ant-pagination-item-active]:!border-none
                       [&_.ant-pagination-item]:!rounded-lg
                       [&_.ant-pagination-item-active_a]:!text-white
                       [&_.ant-pagination-item]:!border-gray-200
                       [&_.ant-pagination-item_a]:text-gray-600
                       [&_.ant-pagination-item]:hover:!border-indigo-600
                       [&_.ant-pagination-item_a]:hover:!text-indigo-600
                       [&_.ant-pagination-prev_button]:!rounded-lg
                       [&_.ant-pagination-next_button]:!rounded-lg"
            size={window.innerWidth < 640 ? "small" : "default"}
            responsive={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Farm;
