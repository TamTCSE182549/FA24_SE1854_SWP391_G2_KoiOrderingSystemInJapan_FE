import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const CreateNewFarm = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const navigate = useNavigate();
  const [newFarm, setNewFarm] = useState({
    farmName: "",
    farmPhoneNumber: "",
    farmEmail: "",
    farmAddress: "",
    farmImage: "",
  });

  const handleInputChange = (e) => {
    setNewFarm({
      ...newFarm,
      [e.target.name]: e.target.value,
    });
  };

  const createFarm = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/koi-farm/create", newFarm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/admin/farm-management");
    } catch (error) {
      console.error("Error creating farm:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto ">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Create New Farm
        </h2>
        <form onSubmit={createFarm} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Farm Name
            </label>
            <input
              type="text"
              name="farmName"
              value={newFarm.farmName}
              onChange={handleInputChange}
              placeholder="Enter farm name"
              className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              name="farmPhoneNumber"
              value={newFarm.farmPhoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="farmEmail"
              value={newFarm.farmEmail}
              onChange={handleInputChange}
              placeholder="Enter email"
              className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Address
            </label>
            <input
              type="text"
              name="farmAddress"
              value={newFarm.farmAddress}
              onChange={handleInputChange}
              placeholder="Enter address"
              className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Image URL
            </label>
            <input
              type="text"
              name="farmImage"
              value={newFarm.farmImage}
              onChange={handleInputChange}
              placeholder="Enter image URL"
              className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Create Farm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewFarm;
