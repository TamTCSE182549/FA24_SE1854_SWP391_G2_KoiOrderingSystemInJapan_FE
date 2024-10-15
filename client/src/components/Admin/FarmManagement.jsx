import React, { useState } from "react";
import axios from "axios";

const FarmManagement = () => {
  const [newFarm, setNewFarm] = useState({
    farmName: "",
    farmPhoneNumber: "",
    farmEmail: "",
    farmAddress: "",
    farmImage: "",
  });

  const [editFarm, setEditFarm] = useState(null); // Để cập nhật farm hiện tại
  const [deleteFarmId, setDeleteFarmId] = useState(""); // Để xóa farm theo ID

  // Create new farm using the correct endpoint
  const createFarm = async () => {
    try {
      await axios.post("http://localhost:8080/koi-farm/create", newFarm); // API từ backend
      setNewFarm({
        farmName: "",
        farmPhoneNumber: "",
        farmEmail: "",
        farmAddress: "",
        farmImage: "",
      }); // Reset form
      alert("Farm created successfully!");
    } catch (error) {
      console.error("Error creating farm:", error);
    }
  };

  // Update an existing farm using the correct endpoint
  const updateFarm = async (id) => {
    try {
      await axios.put(`http://localhost:8080/koi-farm/update/${id}`, editFarm); // API từ backend
      setEditFarm(null); // Reset edit state
      alert("Farm updated successfully!");
    } catch (error) {
      console.error("Error updating farm:", error);
    }
  };

  // Delete a farm using the correct endpoint
  const deleteFarm = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/koi-farm/delete/${id}`); // API từ backend
      alert("Farm deleted successfully!");
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  // Handle input change for new farm
  const handleInputChange = (e) => {
    setNewFarm({
      ...newFarm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input change for editing farm
  const handleEditChange = (e) => {
    setEditFarm({
      ...editFarm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Farm Management</h2>

      {/* Create new farm form */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Create New Farm</h3>
        <input
          type="text"
          name="farmName"
          value={newFarm.farmName}
          onChange={handleInputChange}
          placeholder="Farm Name"
          className="border p-2 mb-2"
        />
        <input
          type="text"
          name="farmPhoneNumber"
          value={newFarm.farmPhoneNumber}
          onChange={handleInputChange}
          placeholder="Phone Number"
          className="border p-2 mb-2"
        />
        <input
          type="email"
          name="farmEmail"
          value={newFarm.farmEmail}
          onChange={handleInputChange}
          placeholder="Email"
          className="border p-2 mb-2"
        />
        <input
          type="text"
          name="farmAddress"
          value={newFarm.farmAddress}
          onChange={handleInputChange}
          placeholder="Address"
          className="border p-2 mb-2"
        />
        <input
          type="text"
          name="farmImage"
          value={newFarm.farmImage}
          onChange={handleInputChange}
          placeholder="Image URL"
          className="border p-2 mb-2"
        />
        <button
          onClick={createFarm}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create Farm
        </button>
      </div>

      {/* Edit farm form */}
      {editFarm && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Edit Farm</h3>
          <input
            type="text"
            name="farmName"
            value={editFarm.farmName}
            onChange={handleEditChange}
            placeholder="Farm Name"
            className="border p-2 mb-2"
          />
          <input
            type="text"
            name="farmPhoneNumber"
            value={editFarm.farmPhoneNumber}
            onChange={handleEditChange}
            placeholder="Phone Number"
            className="border p-2 mb-2"
          />
          <input
            type="email"
            name="farmEmail"
            value={editFarm.farmEmail}
            onChange={handleEditChange}
            placeholder="Email"
            className="border p-2 mb-2"
          />
          <input
            type="text"
            name="farmAddress"
            value={editFarm.farmAddress}
            onChange={handleEditChange}
            placeholder="Address"
            className="border p-2 mb-2"
          />
          <input
            type="text"
            name="farmImage"
            value={editFarm.farmImage}
            onChange={handleEditChange}
            placeholder="Image URL"
            className="border p-2 mb-2"
          />
          <button
            onClick={() => updateFarm(editFarm.id)}
            className="bg-green-500 text-white px-4 py-2"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Delete farm form */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Delete Farm</h3>
        <input
          type="text"
          name="farmId"
          placeholder="Farm ID"
          onChange={(e) => setDeleteFarmId(e.target.value)}
          className="border p-2 mb-2"
        />
        <button
          onClick={() => deleteFarm(deleteFarmId)}
          className="bg-red-500 text-white px-4 py-2"
        >
          Delete Farm
        </button>
      </div>
    </div>
  );
};

export default FarmManagement;
