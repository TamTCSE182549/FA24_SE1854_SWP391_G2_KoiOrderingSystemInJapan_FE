import React, { useState, useEffect } from "react";
import { DatePicker, InputNumber, Select } from "antd";
import "antd/dist/reset.css"; // Import Ant Design CSS if not already done
import { FaPlane } from "react-icons/fa"; // Import plane icon from react-icons
import { getTourById } from "../../services/tourservice"; // Import the API function
import Img1 from "../../assets/321.jpg";
import Img2 from "../../assets/291281.jpg";
import Img3 from "../../assets/koi+shopping.jpg";
import { useParams } from "react-router-dom";

const { Option } = Select; // Ensure Option is imported

const TourDetail = () => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for departure date and number of guests
  const [departureDate, setDepartureDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const { id } = useParams(); // Get the id from the URL

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const data = await getTourById(id);
        setTour(data);
      } catch (error) {
        console.error("Error fetching tour data:", error);
        setError("Failed to fetch tour data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]); // Use id in the dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!tour) {
    return <div>No tour data available.</div>;
  }

  const Img = [
    { id: 1, img: Img1 },
    { id: 2, img: Img2 },
    { id: 3, img: Img3 },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto backdrop-filter backdrop-blur-3xl rounded-2xl shadow-lg mt-40 relative">
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-12">
        {/* Single Image for Tour */}
        <div className="md:w-1/2">
          <img
            src={tour.tourImg} // Display the first image from tour.tourImg
            alt="Tour Image"
            className="w-full h-[530px] object-cover rounded-lg"
          />
        </div>

        {/* Tour Info */}
        <div className="md:w-1/2 relative">
          <h2 className="text-4xl font-bold mb-4">{tour.title}</h2>
          <div className="tour-details text-lg text-white space-y-4">
            <p>
              <strong>Location:</strong> {tour.location}
            </p>
            <p>
              <strong>Duration:</strong> {tour.duration}
            </p>
            {/* Hardcoded Transportation Label */}
          </div>
          <div className="tour-description mt-10">
            <h3 className="text-2xl font-semibold mb-4">Tour Description</h3>
            <p className="text-lg text-white leading-relaxed">
              {tour.description}
            </p>
          </div>

          {/* Tour Options */}
          <div className="mt-10 grid grid-cols-3 gap-4 mb-5">
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Departure Date
              </h4>
              <DatePicker
                onChange={(date) => setDepartureDate(date)}
                className="w-full"
              />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Number of Guests
              </h4>
              <InputNumber
                min={1}
                max={1000}
                defaultValue={1}
                onChange={(value) => setGuests(value)}
                className="w-full"
                size="middle"
                style={{ width: "60 %" }}
              />
            </div>
            <div>
              <p className="flex flex-col text-xl ">
                <strong>Transportation</strong>
                <FaPlane className="ml-2 mt-3 " />
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Starting Place
              </h4>
              <Select
                placeholder="Select starting place"
                className="w-[50vh]"
                onChange={(value) => setStartingPlace(value)}
              >
                <Option value="Tokyo">Tokyo</Option>
                <Option value="Osaka">Osaka</Option>
                <Option value="Nagoya">Nagoya</Option>
                <Option value="Hokkaido">Hokkaido</Option>
              </Select>
            </div>
          </div>

          {/* Positioned "Book Now" Button */}
          <div className="absolute bottom-0 right-0 mt-4 mr-4 -my-10">
            <button className="bg-green-900 text-white rounded-md px-4 py-2 transition duration-300 ease-in-out hover:bg-green-700">
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Koi Fish Carousel */}
      <div className="overflow-hidden group mt-10">
        <div className="flex justify-center space-x-16 animate-loop-scroll mt-10 group-hover:paused">
          {Img.map((item) => (
            <img
              key={item.id}
              src={item.img}
              alt={`Koi Image ${item.id}`}
              className="w-[400px] h-[300px] object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
