import React, { useState, useEffect } from "react";
import axios from "axios";

import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode"; // Correct import

import { Pagination, Button } from "antd"; // Import Button from Ant Design
import { useNavigate } from "react-router-dom"; // Use navigate to go to the detailed page

const Farm = () => {
  const [farm, setFarm] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div className="flex flex-col min-h-screen backdrop-filter backdrop-blur-3xl container mx-auto mb-10 mt-40">

      <div className="flex-grow">
        <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 gap-6">
          {error && <p className="text-red-500">{error}</p>}
          {Array.isArray(farm) && farm.length > 0 ? (
            farm.map((farmItem, index) => {
              const mainImage =
                farmItem.koiFarmImages && farmItem.koiFarmImages.length > 0
                  ? farmItem.koiFarmImages[0].imageUrl
                  : "default-image-url"; // Use a default image if no images are available

              return (
                <div
                  key={farmItem.id || index}
                  className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex"
                >
                  <div className="w-1/3">
                    <img
                      src={mainImage}
                      alt={`Main Image of ${farmItem.farmName}`}
                      className="w-full h-auto object-cover rounded-md"
                    />
                  </div>
                  <div className="w-2/3 pl-4">
                    <h1 className="text-xl text-black font-bold mb-2">
                      {farmItem.farmName}
                    </h1>
                    {farmItem.farmAddress && (
                      <p className="text-gray-700 mb-1">
                        {farmItem.farmAddress}
                      </p>
                    )}
                    {farmItem.farmPhoneNumber && (
                      <p className="text-gray-600 mb-1">
                        📞 {farmItem.farmPhoneNumber}
                      </p>
                    )}
                    {farmItem.farmEmail && (
                      <p className="text-gray-600 mb-1">
                        📧 {farmItem.farmEmail}
                      </p>
                    )}
                    {farmItem.website && (
                      <p className="text-gray-600 mb-1">
                        🌐 {farmItem.website}
                      </p>
                    )}
                    {farmItem.description && (
                      <p className="text-gray-600 mb-1">
                        {farmItem.description}
                      </p>
                    )}
                    <Button
                      type="primary"
                      className="mt-4"
                      onClick={() => handleViewMore(farmItem.id)}
                    >
                      View More
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No farms available</p>
          )}
        </div>
      </div>
      <div className="flex justify-center mb-10">
        <Pagination defaultCurrent={1} total={500} />
      </div>
    </div>
  );
};

export default Farm;
