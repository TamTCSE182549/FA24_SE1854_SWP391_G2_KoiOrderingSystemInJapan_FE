import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie"; // Assuming you're using react-cookie for token management
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const Farm = () => {
  const [farm, setFarm] = useState([]);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["token"]); // Get token from cookies
  const token = cookies.token; // Extract the token from cookies

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/koi-farm/list-farm"
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
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex-grow">
        <div className="container mx-auto p-4">
          {error && <p className="text-red-500">{error}</p>}
          {Array.isArray(farm) && farm.length > 0 ? (
            farm.map((farmItem, index) => (
              <div key={farmItem.id || index} className="mb-4">
                <h1 className="text-2xl font-bold">{farmItem.name}</h1>
                <p className="text-gray-700">{farmItem.location}</p>
                <p className="text-gray-600">{farmItem.description}</p>
              </div>
            ))
          ) : (
            <p>No farms available</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Farm;
