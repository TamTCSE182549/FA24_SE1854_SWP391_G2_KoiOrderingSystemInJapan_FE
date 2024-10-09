import React, { useState, useEffect } from "react";
import { DatePicker, Input, Button, Rate, Pagination } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const App = () => {
  const [hotels, setHotels] = useState([]); // To hold hotel data
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch hotel data dynamically
  const fetchHotels = async () => {
    setLoading(true);
    try {
      // Replace this with your actual API or fetch function
      const response = await fetch("https://localhost:8080/tour/list");
      const data = await response.json();
      setHotels(data.hotels);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch hotels", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch the hotels when the component is mounted
    fetchHotels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Search Bar */}
      <div className="bg-white shadow p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            className="w-64"
            size="large"
            placeholder="Ho Chi Minh City"
            prefix={<EnvironmentOutlined />}
          />
          <RangePicker size="large" />
          <Input size="large" defaultValue="2 adults · 0 children · 1 room" />
        </div>
        <Button type="primary" size="large" icon={<SearchOutlined />}>
          Search
        </Button>
      </div>

      <div className="container mx-auto py-6">
        {/* Filters Sidebar */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-4">Filter by:</h3>
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Popular filters</h4>
              <ul>
                <li>
                  <input type="checkbox" className="mr-2" /> District 1
                </li>
                <li>
                  <input type="checkbox" className="mr-2" /> 5 Stars
                </li>
                <li>
                  <input type="checkbox" className="mr-2" /> Swimming Pool
                </li>
              </ul>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Property Type</h4>
              <ul>
                <li>
                  <input type="checkbox" className="mr-2" /> Hotels
                </li>
                <li>
                  <input type="checkbox" className="mr-2" /> Apartments
                </li>
              </ul>
            </div>
            {/* Add more filters as needed */}
          </div>

          {/* Hotels List */}
          <div className="col-span-9">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">
                Ho Chi Minh City: {hotels.length} properties found
              </h3>
              <div className="flex items-center space-x-2">
                <Button>List</Button>
                <Button>Grid</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                hotels.map((hotel, index) => (
                  <div
                    key={index}
                    className="bg-white shadow rounded-lg overflow-hidden flex"
                  >
                    <img
                      src={hotel.img}
                      alt={hotel.name}
                      className="w-1/3 h-auto"
                    />
                    <div className="p-4 flex-1">
                      <h4 className="text-xl font-bold">{hotel.name}</h4>
                      <p className="text-gray-500">
                        {hotel.location} · {hotel.distance} km from centre
                      </p>
                      <Rate
                        disabled
                        defaultValue={hotel.rating}
                        className="my-2"
                      />
                      <p>
                        {hotel.reviews} reviews ·{" "}
                        <span className="font-bold">
                          Location {hotel.locationRating}
                        </span>
                      </p>
                      <Button type="primary" className="mt-4">
                        Show prices
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination defaultCurrent={1} total={hotels.length} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
