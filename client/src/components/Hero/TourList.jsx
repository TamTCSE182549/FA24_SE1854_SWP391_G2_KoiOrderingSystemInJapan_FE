import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Tour = () => {
  const [tours, setTours] = useState([]); // State to store tour data
  const [error, setError] = useState(null); // State to store any errors
  const [filters, setFilters] = useState({
    privatePool: false,
    villas: false,
    swimmingPool: false,
    beachfront: false,
    parking: false,
  });

  const hardcodedTours = [
    {
      id: 1,
      tourName: "Amazing Vung Tau Beach Tour",
      unitPrice: 150,
      maxParticipants: 30,
      description: "Enjoy the beautiful beaches of Vung Tau with this tour.",
      startTime: "2024-10-20T09:00:00",
      endTime: "2024-10-21T18:00:00",
      facilities: { privatePool: true, villas: true, swimmingPool: true },
    },
    {
      id: 2,
      tourName: "Luxury Mekong Delta Cruise",
      unitPrice: 300,
      maxParticipants: 20,
      description: "Experience the tranquility of the Mekong Delta.",
      startTime: "2024-11-01T08:00:00",
      endTime: "2024-11-03T16:00:00",
      facilities: { privatePool: false, villas: true, swimmingPool: false },
    },
    {
      id: 3,
      tourName: "Adventure to Fansipan",
      unitPrice: 200,
      maxParticipants: 15,
      description:
        "Conquer the roof of Indochina with this thrilling adventure.",
      startTime: "2024-12-10T07:00:00",
      endTime: "2024-12-12T17:00:00",
      facilities: { privatePool: true, villas: false, swimmingPool: true },
    },
    {
      id: 4,
      tourName: "Adventure to Fansipan",
      unitPrice: 200,
      maxParticipants: 15,
      description:
        "Conquer the roof of Indochina with this thrilling adventure.",
      startTime: "2024-12-10T07:00:00",
      endTime: "2024-12-12T17:00:00",
      facilities: { privatePool: true, villas: false, swimmingPool: true },
    },
  ];

  const fetchTourData = async (values) => {
    try {
      const response = await axios.get("http://localhost:8080/tour/showAll");
      if (Array.isArray(response.data)) {
        setTours(response.data);
      } else {
        setTours(hardcodedTours);
      }
      console.log("Tour Data:", response.data);
    } catch (error) {
      console.error("Error fetching tour data:", error);
      setError("Failed to fetch tour data. Displaying fallback data.");
      setTours(hardcodedTours); // Display hardcoded data on API failure
    }
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const filteredTours = tours.filter((tour) => {
    if (filters.privatePool && !tour.facilities.privatePool) return false;
    if (filters.villas && !tour.facilities.villas) return false;
    if (filters.swimmingPool && !tour.facilities.swimmingPool) return false;
    return true; // Return all tours that match the filters
  });

  useEffect(() => {
    fetchTourData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow">
        <div className="container mx-auto p-4">
          <div className="flex">
            {/* Sidebar Filters */}
            <div className="w-1/4 p-4  rounded-lg bg-[#c5bd92] shadow-md">
              <h2 className="text-xl text-gray-800 font-bold mb-4">
                Filter by:
              </h2>
              {/* Popular Filters */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Popular Filters</h3>
                <div className="mb-2">
                  <input
                    type="checkbox"
                    name="privatePool"
                    checked={filters.privatePool}
                    onChange={handleFilterChange}
                  />
                  <label className="ml-2">Private pool</label>
                </div>
                <div className="mb-2">
                  <input
                    type="checkbox"
                    name="villas"
                    checked={filters.villas}
                    onChange={handleFilterChange}
                  />
                  <label className="ml-2">Villas</label>
                </div>
                <div className="mb-2">
                  <input
                    type="checkbox"
                    name="swimmingPool"
                    checked={filters.swimmingPool}
                    onChange={handleFilterChange}
                  />
                  <label className="ml-2">Swimming Pool</label>
                </div>
              </div>
              {/* Beach Access */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Beach Access</h3>
                <div className="mb-2">
                  <input
                    type="checkbox"
                    name="beachfront"
                    checked={filters.beachfront}
                    onChange={handleFilterChange}
                  />
                  <label className="ml-2">Beachfront</label>
                </div>
              </div>
              {/* Facilities */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Facilities</h3>
                <div className="mb-2">
                  <input
                    type="checkbox"
                    name="parking"
                    checked={filters.parking}
                    onChange={handleFilterChange}
                  />
                  <label className="ml-2">Parking</label>
                </div>
              </div>
            </div>

            {/* Tour List */}
            <div className="w-3/4 ml-4">
              <h1 className="text-2xl font-bold mb-4 text-black">Tour List</h1>
              {error && <p className="text-red-500">{error}</p>}
              <div className="space-y-6">
                {filteredTours.length === 0 ? (
                  <p>No tours found.</p>
                ) : (
                  filteredTours.map((tour) => (
                    <div
                      key={tour.id}
                      className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
                    >
                      <img
                        src={`https://via.placeholder.com/400x200?text=${tour.tourName}`}
                        alt={tour.tourName}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 flex-grow">
                        <h3 className="text-xl font-bold mb-2 text-black">
                          {tour.tourName}
                        </h3>
                        <p className="text-gray-700 mb-2">{tour.description}</p>
                        <p className="text-sm text-gray-500">
                          Price: {tour.unitPrice} USD
                        </p>
                        <p className="text-sm text-gray-500">
                          Max Participants: {tour.maxParticipants}
                        </p>
                        <p className="text-sm text-gray-500">
                          Start Time:{" "}
                          {new Date(tour.startTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          End Time: {new Date(tour.endTime).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4">
                        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Tour;
