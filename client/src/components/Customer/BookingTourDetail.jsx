import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Table, Button, Modal } from "antd";
import { UserOutlined, EnvironmentOutlined, InfoCircleOutlined, PhoneOutlined, GlobalOutlined } from "@ant-design/icons";

const BookingTourDetail = () => {
  const [bookingTourDetails, setBookingTourDetails] = useState([]);
  const [tourDetails, setTourDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { booking } = location.state || {};
  // Lấy token từ cookies
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [isViewParticipantsModalVisible, setIsViewParticipantsModalVisible] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const [farmDetails, setFarmDetails] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const navigate = useNavigate();

  // Gọi API để lấy chi tiết booking tour
  const fetchBookingTourDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/BookingTourDetail/${booking.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setBookingTourDetails(response.data);
        if (response.data && response.data.length > 0 && response.data[0].tourID) {
          await fetchTourDetails(response.data[0].tourID);
        }
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error("Failed to fetch Booking Tour Details");
    } finally {
      setLoading(false);
    }
  };

  // Add new function to fetch tour details
  const fetchTourDetails = async (tourId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/tour/findById/${tourId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setTourDetails(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch Tour Details");
    }
  };

  // Add function to handle viewing participants
  const handleViewParticipants = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/checkins/${booking.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentParticipants(response.data);
      setIsViewParticipantsModalVisible(true);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast.error('Failed to fetch participants');
    }
  };

  useEffect(() => {
    fetchBookingTourDetails();
  }, [booking]);

  useEffect(() => {
    const fetchFarmDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/TourDetail/tour/${tourDetails?.id}`,
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

    if (tourDetails?.id) {
      fetchFarmDetails();
    }
  }, [tourDetails?.id, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: "Tour Name",
      dataIndex: "tourName",
      key: "tourName",
      align: "center",
    },
    {
      title: "Participants",
      dataIndex: "participant",
      key: "participant",
      align: "center",
    }
  ];

  const handleViewFarmDetail = (farmId) => {
    navigate(`/farmdetail/${farmId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-indigo-900 mb-4">
            Booking Details
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
            Review your booking information and explore the exciting details of your upcoming adventure
          </p>
        </div>
      </div>

      {/* Add View Participants Button */}
      <div className="max-w-6xl mx-auto mb-8">
        <Button
          type="primary"
          icon={<UserOutlined />}
          onClick={handleViewParticipants}
          className="bg-purple-500 hover:bg-purple-600"
        >
          View Participants
        </Button>
      </div>

      {/* Booking Table Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500">
            <h3 className="text-xl font-semibold text-white">Booking Summary</h3>
          </div>
          <div className="p-6">
            <Table
              columns={columns}
              dataSource={bookingTourDetails}
              rowKey="bookingTourDetailID"
              pagination={false}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Tour Details Section */}
      {tourDetails && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
            {/* Tour Image Container */}
            <div className="relative h-[500px]">
              <img 
                src={tourDetails.tourImg} 
                alt={tourDetails.tourName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    tourDetails.tourStatus === 'active' 
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                      : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                  }`}>
                    {tourDetails.tourStatus}
                  </span>
                </div>
                <h3 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{tourDetails.tourName}</h3>
              </div>
            </div>

            {/* Tour Information */}
            <div className="p-8 bg-gradient-to-b from-white to-indigo-50">
              {/* Description */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-indigo-900 mb-4">About This Tour</h4>
                <p className="text-indigo-700 leading-relaxed">{tourDetails.description}</p>
              </div>

              {/* Tour Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Time Information */}
                <div className="space-y- flex betwee">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-indigo-900 mb-1">Start Time</p>
                      <p className="text-indigo-700">
                        {new Date(tourDetails.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-indigo-900 mb-1">End Time</p>
                      <p className="text-indigo-700">
                        {new Date(tourDetails.endTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Farm Destinations Section */}
      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500">
            <h3 className="text-xl font-semibold text-white">Included Destinations</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmDetails.map((farm, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleViewFarmDetail(farm.farmId)}
                >
                  <div className="relative h-48">
                    <img
                      src={farm.farmImage}
                      alt={farm.farmName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-semibold text-lg">{farm.farmName}</h4>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {farm.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <EnvironmentOutlined className="text-indigo-500" />
                        <span className="text-sm text-gray-500">{farm.location}</span>
                      </div>
                      <InfoCircleOutlined className="text-indigo-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Participants Modal */}
      <Modal
        title={`Participants for Booking #${booking?.id || ''}`}
        visible={isViewParticipantsModalVisible}
        onCancel={() => setIsViewParticipantsModalVisible(false)}
        footer={null}
        width={700}
      >
        <div className="space-y-6">
          {/* Common Information Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Common Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Created By</label>
                <p className="font-medium">{currentParticipants[0]?.createBy || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Airport</label>
                <p className="font-medium">{currentParticipants[0]?.airport || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Airline</label>
                <p className="font-medium">{currentParticipants[0]?.airline || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Check-in Date</label>
                <p className="font-medium">
                  {currentParticipants[0]?.checkinDate 
                    ? new Date(currentParticipants[0].checkinDate).toLocaleString() 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Participants Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Participants Information</h3>
            {currentParticipants.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No participants found for this booking
              </div>
            ) : (
              <div className="space-y-4">
                {currentParticipants.map((participant, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">First Name</label>
                        <p className="font-medium">{participant.firstName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Last Name</label>
                        <p className="font-medium">{participant.lastName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <p className="font-medium">{participant.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Phone</label>
                        <p className="font-medium">{participant.phoneNumber}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Passport</label>
                        <p className="font-medium">{participant.passport}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Status</label>
                        <p className="font-medium">{participant.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default BookingTourDetail;
