// components/Admin/FarmManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const FarmManagement = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [decodedToken, setDecodedToken] = useState(null);
  const [farms, setFarms] = useState([]);
  const [editFarm, setEditFarm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const fetchFarms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/koi-farm/list-farm",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, [token]);

  const deleteFarm = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/koi-farm/deleteFarm/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchFarms();
    } catch (error) {
      console.error(
        "Error deleting farm:",
        error.response?.data || error.message
      );
    }
  };

  const handleEditClick = (farm) => {
    setEditFarm(farm);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Farm Management</h2>

      <button
        onClick={() => navigate("/admin/create-new-farm")} // Điều hướng đến CreateNewFarm
        className="bg-blue-500 text-white px-4 py-2 mb-4"
      >
        Create Farm
      </button>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">Created Farms</h3>
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr>
              <th className="border border-black px-4 py-2">Name</th>
              <th className="border border-black px-4 py-2">Phone</th>
              <th className="border border-black px-4 py-2">Email</th>
              <th className="border border-black px-4 py-2">Address</th>
              <th className="border border-black px-4 py-2">Image URL</th>
              <th className="border border-black px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(farms || []).map((farm) => (
              <tr key={farm.id}>
                <td className="border border-black px-4 py-2">
                  {farm.farmName || "N/A"}
                </td>
                <td className="border border-black px-4 py-2">
                  {farm.farmPhoneNumber || "N/A"}
                </td>
                <td className="border border-black px-4 py-2">
                  {farm.farmEmail || "N/A"}
                </td>
                <td className="border border-black px-4 py-2">
                  {farm.farmAddress || "N/A"}
                </td>
                <td className="border border-black px-4 py-2">
                  {farm.farmImage || "N/A"}
                </td>
                <td className="border border-black px-1 py-2 text-center">
                  <button
                    onClick={() => handleEditClick(farm)}
                    className="bg-yellow-500 text-white px-3 py-1"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteFarm(farm.id)}
                    className="bg-red-500 text-white px-3 py-1 ml-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmManagement;
