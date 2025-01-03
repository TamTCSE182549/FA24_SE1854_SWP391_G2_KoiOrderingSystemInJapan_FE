import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie"; // Thêm useCookies để lấy token từ cookie
import { jwtDecode } from "jwt-decode";
import {
  Button,
  Row,
  Col,
  Pagination,
  Tag,
  Tooltip,
  Modal,
  Rate,
  Input,
  Tabs,
} from "antd"; // Import Ant Design components
import {
  EyeOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";

const formatVND = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
};

const BookingInformation = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [bookingList, setBookingList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 4;
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isViewParticipantsModalVisible, setIsViewParticipantsModalVisible] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const [selectedBookingForParticipants, setSelectedBookingForParticipants] = useState(null);
  const [activeTab, setActiveTab] = useState('other');

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role); // Assuming the role is stored under 'role'
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const bookingListResponse = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/bookings/listBookingTourResponse",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Sort bookings by createdDate in descending order (newest first)
        const sortedBookings = response.data.sort((a, b) => 
          new Date(b.createdDate) - new Date(a.createdDate)
        );
        setBookingList(sortedBookings);
      }
    } catch (error) {
      console.error("Error fetching Booking data:", error);
      toast.error("Failed to fetch Booking data.");
    }
  };

  const handlePayment = (booking) => {
    if (!token) {
      toast.warning("You are not logged in. Please login.");
      navigate(`/login`);
    } else {
      navigate(`/payment/${booking.id}`);
    }
  };

  useEffect(() => {
    bookingListResponse();
  }, []);

  if (!bookingList.length) {
    return <div>Loading...</div>;
  }

  const handleViewDetailBooking = (booking) => {
    if (!token) {
      toast.warn("You need to login first");
      navigate(`/login`);
      return;
    }
    
    navigate("/bookingTourDetail", { state: { booking } });
    return;
  };

  const handleDeleteBooking = async (booking) => {
    try {
      if (booking.paymentStatus === "complete") {
        toast.warn("You only can delete if Payment Status is not COMPLETE");
        return;
      }
      await axios.put(
        `http://localhost:8080/bookings/delete/${booking.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Delete Success");
      bookingListResponse();
    } catch (error) {
      toast.error("Delete Booking Fail");
    }
  };

  const handleFeedbackClick = (booking) => {
    setSelectedBookingId(booking.id);
    setIsFeedbackModalVisible(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      await axios.post(
        "http://localhost:8080/feedback/create",
        {
          bookingId: selectedBookingId,
          rating: feedbackRating,
          content: feedbackContent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Feedback submitted successfully!");
      setIsFeedbackModalVisible(false);
      // Reset form
      setFeedbackRating(0);
      setFeedbackContent("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error.response.data);
    }
  };

  const handleViewParticipants = async (booking) => {
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
      setSelectedBookingForParticipants(booking);
      setIsViewParticipantsModalVisible(true);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast.error(error.response?.data || 'Failed to fetch participants');
    }
  };

  // Calculate the bookings to display on the current page
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;

  const getFilteredBookings = () => {
    let filteredList;
    if (activeTab === 'other') {
      filteredList = bookingList.filter(booking => booking.paymentStatus !== 'complete');
    } else {
      filteredList = bookingList.filter(booking => booking.paymentStatus === 'complete');
    }

    // Sort filtered bookings by createdDate
    return filteredList.sort((a, b) => 
      new Date(b.createdDate) - new Date(a.createdDate)
    );
  };

  const filteredBookings = getFilteredBookings();
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "processing":
        return "blue";
      case "delivery":
        return "purple";
      case "cancelled":
        return "red";
      case "complete":
        return "green";
      case "shipped":
        return "cyan";
      default:
        return "default"; // Màu mặc định nếu không có trạng thái phù hợp
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "CASH":
        return "green";
      case "VISA":
        return "blue";
      case "TRANSFER":
        return "gold";
      default:
        return "default"; // Màu mặc định nếu không có phương thức phù hợp
    }
  };

  return (
    <div className="container mx-auto px-4 mt-40 pt-10 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          My Koi Bookings
        </h1>
        <p className="text-gray-600">
          Track and manage your Koi fish purchases
        </p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="mb-6"
        items={[
          {
            key: 'other',
            label: (
              <span className="px-4">
                Other Status
                <Tag className="ml-2" color="orange">
                  {bookingList.filter(b => b.paymentStatus !== 'complete').length}
                </Tag>
              </span>
            ),
          },
          {
            key: 'complete',
            label: (
              <span className="px-4">
                Complete
                <Tag className="ml-2" color="green">
                  {bookingList.filter(b => b.paymentStatus === 'complete').length}
                </Tag>
              </span>
            ),
          },
        ]}
      />

      {filteredBookings.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">
            No {activeTab === 'other' ? 'other status' : 'complete'} bookings found
          </div>
        </div>
      ) : (
        <section>
          <Row gutter={[24, 24]}>
            {currentBookings.map((booking, index) => (
              <Col key={index} xs={24} md={12} xl={6}>
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                  {/* Header - giảm padding */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 text-white">
                    <h3 className="text-base font-semibold">
                      Booking #{booking.id}
                    </h3>
                    <p className="text-xs opacity-90">
                      {formatDateTime(booking.createdDate)}
                    </p>
                  </div>

                  <div className="p-3 flex flex-col gap-3"> {/* Giảm padding và gap */}
                    {/* Left: Koi Image Section - điều chỉnh chiều cao */}
                    <div className="w-full">
                      <div className="relative group">
                        <img
                          src="https://asiatourist.vn/wp-content/uploads/2021/04/khu-du-lich-la-phong-da-lat-5.jpg"
                          alt="Koi Fish"
                          className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:opacity-90 transition-opacity duration-300"
                        />
                      </div>
                    </div>

                    {/* Price Information - thêm lại VAT và tối ưu layout */}
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <p className="text-gray-600 text-xs">Original Price</p>
                          <p className="font-semibold text-sm text-blue-700">
                            {formatVND(booking.totalAmount)}
                          </p>
                        </div>

                        <div className="bg-purple-50 p-2 rounded-lg">
                          <p className="text-gray-600 text-xs">VAT (10%)</p>
                          <p className="font-semibold text-sm text-purple-700">
                            {formatVND(booking.vatAmount)}
                          </p>
                        </div>

                        <div className="bg-green-50 p-2 rounded-lg">
                          <p className="text-gray-600 text-xs">Discount</p>
                          <p className="font-semibold text-sm text-green-600">
                            {formatVND(booking.discountAmount)}
                          </p>
                        </div>

                        <div className="bg-indigo-50 p-2 rounded-lg">
                          <p className="text-gray-600 text-xs">Total (Inc. VAT)</p>
                          <p className="font-semibold text-sm text-indigo-700">
                            {formatVND(booking.totalAmountWithVAT)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status and Payment Method - thu gọn padding */}
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Status</p>
                        <Tag
                          color={getPaymentStatusColor(booking.paymentStatus)}
                          className="text-xs"
                        >
                          {booking.paymentStatus.toUpperCase()}
                        </Tag>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">
                          Payment Method
                        </p>
                        <Tag
                          color={getPaymentMethodColor(booking.paymentMethod)}
                          className="text-xs"
                        >
                          {booking.paymentMethod}
                        </Tag>
                      </div>
                    </div>

                    {/* Action Buttons - Giảm gap xuống */}
                    <div className="grid grid-cols-3 gap-0.5"> {/* Thay đổi từ gap-1 thành gap-0.5 */}
                      <Tooltip title={"View booking details"}>
                        <Button
                          type="primary"
                          onClick={() => handleViewDetailBooking(booking)}
                          className={`flex items-center justify-center !bg-blue-500 hover:!bg-blue-600`}
                          icon={<EyeOutlined />}
                        />
                      </Tooltip>

                      <Tooltip title="View participants">
                        <Button
                          type="default"
                          onClick={() => handleViewParticipants(booking)}
                          className="!bg-purple-500 !text-white hover:!bg-purple-600 flex items-center justify-center"
                          icon={<UserOutlined />}
                        />
                      </Tooltip>

                      {booking.paymentStatus === "processing" && (
                        <Tooltip title="Proceed to payment">
                          <Button
                            type="primary"
                            onClick={() => handlePayment(booking)}
                            className="!bg-green-500 hover:!bg-green-600 flex items-center justify-center"
                            icon={<CreditCardOutlined />}
                          />
                        </Tooltip>
                      )}

                      {booking.paymentStatus !== "complete" && (
                        <Tooltip title="Cancel this booking">
                          <Button
                            danger
                            onClick={() => handleDeleteBooking(booking)}
                            className="hover:!bg-red-600 hover:!text-white flex items-center justify-center"
                            icon={<CloseCircleOutlined />}
                          />
                        </Tooltip>
                      )}
                      {booking.paymentStatus === "complete" && (
                        <Tooltip title="Give Feedback">
                          <Button
                            type="primary"
                            onClick={() => handleFeedbackClick(booking)}
                            className="hover:!bg-blue-600 hover:!text-white flex items-center justify-center"
                            icon={<MessageOutlined />}
                          />
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </section>
      )}

      {filteredBookings.length > 0 && (
        <Pagination
          current={currentPage}
          pageSize={bookingsPerPage}
          total={filteredBookings.length}
          onChange={onPageChange}
          className="text-center mt-8 mb-12"
        />
      )}

      <Modal
        title="Give Your Feedback"
        visible={isFeedbackModalVisible}
        onOk={handleSubmitFeedback}
        onCancel={() => {
          setIsFeedbackModalVisible(false);
          setFeedbackRating(0);
          setFeedbackContent("");
        }}
        okText="Submit Feedback"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-gray-700">Rate your experience:</p>
            <Rate
              value={feedbackRating}
              onChange={setFeedbackRating}
              className="text-yellow-500"
            />
          </div>
          <div>
            <p className="mb-2 text-gray-700">Your feedback:</p>
            <Input.TextArea
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              placeholder="Please share your experience..."
              rows={4}
            />
          </div>
        </div>
      </Modal>
      <Modal
        title={`Participants for Booking #${selectedBookingForParticipants?.id || ''}`}
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

export default BookingInformation;
