import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Table, Modal, Button, Tag, Space, Select, Input, Tooltip } from "antd";
import {
  DollarOutlined,
  CreditCardOutlined,
  BankOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const formatVND = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
};

const BookingListForStaff = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [bookingList, setBookingList] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [editedBooking, setEditedBooking] = useState(null);
  const [isViewParticipantsModalVisible, setIsViewParticipantsModalVisible] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const [selectedBookingForParticipants, setSelectedBookingForParticipants] = useState(null);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "complete", label: "Complete" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const filteredBookings = bookingList.filter((booking) =>
    filteredStatus === "all"
      ? true
      : booking.paymentStatus.toLowerCase() === filteredStatus
  );

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const bookingListResponse = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/bookings/BookingForTour",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const sortedBookings = [...response.data].sort((a, b) => b.id - a.id);
        setBookingList(sortedBookings);
      }
    } catch (error) {
      console.error("Error fetching Booking data:", error);
      toast.error("Failed to fetch Booking data.");
    }
  };

  useEffect(() => {
    bookingListResponse();
  }, []);

  const handleViewDetailBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCreateBookingKoi = (bookingId) => {
    navigate(`/booking-koi/${bookingId}`);
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer Name",
      dataIndex: "nameCus",
      key: "nameCus",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => formatVND(totalAmount),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag
          color={
            status === "pending"
              ? "gold"
              : status === "complete"
              ? "green"
              : status === "processing"
              ? "blue" // Changed to blue for processing
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleViewDetailBooking(record)}
          >
            View Details
          </Button>

          <Button
            type="default"
            onClick={() => handleViewParticipants(record)}
            icon={<UserOutlined />}
          >
            View Participants
          </Button>

          {record.paymentStatus.toLowerCase() === "pending" && record.updatedBy === '' && (
            <div>
              <Button
                type="primary"
                onClick={() => handleAcceptBooking(record.id)}
                style={{ backgroundColor: "#10B981" }}
              >
                Accept
              </Button>
            </div>
          )}

          {record.paymentStatus.toLowerCase() === "complete" && (
            <Button
              type="primary"
              onClick={() => handleCreateBookingKoi(record.id)}
              style={{ backgroundColor: "#10B981" }}
            >
              Create Koi Booking
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleFieldChange = (field, value) => {
    if (field === "vat") {
      // Chỉ cho phép số và dấu chấm
      const numericValue = value.replace(/[^\d.]/g, "");
      if (
        numericValue === "" ||
        (parseFloat(numericValue) >= 0 && parseFloat(numericValue) <= 100)
      ) {
        setEditedBooking((prev) => ({
          ...prev,
          [field]: numericValue,
        }));
      } else {
        toast.error("VAT must be between 0 and 100");
      }
    } else if (field === "discountAmount") {
      // Chỉ cho phép số và dấu chấm
      const numericValue = value.replace(/[^\d.]/g, "");
      if (numericValue === "" || parseFloat(numericValue) >= 0) {
        setEditedBooking((prev) => ({
          ...prev,
          [field]: numericValue,
        }));
      } else {
        toast.error("Discount amount must be greater than or equal to 0");
      }
    } else {
      setEditedBooking((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleUpdateBooking = async (bookingId) => {
    try {
      if (!bookingId) {
        toast.error("Booking ID not found");
        return;
      }

      // Validate VAT
      if (
        !editedBooking.vat ||
        parseFloat(editedBooking.vat) < 0 ||
        parseFloat(editedBooking.vat) > 100
      ) {
        toast.error("VAT must be between 0 and 100");
        return;
      }

      // Validate Discount Amount
      if (
        !editedBooking.discountAmount ||
        parseFloat(editedBooking.discountAmount) < 0
      ) {
        toast.error("Discount amount must be greater than or equal to 0");
        return;
      }

      const bookingUpdateRequestStaff = {
        bookingID: bookingId,
        vat: parseFloat(editedBooking.vat) / 100,
        paymentMethod: editedBooking.paymentMethod,
        paymentStatus: "processing",
        discountAmount: parseFloat(editedBooking.discountAmount),
      };

      const response = await axios.put(
        "http://localhost:8080/bookings/admin/updateResponseFormStaff",
        bookingUpdateRequestStaff,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Booking updated successfully!");
        setIsModalOpen(false);
        bookingListResponse();
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking.");
    }
  };

  // When modal opens, initialize editedBooking with selected booking values
  useEffect(() => {
    if (selectedBooking) {
      setEditedBooking({
        vat: (selectedBooking.vat * 100).toString(),
        paymentMethod: selectedBooking.paymentMethod,
        discountAmount: selectedBooking.discountAmount,
      });
    }
  }, [selectedBooking]);

  // Thêm styles cho input disabled
  const disabledInputStyle = {
    backgroundColor: "white",
    color: "black",
    borderColor: "#d9d9d9",
    cursor: "not-allowed",
    opacity: 0.8,
  };

  // Add this helper function to get payment method icon and color
  const getPaymentMethodInfo = (method) => {
    switch (method?.toUpperCase()) {
      case "VISA":
        return {
          icon: <CreditCardOutlined />,
          color: "text-blue-500",
          label: "Visa",
        };
      case "TRANSFER":
        return {
          icon: <BankOutlined />,
          color: "text-purple-500",
          label: "Transfer",
        };
      case "CASH":
        return {
          icon: <DollarOutlined />,
          color: "text-green-500",
          label: "Cash",
        };
      default:
        return {
          icon: <DollarOutlined />,
          color: "text-gray-500",
          label: method || "Unknown",
        };
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/bookings/BookingForTourUpdateAccept/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Booking accepted successfully!");
        bookingListResponse(); // Refresh the booking list
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.error(
        "Failed to accept booking: " +
          (error.response?.data?.message || error.message)
      );
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

  const handleUpdateCheckinStatus = async (checkinId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/checkins/status/${checkinId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update the participant's status in the current list
      setCurrentParticipants(prevParticipants =>
        prevParticipants.map(participant =>
          participant.id === checkinId ? { ...participant, status: 'CHECKED' } : participant
        )
      );
      
      toast.success('Check-in status updated successfully');
    } catch (error) {
      console.error('Error updating check-in status:', error);
      toast.error('Failed to update check-in status');
    }
  };

  return (
    <div className="p-6" style={{ marginTop: "100px" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booking List</h1>
        <Space>
          <div style={{ marginRight: "16px" }}>
            <span style={{ marginRight: "8px" }}>Payment Status:</span>
            <Select
              defaultValue="all"
              style={{ width: 200 }}
              onChange={(value) => setFilteredStatus(value)}
              options={statusOptions}
            />
          </div>
          <Button type="primary" onClick={() => navigate("/staff/Quotation")}>
            View Quotations
          </Button>
          <Button
            type="primary"
            onClick={() => navigate("/staff/checkin-service")}
          >
            View Check-ins
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredBookings}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-2xl font-bold text-indigo-700">
              Booking Details
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <div key="footer" className="flex justify-end space-x-2">
            {selectedBooking &&
              selectedBooking.paymentStatus.toLowerCase() === "pending" && (
                <Button
                  type="primary"
                  onClick={() => handleUpdateBooking(selectedBooking.id)}
                  className="flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all duration-200 bg-indigo-600 hover:bg-indigo-700"
                >
                  <SaveOutlined />
                  Save Update
                </Button>
              )}
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </div>,
        ]}
        width={800}
      >
        {selectedBooking && (
          <div className="p-4">
            {/* Basic Information Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-bold text-indigo-700 mb-4 flex items-center gap-2">
                <InfoCircleOutlined className="text-indigo-500" />
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      Booking ID:
                    </span>
                    <span className="font-bold text-indigo-600">
                      {selectedBooking.id}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      Customer Name:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedBooking.nameCus}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      Customer ID:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedBooking.customerID}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      Created Date:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatDateTime(selectedBooking.createdDate)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      Created By:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedBooking.createdBy}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information Card */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                <DollarOutlined className="text-purple-500" />
                Payment Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      Total Amount:
                    </span>
                    <span className="font-bold text-green-600">
                      {formatVND(selectedBooking.totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      VAT (%):
                    </span>
                    <Input
                      value={editedBooking?.vat}
                      onChange={(e) => handleFieldChange("vat", e.target.value)}
                      className="w-24 ml-2 bg-white border-gray-200 text-gray-800"
                      placeholder="0-100"
                      status={
                        editedBooking?.vat &&
                        (parseFloat(editedBooking.vat) < 0 ||
                          parseFloat(editedBooking.vat) > 100)
                          ? "error"
                          : ""
                      }
                      readOnly={
                        selectedBooking.paymentStatus.toLowerCase() !==
                        "pending"
                      }
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      Discount:
                    </span>
                    <Input
                      value={editedBooking?.discountAmount}
                      onChange={(e) =>
                        handleFieldChange("discountAmount", e.target.value)
                      }
                      className="w-32 ml-2 bg-white border-gray-200 text-gray-800"
                      prefix="$"
                      placeholder="≥ 0"
                      status={
                        editedBooking?.discountAmount &&
                        parseFloat(editedBooking.discountAmount) < 0
                          ? "error"
                          : ""
                      }
                      readOnly={
                        selectedBooking.paymentStatus.toLowerCase() !==
                        "pending"
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      Payment Method:
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg ${
                          getPaymentMethodInfo(selectedBooking.paymentMethod)
                            .color
                        }`}
                      >
                        {
                          getPaymentMethodInfo(selectedBooking.paymentMethod)
                            .icon
                        }
                      </span>
                      <span className="font-semibold">
                        {
                          getPaymentMethodInfo(selectedBooking.paymentMethod)
                            .label
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      Total With VAT:
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatVND(selectedBooking.totalAmountWithVAT)}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      Payment Status:
                    </span>
                    <Tag
                      color={
                        selectedBooking.paymentStatus.toLowerCase() ===
                        "pending"
                          ? "gold"
                          : selectedBooking.paymentStatus.toLowerCase() ===
                            "complete"
                          ? "green"
                          : selectedBooking.paymentStatus.toLowerCase() ===
                            "processing"
                          ? "blue"
                          : "red"
                      }
                      className="text-sm font-medium"
                    >
                      {selectedBooking.paymentStatus}
                    </Tag>
                    {selectedBooking.paymentStatus.toLowerCase() ===
                      "pending" && (
                      <span className="ml-2 text-sm text-gray-500 italic">
                        (Will be updated to Processing)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={
          <div className="flex items-center justify-between">
            <span>Participants for Booking #{selectedBookingForParticipants?.id || ''}</span>
            {selectedBookingForParticipants?.paymentStatus.toLowerCase() === 'cancelled' && (
              <Tag color="red">Cancelled Booking - Check-in Disabled</Tag>
            )}
            {selectedBookingForParticipants?.paymentStatus.toLowerCase() === 'pending' && (
              <Tag color="gold">Pending Booking - Check-in Disabled</Tag>
            )}
          </div>
        }
        visible={isViewParticipantsModalVisible}
        onCancel={() => setIsViewParticipantsModalVisible(false)}
        footer={null}
        width={700}
      >
        <div className="space-y-4">
          {currentParticipants.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No participants found for this booking
            </div>
          ) : (
            currentParticipants.map((participant, index) => (
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
                    <label className="text-xs text-gray-500">Created By</label>
                    <p className="font-medium">{participant.createBy}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <p className="font-medium">{participant.status}</p>
                  </div>
                  <div>
                    {(selectedBookingForParticipants?.paymentStatus.toLowerCase() !== 'cancelled' && 
                      selectedBookingForParticipants?.paymentStatus.toLowerCase() !== 'pending') ? (
                      <Button
                        type="primary"
                        onClick={() => handleUpdateCheckinStatus(participant.id)}
                        disabled={participant.status === 'CHECKED'}
                      >
                        {participant.status === 'CHECKED' ? 'Checked In' : 'Mark as Checked'}
                      </Button>
                    ) : (
                      <Tooltip title={`Check-in is disabled for ${selectedBookingForParticipants?.paymentStatus.toLowerCase()} bookings`}>
                        <Button disabled>
                          Check-in Disabled
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default BookingListForStaff;
