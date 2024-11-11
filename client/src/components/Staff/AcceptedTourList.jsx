import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Button, Spin, Space, Modal, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { ArrowLeftOutlined, DollarOutlined, InfoCircleOutlined, SaveOutlined, CreditCardOutlined, BankOutlined } from '@ant-design/icons';

const formatVND = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
};

const AcceptedTourList = () => {
  const vatOptions = [
    { value: "0", label: "0%" },
    { value: "10", label: "10%" }
  ];

  const [acceptedTours, setAcceptedTours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null); 
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [selectedBookingForQuotation, setSelectedBookingForQuotation] = useState(null);
  const [quotationAmount, setQuotationAmount] = useState("");
  const [editedBooking, setEditedBooking] = useState(null);
  const [quotationDescription, setQuotationDescription] = useState("Quotation being in Process...");
  const [amountError, setAmountError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  // Thêm state để lưu trữ các bookingId đã tạo quotation
  const [createdQuotations, setCreatedQuotations] = useState(new Set());

  const handleGoBack = () => {
    navigate(-1);
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "complete", label: "Complete" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const filteredBookings = acceptedTours.filter((booking) =>
    filteredStatus === "all"
      ? true
      : booking.paymentStatus.toLowerCase() === filteredStatus
  );


  const handleViewDetailBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCreateQuotation = async (booking) => {
    try {
      if (booking.paymentStatus.toLowerCase() !== "pending") {
        toast.warning("Can only create quotations for pending bookings");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/quotations/create",
        {
          bookingId: booking.id,
          amount: booking.totalAmount,
          description: "Quotation being in Process..."
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        // Thêm bookingId vào set các quotation đã tạo
        setCreatedQuotations(prev => new Set([...prev, booking.id]));
        toast.success("Quotation created successfully!");
        fetchAcceptedTours();
        toast.info(<span className="italic">Waiting to be accepted...</span>);
      }
    } catch (error) {
      console.error("Error creating quotation:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again");
        navigate("/login");
      } else {
        toast.error(
          "Failed to create quotation: " + 
          (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleCreateBookingKoi = (bookingId) => {
    navigate(`/booking-koi/${bookingId}`);
  };

  const handleFieldChange = (field, value) => {
    if (field === "vat") {
      setEditedBooking((prev) => ({
        ...prev,
        [field]: value,
      }));
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

      // Validate VAT (chỉ cho phép 0 hoặc 10)
      if (!["0", "10"].includes(editedBooking.vat)) {
        toast.error("VAT must be either 0% or 10%");
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

  const getPaymentMethodInfo = (method) => {
    switch (method?.toUpperCase()) {
      case 'VISA':
        return {
          icon: <CreditCardOutlined />,
          color: 'text-blue-500',
          label: 'Visa'
        };
      case 'TRANSFER':
        return {
          icon: <BankOutlined />,
          color: 'text-purple-500',
          label: 'Transfer'
        };
      case 'CASH':
        return {
          icon: <DollarOutlined />,
          color: 'text-green-500',
          label: 'Cash'
        };
      default:
        return {
          icon: <DollarOutlined />,
          color: 'text-gray-500',
          label: method || 'Unknown'
        };
    }
  };

  const validateAmount = (value) => {
    if (isNaN(value) || value <= 0) {
      setAmountError("Amount must be a positive number");
      return false;
    }
    if (value > 100000) {
      setAmountError("Amount cannot exceed 100,000");
      return false;
    }
    setAmountError("");
    return true;
  };

  const handleQuotationSubmit = async () => {
    try {
      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/quotations/create",
        {
          bookingId: selectedBookingForQuotation.id,
          amount: selectedBookingForQuotation.totalAmount,
          description: quotationDescription,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        toast.success("Quotation created successfully!");
        setIsQuotationModalOpen(false);
        fetchAcceptedTours();
        setQuotationDescription("Quotation being in Process...");
      }
    } catch (error) {
      console.error("Error creating quotation:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again");
        navigate("/login");
      } else {
        toast.error(
          "Failed to create quotation: " + 
          (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  // Fetch accepted tours
  const fetchAcceptedTours = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/bookings/BookingForTourAccepted", // Điều chỉnh endpoint theo API của bạn
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAcceptedTours(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch accepted tours");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedTours();
  }, []);

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
      title: "Total Amount - not contain VAT",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (amount) => (
        <span className="font-semibold text-green-600">
          {formatVND(amount)}
        </span>
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

          {record.paymentStatus.toLowerCase() === "pending" && (
            <Button 
              onClick={() => handleCreateQuotation(record)}
              className="italic"
              disabled={createdQuotations.has(record.id)}
              style={{
                opacity: createdQuotations.has(record.id) ? 0.5 : 1,
                cursor: createdQuotations.has(record.id) ? 'not-allowed' : 'pointer'
              }}
            >
              {createdQuotations.has(record.id) ? 'Quotation Created' : 'Create Quotation'}
            </Button>
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

  // Add this function to handle the accept action
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
        const sortedBookings = [...response.data].sort((a, b) => b.id - a.id);
        setAcceptedTours(sortedBookings);
      }

      if (response.status === 200) {
        toast.success("Booking accepted successfully!");
        // Refresh the booking list
        bookingListResponse();
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.error("Failed to accept booking: " + (error.response?.data?.message || error.message));
    }
  };

  // Reset createdQuotations khi component unmount hoặc khi cần thiết
  useEffect(() => {
    return () => {
      setCreatedQuotations(new Set());
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-40 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
        >
          <ArrowLeftOutlined />
          <span className="text-sm font-medium">Back</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Accepted Tours</h1>
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
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredBookings}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </div>
      </div>
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
              selectedBooking.paymentStatus.toLowerCase() === "pending" && 
              !createdQuotations.has(selectedBooking.id) && (
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
                    <Select
                      value={editedBooking?.vat || "0"}
                      onChange={(value) => handleFieldChange("vat", value)}
                      className="w-24 ml-2"
                      options={vatOptions}
                      disabled={selectedBooking.paymentStatus.toLowerCase() !== "pending"}
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
                      placeholder="≥ 0"
                      prefix="VND"
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
                      <span className={`text-lg ${getPaymentMethodInfo(selectedBooking.paymentMethod).color}`}>
                        {getPaymentMethodInfo(selectedBooking.paymentMethod).icon}
                      </span>
                      <span className="font-semibold">
                        {getPaymentMethodInfo(selectedBooking.paymentMethod).label}
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

      {/* Add Quotation Modal */}
      <Modal
        title="Create New Quotation"
        open={isQuotationModalOpen}
        onCancel={() => setIsQuotationModalOpen(false)}
        footer={null}
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Booking ID:
            </label>
            <Input
              value={selectedBookingForQuotation?.id || ""}
              disabled
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Amount:
            </label>
            <Input
              value={selectedBookingForQuotation?.totalAmount || ""}
              disabled
              prefix="$"
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Description:
            </label>
            <Input.TextArea
              value={quotationDescription}
              onChange={(e) => setQuotationDescription(e.target.value)}
              rows={3}
              placeholder="Enter description"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsQuotationModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleQuotationSubmit}
              className="bg-blue-500"
            >
              Create Quotation
            </Button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default AcceptedTourList; 