import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode"; // Import correctly

const FarmManagement = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [decodedToken, setDecodedToken] = useState(null);
  const [farms, setFarms] = useState([]); // State to store farm list
  const [newFarm, setNewFarm] = useState({
    farmName: "",
    farmPhoneNumber: "",
    farmEmail: "",
    farmAddress: "",
    farmImage: "",
    createdBy: "", // Store the creator info
  });

  const [editFarm, setEditFarm] = useState(null); // To hold the farm being edited

  // Decode the token and store user info in state
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded); // Store the decoded token
        setNewFarm((prevFarm) => ({
          ...prevFarm,
          createdBy: decoded.sub, // Assuming "sub" is the user ID
        }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  // Fetch the list of farms from API when component is loaded
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/koi-farm/list-farm",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Backend API to get farm list
        setFarms(response.data); // Store farm list in state
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    fetchFarms(); // Fetch farms when component loads
  }, [token]);

  // Create a new farm
  const createFarm = async () => {
    try {
      await axios.post("http://localhost:8080/koi-farm/create", newFarm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewFarm({
        farmName: "",
        farmPhoneNumber: "",
        farmEmail: "",
        farmAddress: "",
        farmImage: "",
        createdBy: decodedToken?.sub || "", // Ensure creator info is available
      }); // Reset the form
      setFarms(); // Fetch updated farm list
    } catch (error) {
      console.error("Error creating farm:", error);
    }
  };

  // Delete a farm by its ID
  const deleteFarm = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/koi-farm/deleteFarm/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Fetch updated farm list after deletion
      const response = await axios.get(
        "http://localhost:8080/koi-farm/list-farm",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFarms(response.data); // Cập nhật lại danh sách farms
    } catch (error) {
      console.error(
        "Error deleting farm:",
        error.response?.data || error.message
      );
    }
  };

  // Update an existing farm
  const updateFarm = async (id) => {
    try {
      await axios.put(`http://localhost:8080/koi-farm/update/${id}`, editFarm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditFarm(null); // Clear the edit form
      // Fetch updated farm list after update
      const response = await axios.get(
        "http://localhost:8080/koi-farm/list-farm",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFarms(response.data); // Cập nhật lại danh sách farms
    } catch (error) {
      console.error(
        "Error updating farm:",
        error.response?.data || error.message
      );
    }
  };

  // Handle input change for the new farm
  const handleInputChange = (e) => {
    setNewFarm({
      ...newFarm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input change for editing a farm
  const handleEditChange = (e) => {
    setEditFarm({
      ...editFarm,
      [e.target.name]: e.target.value,
    });
  };

  // Set the farm to be edited
  const handleEditClick = (farm) => {
    setEditFarm(farm);
  };

  // Render the FarmManagement component
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

      {/* Display list of created farms with update and delete buttons */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Created Farms</h3>
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Image URL</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(farms || []).map((farm) => (
              <tr key={farm.id}>
                <td className="border px-4 py-2">{farm.farmName || "N/A"}</td>
                <td className="border px-4 py-2">
                  {farm.farmPhoneNumber || "N/A"}
                </td>
                <td className="border px-4 py-2">{farm.farmEmail || "N/A"}</td>
                <td className="border px-4 py-2">
                  {farm.farmAddress || "N/A"}
                </td>
                <td className="border px-4 py-2">{farm.farmImage || "N/A"}</td>
                <td className="border px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(farm)}
                    className="bg-yellow-500 text-white px-4 py-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteFarm(farm.id)}
                    className="bg-red-500 text-white px-4 py-2"
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
