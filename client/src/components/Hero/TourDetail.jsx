import React, { useState, useEffect } from "react";
import {
  DatePicker,
  InputNumber,
  Select,
  Card,
  Typography,
  Descriptions,
  Tag,
  Divider,
  Modal,
} from "antd";
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
import {
  GlobalOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";

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
  const [participantInfo, setParticipantInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [farmDetails, setFarmDetails] = useState([]);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  // Thêm state tạm thời để lưu thông tin participant mới
  const [newParticipant, setNewParticipant] = useState({
    firstName: "",
    lastName: "",
  });

  // Thêm state để quản lý nhiều participant mới
  const [newParticipants, setNewParticipants] = useState([
    {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      passport: "",
    },
  ]);

  // Thêm state cho thông tin chung
  const [commonInfo, setCommonInfo] = useState({
    airline: "",
    airport: "",
    checkinDate: format(new Date(tour?.startTime || new Date()), "yyyy-MM-dd"),
  });

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

  useEffect(() => {
    const fetchFarmDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/TourDetail/tour/${tour.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setFarmDetails(response.data);
      } catch (error) {
        console.error("Error fetching farm details:", error);
      }
    };

    if (tour?.id) {
      fetchFarmDetails();
    }
  }, [id, tour?.id, token]);

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

  const handleAddParticipant = () => {
    if (participantInfo.length >= tour.remaining) {
      toast.dismiss();
      toast.warning(`Maximum number of participants is ${tour.remaining}`);
      return;
    }
    setParticipantInfo([...participantInfo, { firstName: "", lastName: "" }]);
  };

  const handleParticipantChange = (index, field, value) => {
    const newParticipants = [...participantInfo];
    newParticipants[index] = {
      ...newParticipants[index],
      [field]: value,
    };
    setParticipantInfo(newParticipants);
  };

  const handleRemoveParticipant = (indexToRemove) => {
    const newParticipantInfo = participantInfo.filter(
      (_, index) => index !== indexToRemove
    );
    setParticipantInfo(newParticipantInfo);
  };

  // Add these validation functions near the top of your component
  const validateName = (name) => {
    return name.trim().length > 0;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^09\d{8}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const validatePassport = (passport) => {
    const passportRegex = /^B\d{7}$/;
    return passportRegex.test(passport);
  };

  // Thêm hàm xử lý thay đổi thông tin chung
  const handleCommonInfoChange = (e) => {
    setCommonInfo({
      ...commonInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (tour) => {
    // Kiểm tra nếu người dùng chưa đăng nhập
    if (!token) {
      toast.error("Need to login for view");
      return;
    }

    // Kiểm tra điều kiện số lượng người tham gia
    if (participantInfo.length <= 0) {
      toast.warning("Paticipants must be larger than 0");
      return;
    }
    if (participantInfo.length > tour.remaining) {
      toast.warning(
        `Participants must be equal or less than ${tour.remaining}.`
      );
      return;
    }

    // Kiểm tra nếu người dùng đã có booking chưa hoàn thành
    if (Object.keys(bookings).length > 0) {
      toast.warn("You have booking not complete. Please check again!");
      return;
    }

    // Add validation before booking
    for (const participant of participantInfo) {
      if (
        !validateName(participant.firstName) ||
        !validateName(participant.lastName)
      ) {
        toast.error(
          "First name and last name are required for all participants"
        );
        return;
      }

      if (!participant.phoneNumber || !validatePhone(participant.phoneNumber)) {
        toast.error(
          "Phone number is required and must be in format 09xxxxxxxx"
        );
        return;
      }

      if (!participant.passport || !validatePassport(participant.passport)) {
        toast.error(
          "Passport is required and must be in format B2700000 (B followed by 7 digits)"
        );
        return;
      }

      if (participant.email && !validateEmail(participant.email)) {
        toast.error("Email must be in format xxx@gmail.com");
        return;
      }
    }

    for (let i = 0; i < participantInfo.length; i++) {
      if (
        !participantInfo[i].firstName.trim() ||
        !participantInfo[i].lastName.trim()
      ) {
        toast.dismiss();
        toast.warning(
          `Please fill in all participant information for participant ${i + 1}`
        );
        return;
      }
      if (
        containsSpecialChars(participantInfo[i].firstName) ||
        containsSpecialChars(participantInfo[i].lastName)
      ) {
        toast.dismiss();
        toast.warning(
          `Names can only contain letters and spaces for participant ${i + 1}`
        );
        return;
      }
    }

    // Thêm validation cho thông tin chung
    if (!commonInfo.airline.trim()) {
      toast.error("Airline is required");
      return;
    }

    if (!commonInfo.airport.trim()) {
      toast.error("Airport is required");
      return;
    }

    if (!commonInfo.checkinDate) {
      toast.error("Check-in Date is required");
      return;
    }

    const bookingData = {
      tourID: Number(tour.id),
      paymentMethod: paymentMethod,
      participants: participantInfo.length,
    };

    try {
      if (participantInfo.length <= Number(tour.remaining)) {
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
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          const bookingId = response.data.id;

          await Promise.all(
            participantInfo.map((participant) => {
              const checkinData = {
                firstName: participant.firstName,
                lastName: participant.lastName,
                email: participant.email,
                phoneNumber: participant.phoneNumber,
                passport: participant.passport,
                airline: commonInfo.airline,
                airport: commonInfo.airport,
                checkinDate: commonInfo.checkinDate,
                bookingTour: bookingId,
                bookingKoi: null,
              };

              return axios.post(
                `http://localhost:8080/checkins/${bookingId}`,
                checkinData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
            })
          );

          console.log("Booking successful:", response.data);
          navigate("/tour", { state: { toastMessage: "Booking successful!" } });
        }
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
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        console.error("Error message:", error.message);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm hàm kiểm tra ký tự đặc biệt
  const containsSpecialChars = (str) => {
    // Regex này chỉ cho phép chữ cái (cả hoa và thường), khoảng trắng và dấu gạch ngang
    const regex = /^[a-zA-Z\s-]+$/;
    return !regex.test(str);
  };

  const handleViewFarmDetail = (farmId) => {
    navigate(`/farmdetail/${farmId}`);
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalOk = () => {
    // Validate all participants
    for (const participant of newParticipants) {
      if (
        !validateName(participant.firstName) ||
        !validateName(participant.lastName)
      ) {
        toast.error(
          "First name and last name are required for all participants"
        );
        return;
      }

      if (!participant.phoneNumber || !validatePhone(participant.phoneNumber)) {
        toast.error(
          "Phone number is required and must be in format 09xxxxxxxx"
        );
        return;
      }

      if (!participant.passport || !validatePassport(participant.passport)) {
        toast.error(
          "Passport is required and must be in format B2700000 (B followed by 7 digits)"
        );
        return;
      }

      if (participant.email && !validateEmail(participant.email)) {
        toast.error("Email must be in format xxx@gmail.com");
        return;
      }
    }

    setParticipantInfo([...participantInfo, ...newParticipants]);
    setNewParticipants([
      { firstName: "", lastName: "", email: "", phoneNumber: "", passport: "" },
    ]);
    setIsAddModalVisible(false);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const showViewModal = () => {
    if (participantInfo.length === 0) {
      toast.info("No participants added yet!");
      return;
    }
    setIsViewModalVisible(true);
  };

  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
  };

  const addNewParticipantForm = () => {
    if (participantInfo.length + newParticipants.length >= tour.remaining) {
      toast.dismiss();
      toast.warning(`Maximum number of participants is ${tour.remaining}`);
      return;
    }
    setNewParticipants([
      ...newParticipants,
      { firstName: "", lastName: "", email: "", phoneNumber: "", passport: "" },
    ]);
  };

  const handleNewParticipantChange = (index, field, value) => {
    const updatedParticipants = [...newParticipants];
    updatedParticipants[index][field] = value;
    setNewParticipants(updatedParticipants);
  };

  // Thêm hàm xử lý remove participant form
  const removeParticipantForm = (indexToRemove) => {
    if (newParticipants.length > 1) {
      const updatedParticipants = newParticipants.filter(
        (_, index) => index !== indexToRemove
      );
      setNewParticipants(updatedParticipants);
    } else {
      toast.info("At least one participant is required");
    }
  };

  // Thêm options cho airline với label và value giống nhau
  const airlineOptions = [
    { value: "Vietnam Airlines", label: "Vietnam Airlines" },
    { value: "Vietjet Air", label: "Vietjet Air" },
    { value: "Jetstar Pacific", label: "Jetstar Pacific" },
    { value: "Bamboo Airways", label: "Bamboo Airways" },
  ];

  // Thêm options cho airport
  const airportOptions = [
    {
      value: "Noi Bai International Airport (Hanoi)",
      label: "Noi Bai International Airport (Hanoi)",
    },
    {
      value: "Tan Son Nhat International Airport (Ho Chi Minh City)",
      label: "Tan Son Nhat International Airport (Ho Chi Minh City)",
    },
    {
      value: "Da Nang International Airport",
      label: "Da Nang International Airport",
    },
    {
      value: "Cam Ranh International Airport (Khanh Hoa)",
      label: "Cam Ranh International Airport (Khanh Hoa)",
    },
    {
      value: "Phu Bai International Airport (Thua Thien Hue)",
      label: "Phu Bai International Airport (Thua Thien Hue)",
    },
    {
      value: "Lien Khuong International Airport (Da Lat)",
      label: "Lien Khuong International Airport (Da Lat)",
    },
    {
      value: "Cat Bi International Airport (Hai Phong)",
      label: "Cat Bi International Airport (Hai Phong)",
    },
  ];

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
              <h1 className="text-5xl font-bold text-white mb-4">
                {tour.tourName}
              </h1>
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Tour Details
              </h2>
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
                  <p className="text-lg text-green-600 font-medium">
                    {tour.maxParticipants}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Remaining Spots</p>
                  <p className="text-lg font-medium text-green-600">
                    {tour.remaining}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {tour.description}
              </p>
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

            {/* Farm Details Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Included Destinations
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Explore the unique farms and locations included in this tour
                  </p>
                </div>
                <Tag color="blue" className="text-base px-4 py-1">
                  {farmDetails.length} Locations
                </Tag>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {farmDetails.map((farm, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none"
                    bodyStyle={{ padding: 0 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                      {/* Left Section - Main Info */}
                      <div className="lg:col-span-3 p-8 bg-white">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Typography.Title level={3} className="!mb-2">
                              {farm.farmName}
                            </Typography.Title>
                            <div className="flex items-center gap-2 text-gray-500">
                              <ClockCircleOutlined />
                              <span>Included in tour schedule</span>
                            </div>
                          </div>
                          <Tag color="green" className="text-sm">
                            Featured Location
                          </Tag>
                        </div>

                        <Divider className="my-6" />

                        <div className="space-y-4">
                          {farm.address && (
                            <div className="flex items-center gap-3 group">
                              <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                                <EnvironmentOutlined className="text-blue-600 text-lg" />
                              </div>
                              <Typography.Text className="text-gray-600">
                                {farm.address}
                              </Typography.Text>
                            </div>
                          )}

                          {farm.website && (
                            <div className="flex items-center gap-3 group">
                              <div className="p-2 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                                <GlobalOutlined className="text-green-600 text-lg" />
                              </div>
                              <Typography.Link
                                href={farm.website}
                                target="_blank"
                                className="text-gray-600 hover:text-blue-600"
                              >
                                {farm.website}
                              </Typography.Link>
                            </div>
                          )}

                          {farm.phone && (
                            <div className="flex items-center gap-3 group">
                              <div className="p-2 rounded-full bg-purple-50 group-hover:bg-purple-100 transition-colors">
                                <PhoneOutlined className="text-purple-600 text-lg" />
                              </div>
                              <Typography.Text className="text-gray-600">
                                {farm.phone}
                              </Typography.Text>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Description */}
                      <div className="lg:col-span-2 p-8 bg-gray-50">
                        <div className="h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <InfoCircleOutlined className="text-blue-600" />
                              <Typography.Text strong className="text-gray-700">
                                About this location
                              </Typography.Text>
                            </div>
                            <Typography.Paragraph
                              className="text-gray-600 leading-relaxed"
                              ellipsis={{
                                rows: 4,
                                expandable: true,
                                symbol: "Read more",
                              }}
                            >
                              {farm.description}
                            </Typography.Paragraph>
                          </div>

                          {/* Add View Details Button */}
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleViewFarmDetail(farm.farmId)}
                              className="group w-full flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-600 font-medium py-2 px-4 rounded-lg border-2 border-blue-100 transition-all duration-300"
                            >
                              View Farm Details
                              <RightOutlined className="group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Book This Tour
              </h2>

              <div className="space-y-6">
                {/* Common Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Travel Information
                  </h3>

                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      Airline
                    </label>
                    <Select
                      value={commonInfo.airline}
                      onChange={(value) =>
                        setCommonInfo((prev) => ({ ...prev, airline: value }))
                      }
                      className="w-full"
                      placeholder="Select airline"
                      options={airlineOptions}
                      size="large"
                    ></Select>
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      Airport
                    </label>
                    <Select
                      value={commonInfo.airport}
                      onChange={(value) =>
                        setCommonInfo((prev) => ({ ...prev, airport: value }))
                      }
                      className="w-full"
                      placeholder="Select airport"
                      options={airportOptions}
                      size="large"
                    ></Select>
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      name="checkinDate"
                      value={commonInfo.checkinDate}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                {/* Existing Number of Guests section */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <InputNumber
                    value={participantInfo.length}
                    disabled
                    className="w-full !rounded-xl"
                    size="large"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700">
                      Participant Information
                    </label>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={showViewModal}
                        className="text-green-600 hover:text-green-700 px-3 py-1 border border-green-600 rounded"
                      >
                        View Participants
                      </button>
                      <button
                        type="button"
                        onClick={showAddModal}
                        className="text-blue-600 hover:text-blue-700 px-3 py-1 border border-blue-600 rounded"
                      >
                        + Add Participant
                      </button>
                    </div>
                  </div>

                  {/* Add Participant Modal */}
                  <Modal
                    title="Add New Participant"
                    open={isAddModalVisible}
                    onOk={handleAddModalOk}
                    onCancel={handleAddModalCancel}
                    okText="Add"
                    cancelText="Cancel"
                  >
                    <div className="p-4">
                      {newParticipants.map((participant, index) => (
                        <div key={index} className="mb-6 p-4 border rounded-lg">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <input
                                type="text"
                                placeholder="First Name *"
                                className="border rounded-lg p-2 text-black w-full"
                                value={participant.firstName}
                                onChange={(e) =>
                                  handleNewParticipantChange(
                                    index,
                                    "firstName",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="Last Name *"
                                className="border rounded-lg p-2 text-black w-full"
                                value={participant.lastName}
                                onChange={(e) =>
                                  handleNewParticipantChange(
                                    index,
                                    "lastName",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <input
                                type="email"
                                placeholder="Email (optional)"
                                className="border rounded-lg p-2 text-black w-full"
                                value={participant.email}
                                onChange={(e) =>
                                  handleNewParticipantChange(
                                    index,
                                    "email",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <input
                                type="tel"
                                placeholder="Phone Number (09xxxxxxxx) *"
                                className="border rounded-lg p-2 text-black w-full"
                                value={participant.phoneNumber}
                                onChange={(e) =>
                                  handleNewParticipantChange(
                                    index,
                                    "phoneNumber",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <input
                              type="text"
                              placeholder="Passport Number (Bxxxxxxx) (7-digit number after B) *"
                              className="border rounded-lg p-2 text-black w-full"
                              value={participant.passport}
                              onChange={(e) =>
                                handleNewParticipantChange(
                                  index,
                                  "passport",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          {newParticipants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeParticipantForm(index)}
                              className="mt-4 text-red-500 hover:text-red-700"
                            >
                              Remove Participant
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addNewParticipantForm}
                        className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        + Add Another Participant
                      </button>
                      <div className="mt-4 text-sm text-gray-500">
                        * Required fields
                      </div>
                    </div>
                  </Modal>

                  {/* View Participants Modal */}
                  <Modal
                    title="View Participants"
                    open={isViewModalVisible}
                    onCancel={handleViewModalCancel}
                    footer={null}
                  >
                    <div className="p-4">
                      {participantInfo.length === 0 ? (
                        <div className="text-center text-gray-500">
                          No participants added yet
                        </div>
                      ) : (
                        participantInfo.map((participant, index) => (
                          <div
                            key={index}
                            className="mb-4 p-4 border rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-medium">
                                Participant {index + 1}
                              </h4>
                              <button
                                type="button"
                                onClick={() => handleRemoveParticipant(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-gray-500">
                                  First Name
                                </label>
                                <p className="font-medium">
                                  {participant.firstName}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">
                                  Last Name
                                </label>
                                <p className="font-medium">
                                  {participant.lastName}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">
                                  Email
                                </label>
                                <p className="font-medium">
                                  {participant.email}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">
                                  Phone
                                </label>
                                <p className="font-medium">
                                  {participant.phoneNumber}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <label className="text-xs text-gray-500">
                                  Passport
                                </label>
                                <p className="font-medium">
                                  {participant.passport}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Modal>

                  {/* Display current participants count */}
                  <div className="mt-2 p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-600">
                      Current Participants: {participantInfo.length}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Payment Method
                  </label>
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
                    onClick={() => handleBooking(tour)}
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
