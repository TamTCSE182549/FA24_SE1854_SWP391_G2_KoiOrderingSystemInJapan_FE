import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie"; // Assuming you're using react-cookie for token management

const Farm = () => {
  const [farm, setFarm] = useState([]);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["token"]); // Get token from cookies
  const token = cookies.token; // Extract the token from cookies

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

  return (
    <>
      <div>
        {error && <p className="text-red-500">{error}</p>}
        {Array.isArray(farm) && farm.length > 0 ? (
          farm.map((farmItem, index) => (
            <div key={farmItem.id || index}>
              <h1>{farmItem.name}</h1>
              <p>{farmItem.location}</p>
              <p>{farmItem.description}</p>
            </div>
          ))
        ) : (
          <p>No farms available</p>
        )}
      </div>
    </>
  );
};

export default Farm;
