import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Tag,
  Button,
  Spin,
  Space,
  Modal,
  Input,
  Select,
  Tooltip,
  Form,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import {
  ArrowLeftOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  CreditCardOutlined,
  BankOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

const formatVND = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
};

const VAT_RATE = "10"; // Define constant for VAT rate

const AcceptedTourList = () => {
  const [acceptedTours, setAcceptedTours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [selectedBookingForQuotation, setSelectedBookingForQuotation] =
    useState(null);
  const [amountError, setAmountError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  // Thêm state để lưu trữ các bookingId đã tạo quotation
  const [createdQuotations, setCreatedQuotations] = useState(new Set());

  // Thêm state userRole
  const [userRole, setUserRole] = useState(null);

  // Thêm useEffect để decode token và lấy role khi component mount
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

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
    if (booking.paymentStatus.toLowerCase() !== "pending") {
      toast.warning("Can only create quotations for pending bookings");
      return;
    }

    // Set selected booking for quotation form
    setSelectedBookingForQuotation(booking);
    
    // Initialize payment form with values from booking
    paymentForm.setFieldsValue({
      amount: booking.totalAmount,
      vat: '10',
      paymentMethod: booking.paymentMethod || 'CASH', // Lấy paymentMethod từ booking
      discountAmount: 0
    });
    
    // Show payment form
    setIsPaymentFormVisible(true);
  };

  const handleCreateBookingKoi = (bookingId) => {
    navigate(`/booking-koi/${bookingId}`);
  };

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

  const [isPaymentFormVisible, setIsPaymentFormVisible] = useState(false);
  const [paymentForm] = Form.useForm();

  const handlePaymentSubmit = async (values) => {
    try {
      // Validate the input values
      const amount = parseFloat(values.amount);
      const vat = Number(values.vat) / 100;
      const discountAmount = parseFloat(values.discountAmount);

      // Step 1: Create quotation first
      const quotationPayload = {
        bookingId: selectedBookingForQuotation.id,
        amount: amount,
        description: 'Quotation created',
        vat: vat,
        paymentMethod: values.paymentMethod
      };

      const quotationResponse = await axios.post(
        "http://localhost:8080/quotations/create",
        quotationPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (quotationResponse.status === 201) {
        // Step 2: After successful quotation creation, update the booking
        const bookingPayload = {
          bookingID: selectedBookingForQuotation.id,
          amount: amount,
          vat: vat,
          paymentMethod: values.paymentMethod,
          paymentStatus: "pending",
          discountAmount: discountAmount,
          quoId: quotationResponse.data.id // Use the quotation ID from the response
        };

        const bookingResponse = await axios.put(
          "http://localhost:8080/bookings/admin/updateResponseCusFormStaff/Customize",
          bookingPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (bookingResponse.status === 200) {
          // Update UI and show success message
          setCreatedQuotations((prev) => new Set([...prev, selectedBookingForQuotation.id]));
          toast.success("Quotation created and booking updated successfully!");
          setIsPaymentFormVisible(false);
          paymentForm.resetFields();
          fetchAcceptedTours(); // Refresh the booking list
        }
      }
    } catch (error) {
      console.error("Error in payment process:", error);
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("Failed to process payment. Please try again.");
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
        "http://localhost:8080/bookings/BookingForTourAccepted",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Sắp xếp danh sách theo ID giảm dần (mới nhất lên đầu)
      const sortedTours = response.data.sort((a, b) => b.id - a.id);
      setAcceptedTours(sortedTours);
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
              ? "blue"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Amount Original",
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
            icon={<EyeOutlined />}
          >
            View Details
          </Button>

          {userRole === "CONSULT_STAFF" && (
            <Button
              type="primary"
              onClick={() => handleCreateBookingKoi(record.id)}
              className="bg-green-500 hover:bg-green-600"
            >
              Create Booking Koi
            </Button>
          )}

          {record.paymentStatus.toLowerCase() === "pending" && (
            <Button
              onClick={() => handleCreateQuotation(record)}
              className="italic"
              disabled={createdQuotations.has(record.id) || record.quotation?.send !== null}
              style={{
                opacity: (createdQuotations.has(record.id) || record.quotation?.send !== null) ? 0.5 : 1,
                cursor: (createdQuotations.has(record.id) || record.quotation?.send !== null) 
                  ? "not-allowed" 
                  : "pointer",
              }}
            >
              {createdQuotations.has(record.id) || record.quotation?.send !== null
                ? "Quotation Created"
                : "Create Quotation"}
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
      toast.error(
        "Failed to accept booking: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Reset createdQuotations khi component unmount hoặc khi cần thiết
  useEffect(() => {
    return () => {
      setCreatedQuotations(new Set());
    };
  }, []);

  // Add payment method options
  const paymentMethodOptions = [
    { value: 'CASH', label: 'Cash' },
    { value: 'TRANSFER', label: 'Transfer' },
    { value: 'VISA', label: 'Visa' }
  ];

  // Payment form modal
  const PaymentFormModal = () => (
    <Modal
      title="Create Quotation"
      visible={isPaymentFormVisible}
      onCancel={() => {
        setIsPaymentFormVisible(false);
        paymentForm.resetFields();
      }}
      footer={null}
      width={700}
    >
      <Form
        form={paymentForm}
        onFinish={handlePaymentSubmit}
        layout="vertical"
      >
        <Form.Item
          name="paymentMethod"
          label="Payment Method"
          rules={[{ required: true, message: 'Please select payment method' }]}
        >
          <Select disabled>
            {paymentMethodOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item 
          name="vat" 
          label="VAT"
          initialValue={VAT_RATE}
        >
          <Input 
            disabled
            value={`${VAT_RATE}%`}
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </Form.Item>
        
        <Form.Item
          name="discountAmount"
          label="Discount Amount"
          tooltip="Enter 0 or minimum 100,000 VND (not exceeding 70% of the amount)"
          rules={[
            { required: true, message: 'Please input discount amount' },
            {
              validator: async (_, value) => {
                const amount = parseFloat(paymentForm.getFieldValue('amount'));
                const discountAmount = parseFloat(value);

                // Kiểm tra nếu giá trị không phải số hoặc âm
                if (isNaN(discountAmount) || discountAmount < 0) {
                  throw new Error('Discount amount cannot be negative');
                }

                // Cho phép giá trị 0
                if (discountAmount === 0) {
                  return Promise.resolve();
                }

                // Nếu không phải 0, phải từ 100,000 VND trở lên
                if (discountAmount < 100000) {
                  throw new Error('Minimum discount amount must be 100,000 VND');
                }

                if (discountAmount > 50000000) {
                  throw new Error('Discount amount cannot exceed 50,000,000 VND');
                }

                if (!amount || isNaN(amount)) {
                  throw new Error('Please enter valid amount first');
                }

                if (discountAmount > amount * 0.7) {
                  throw new Error('Discount amount cannot exceed 70% of the amount');
                }
              }
            }
          ]}
        >
          <Input 
            type="number" 
            min="0"
            step="100000"
            placeholder="Enter 0 or minimum 100,000 VND"
          />
        </Form.Item>
        
        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: 'Please input amount' },
            {
              validator: (_, value) => {
                const amount = parseFloat(value);
                if (isNaN(amount) || amount < 1000000) { // Minimum 1 million VND
                  return Promise.reject('Amount must be at least 1,000,000 VND');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input
            type="number"
            min="1000000"
            step="100000"
            placeholder="Enter amount (VND)"
          />
        </Form.Item>
        
        <Form.Item className="flex justify-end">
          <Space>
            <Button onClick={() => {
              setIsPaymentFormVisible(false);
              paymentForm.resetFields();
            }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create Quotation
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

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
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
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
                      value={`${selectedBooking.vat * 100}%`}
                      className="w-24 ml-2"
                      disabled
                      style={{ backgroundColor: "#f5f5f5" }}
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32 font-medium">
                      Discount:
                    </span>
                    <Input
                      value={formatVND(selectedBooking.discountAmount)}
                      className="w-32 ml-2"
                      disabled
                      style={{ backgroundColor: "#f5f5f5" }}
                      prefix="VND"
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

      <PaymentFormModal />
      <ToastContainer />
    </div>
  );
};

export default AcceptedTourList;
