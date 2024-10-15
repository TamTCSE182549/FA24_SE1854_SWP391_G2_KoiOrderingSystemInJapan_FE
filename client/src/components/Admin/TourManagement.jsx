import React, { useState } from "react";
import axios from "axios";

const TourManagement = () => {
  const [newTour, setNewTour] = useState({
    tourName: "",
    description: "",
    price: "",
    duration: "",
  });

  const [editTour, setEditTour] = useState(null); // Để cập nhật tour hiện tại

  // Create new tour using the correct endpoint
  const createTour = async () => {
    try {
      await axios.post("http://localhost:8080/tour/createTourRes", newTour); // API từ backend
      setNewTour({ tourName: "", description: "", price: "", duration: "" }); // Reset form
      alert("Tour created successfully!");
    } catch (error) {
      console.error("Error creating tour:", error);
    }
  };

  // Update an existing tour using the correct endpoint
  const updateTour = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/tour/updateTourRes/${id}`,
        editTour
      ); // API từ backend
      setEditTour(null); // Reset edit state
      alert("Tour updated successfully!");
    } catch (error) {
      console.error("Error updating tour:", error);
    }
  };

  // Delete a tour using the correct endpoint
  const deleteTour = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/tour/deleteTourRes/${id}`); // API từ backend
      alert("Tour deleted successfully!");
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  // Handle input change for new tour
  const handleInputChange = (e) => {
    setNewTour({
      ...newTour,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input change for editing tour
  const handleEditChange = (e) => {
    setEditTour({
      ...editTour,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tour Management</h2>

      {/* Create new tour form */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Create New Tour</h3>
        <input
          type="text"
          name="tourName"
          value={newTour.tourName}
          onChange={handleInputChange}
          placeholder="Tour Name"
          className="border p-2 mb-2"
        />
        <input
          type="text"
          name="description"
          value={newTour.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border p-2 mb-2"
        />
        <input
          type="text"
          name="price"
          value={newTour.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="border p-2 mb-2"
        />
        <input
          type="text"
          name="duration"
          value={newTour.duration}
          onChange={handleInputChange}
          placeholder="Duration"
          className="border p-2 mb-2"
        />
        <button
          onClick={createTour}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create Tour
        </button>
      </div>

      {/* Edit tour form */}
      {editTour && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Edit Tour</h3>
          <input
            type="text"
            name="tourName"
            value={editTour.tourName}
            onChange={handleEditChange}
            placeholder="Tour Name"
            className="border p-2 mb-2"
          />
          <input
            type="text"
            name="description"
            value={editTour.description}
            onChange={handleEditChange}
            placeholder="Description"
            className="border p-2 mb-2"
          />
          <input
            type="text"
            name="price"
            value={editTour.price}
            onChange={handleEditChange}
            placeholder="Price"
            className="border p-2 mb-2"
          />
          <input
            type="text"
            name="duration"
            value={editTour.duration}
            onChange={handleEditChange}
            placeholder="Duration"
            className="border p-2 mb-2"
          />
          <button
            onClick={() => updateTour(editTour.id)}
            className="bg-green-500 text-white px-4 py-2"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Delete tour form */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Delete Tour</h3>
        <input
          type="text"
          name="tourId"
          placeholder="Tour ID"
          onChange={(e) => setEditTour({ id: e.target.value })}
          className="border p-2 mb-2"
        />
        <button
          onClick={() => deleteTour(editTour.id)}
          className="bg-red-500 text-white px-4 py-2"
        >
          Delete Tour
        </button>
      </div>
    </div>
  );
};

export default TourManagement;
