import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Spin, Alert } from "antd"; // For loading and error display

const FarmDetail = () => {
  const { id } = useParams(); // Get the farm ID from URL parameters
  const [farmDetail, setFarmDetail] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  useEffect(() => {
    const fetchFarmDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/koi-farm/list-farm/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFarmDetail(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch farm details:", error.response || error);
        setError("Failed to fetch farm details");
        setLoading(false);
      }
    };

    if (token) {
      fetchFarmDetail();
    } else {
      setError("No token available. Please log in.");
      setLoading(false);
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert message={error} type="error" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {farmDetail ? (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-4">{farmDetail.farmName}</h1>
          <p className="text-gray-700 text-lg mb-2">
            <strong>Address:</strong> {farmDetail.farmAddress}
          </p>
          <p className="text-gray-700 text-lg mb-2">
            <strong>Phone:</strong> 📞 {farmDetail.farmPhoneNumber}
          </p>
          <p className="text-gray-700 text-lg mb-2">
            <strong>Email:</strong> 📧 {farmDetail.farmEmail}
          </p>
          <p className="text-gray-700 text-lg mb-2">
            <strong>Description:</strong>{" "}
            {farmDetail.description || "No description available."}
          </p>
        </div>
      ) : (
        <p className="text-center">Farm details not available.</p>
      )}
    </div>
  );
};

export default FarmDetail;
