import React, { useState, useEffect } from "react";
import { DatePicker, InputNumber, Select } from "antd";
import "antd/dist/reset.css"; // Import Ant Design CSS if not already done
import { FaPlane } from "react-icons/fa"; // Import plane icon from react-icons
import { getTourById } from "../../services/tourservice"; // Import the API function
import { format } from "date-fns";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode"; // Ensure correct import
import Img1 from "../../assets/321.jpg";
import Img2 from "../../assets/291281.jpg";
import Img3 from "../../assets/koi+shopping.jpg";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer và toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho Toast

const { Option } = Select; // Ensure Option is imported

const TourDetail = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { tour } = location.state || {};
  // State for departure date and number of guests
  const { id } = useParams(); // Get the id from the URL

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [participants, setParticipants] = useState(1);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/bookings/listBookingTourOtherStatus`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure the token is correctly passed
              "Content-Type": "application/json",
            },
          }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching tour data:", error);
        setError("Failed to fetch tour data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
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

  const handleBack = () => {
    navigate(-1); // Di chuyển về trang trước đó
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    // if (!token) {
    //   setMessage("Token not found or invalid. Please log in.");
    //   return;
    // }

    if (!token) {
      toast.error("Token not found or invalid. Please log in."); // Hiển thị thông báo lỗi
      return;
    }

    // Dữ liệu booking tương ứng với BookingRequest class
    const bookingData = {
      tourID: Number(tour.id),
      paymentMethod: paymentMethod,
      participants: Number(participants),
    };

    try {
      if (participants <= tour.remaining) {
        if (Object.keys(bookings).length > 0) {
          toast.warn(
            "You have booking not complete. Please check your booking!"
          );
          return;
        }
        const response = await axios.post(
          "http://localhost:8080/bookings/CreateForTour",
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure the token is correctly passed
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Booking successful:", response.data);
        // NotificationManager.success("Booking successful!", "Success", 5000);
        navigate("/tour", { state: { toastMessage: "Booking successful!" } });
      } else {
        toast.warning(
          "Participants must be less than or equal remaning of tour AND must be greater than 0"
        );
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(
          error.response.data.message ||
            "Failed to book the trip. Please try again."
        ); // Hiển thị thông báo lỗi
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        console.error("Error message:", error.message);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Kết thúc trạng thái loading
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto backdrop-filter backdrop-blur-3xl rounded-2xl shadow-lg mt-40 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black opacity-50 z-10">
          <span className="text-white text-xl">Processing...</span>
        </div>
      )}
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
          <h2 className="text-4xl font-bold mb-4">{tour.tourName}</h2>
          <div className="tour-details text-lg text-white space-y-4">
            <p>
              <strong>Start Time: </strong>{" "}
              {format(new Date(tour.startTime), "yyyy-MM-dd HH:mm:ss")}
            </p>
            <p>
              <strong>End Time: </strong>{" "}
              {format(new Date(tour.endTime), "yyyy-MM-dd HH:mm:ss")}
            </p>
            <p>
              <strong>Max Participants: </strong> {tour.maxParticipants}
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
                Remaning of Tour
              </h4>
              <input
                value={tour.remaining} // Hiển thị tên tour
                readOnly
                className="border border-gray-300 rounded-md p-2 w-full h-8 bg-gray-100 text-black"
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
                onChange={(value) => setParticipants(value)}
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
                Payment method
              </h4>
              <Select
                placeholder="Select payment method"
                value={paymentMethod}
                className="w-[50vh]"
                onChange={(value) => setPaymentMethod(value)}
              >
                <Option value="CASH">Cash</Option>
                <Option value="VISA">Visa</Option>
                <Option value="TRANSFER">Transfer</Option>
              </Select>
            </div>
          </div>

          {/* Positioned "Book Now" Button */}
          <div className="absolute bottom-0 right-0 mt-4 mr-4 -my-10">
            <button
              className="bg-red-600 hover:bg-red-800 active:bg-red-900 rounded-md px-4 py-2 transition duration-300 ease-in-out mr-5"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="bg-green-900 text-white rounded-md px-4 py-2 transition duration-300 ease-in-out hover:bg-green-700"
              onClick={handleBooking}
            >
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
      <ToastContainer />
    </div>
  );
};

export default TourDetail;
