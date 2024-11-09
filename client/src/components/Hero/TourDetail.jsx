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
      toast.dismiss();
      toast.error("Token not found or invalid. Please log in."); // Hiển thị thông báo lỗi
      return;
    }

    // Kiểm tra số lượng khách phải hợp lệ
    if (participants <= 0) {
      toast.dismiss();
      toast.warning("Number of guests must be greater than 0");
      return;
    }
    
    if (participants > tour.remaining) {
      toast.dismiss();
      toast.warning(`Maximum number of participants is ${tour.remaining}`);
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
          toast.dismiss();
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
        toast.dismiss();
        toast.warning(
          "Participants must be less than or equal remaning of tour AND must be greater than 0"
        );
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.dismiss();
        toast.error(
          error.response.data.message ||
            "Failed to book the trip. Please try again."
        ); // Hiển thị thông báo lỗi
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.dismiss();
        toast.error("No response from server. Please check your connection.");
      } else {
        console.error("Error message:", error.message);
        toast.dismiss();
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Kết thúc trạng thái loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="relative h-96">
          <img
            src={tour.tourImg}
            alt={tour.tourName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <div className="absolute bottom-8 left-8">
              <h1 className="text-5xl font-bold text-white mb-4">{tour.tourName}</h1>
              <div className="flex items-center space-x-4 text-white">
                <FaPlane className="text-2xl" />
                <span className="text-lg">Premium Tour Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          {/* Tour Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tour Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-gray-600">Start Time</p>
                  <p className="text-lg font-medium text-green-600">
                    {format(new Date(tour.startTime), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">End Time</p>
                  <p className="text-lg font-medium text-green-600">
                    {format(new Date(tour.endTime), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Max Participants</p>
                  <p className="text-lg text-green-600 font-medium">{tour.maxParticipants}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Remaining Spots</p>
                  <p className="text-lg font-medium text-green-600">{tour.remaining}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{tour.description}</p>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Gallery</h2>
              <div className="grid grid-cols-3 gap-4">
                {Img.map((item) => (
                  <img
                    key={item.id}
                    src={item.img}
                    alt={`Tour Image ${item.id}`}
                    className="rounded-lg h-48 w-full object-cover hover:opacity-90 transition duration-300"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book This Tour</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Number of Guests</label>
                  <InputNumber
                    placeholder="Number of Guests"
                    onChange={(value) => {
                      // Kiểm tra giá trị bằng 0
                      if (value === 0) {
                        toast.dismiss();
                        toast.warning("Number of guests must be greater than 0");
                        return;
                      }
                      // Kiểm tra giá trị vượt quá remaining
                      if (value > tour.remaining) {
                        toast.dismiss();
                        toast.warning(`Maximum number of participants is ${tour.remaining}`);
                        return;
                      }
                      // Chỉ set giá trị khi nó hợp lệ
                      setParticipants(value);
                    }}
                    className="w-full !rounded-xl"
                    size="large"
                    controls={false}
                    onKeyDown={(e) => {
                      // Cho phép: số (0-9), backspace, delete, arrow keys, tab
                      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                      const isNumber = /^[0-9]$/.test(e.key);
                      
                      if (!isNumber && !allowedKeys.includes(e.key)) {
                        e.preventDefault();
                        toast.dismiss();
                        toast.warning("Please enter numbers only");
                      }
                    }}
                    parser={(value) => {
                      // Chỉ giữ lại số
                      return value.replace(/[^\d]/g, '');
                    }}
                    formatter={(value) => {
                      // Định dạng hiển thị chỉ số
                      return `${value}`.replace(/[^\d]/g, '');
                    }}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Payment Method</label>
                  <Select
                    value={paymentMethod}
                    onChange={(value) => setPaymentMethod(value)}
                    className="w-full"
                    size="large"
                  >
                    <Option value="CASH">💵 Cash</Option>
                    <Option value="VISA">💳 Visa</Option>
                    <Option value="TRANSFER">🏦 Transfer</Option>
                  </Select>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleBooking}
                    className="w-full bg-blue-600 text-green py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={handleBack}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition duration-300"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TourDetail;
