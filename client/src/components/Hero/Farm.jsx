import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode"; // Correct import
import { Pagination, Button } from "antd"; // Import Button from Ant Design
import { useNavigate } from "react-router-dom"; // Use navigate to go to the detailed page

const Farm = () => {
  const [farm, setFarm] = useState([]);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const navigate = useNavigate(); // Initialize navigate for redirection

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Valid token", decodedToken);
      } catch (error) {
        console.log("Invalid token", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/koi-farm/list-farm",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFarm(response.data);
        console.log(response.data);
        console.log("Farm ID:", response.data.id);
      } catch (error) {
        console.error(
          "Error fetching farm data:",
          error.response || error.message
        );
        setError("Failed to fetch farm data");
      }
    };

    if (token) {
      fetchFarmData();
    }
  }, [token]);

  // Function to handle View More button click
  const handleViewMore = (farmId) => {
    navigate(`/farm/${farmId}`); // Redirect to the farm details page using the farm ID
  };

  return (
    <div className="flex flex-col min-h-screen backdrop-filter backdrop-blur-3xl container mx-auto mb-10">
      <div className="flex-grow">
        <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 gap-6">
          {error && <p className="text-red-500">{error}</p>}
          {Array.isArray(farm) && farm.length > 0 ? (
            farm.map((farmItem, index) => (
              <div
                key={farmItem.id || index}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <h1 className="text-xl font-bold mb-2">{farmItem.farmName}</h1>
                <p className="text-gray-700 mb-1">{farmItem.farmAddress}</p>
                <p className="text-gray-600 mb-1">
                  📞 {farmItem.farmPhoneNumber}
                </p>
                <p className="text-gray-600">📧 {farmItem.farmEmail}</p>
                <Button
                  type="primary"
                  className="mt-4"
                  onClick={() => handleViewMore(farmItem.id)}
                >
                  View More
                </Button>
              </div>
            ))
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
