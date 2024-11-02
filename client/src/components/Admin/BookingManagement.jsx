import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Tag, Select } from "antd";

const { Option } = Select;

const BookingManagement = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [bookings, setBookings] = useState([]);
  const [bookingType, setBookingType] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const navigate = useNavigate();

  const fetchBookings = () => {
    let url = "http://localhost:8080/bookings";

    if (bookingType === "All" && paymentStatus === "All") {
      url += "/AllBooking";
    } else if (bookingType === "All") {
      url += `/AllBookingStatus/${paymentStatus}`;
    } else if (paymentStatus === "All") {
      url += `/${bookingType}`;
    } else {
      url += `/${bookingType}Status/${paymentStatus}`;
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu bookings:", error));
  };

  // Gọi API khi thay đổi bookingType hoặc paymentStatus
  useEffect(() => {
    fetchBookings();
  }, [bookingType, paymentStatus]);

  // Handle delete action
  const handleDelete = (booking) => {
    console.log("Deleting booking:", booking);
  };

  // Handle update action
  const handleUpdate = (booking) => {
    console.log("Updating booking:", booking);
  };

  const handleCreateBookingKoi = (bookingId) => {
    navigate(`/booking-koi/${bookingId}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      className: "font-medium",
    },
    {
      title: "Customer",
      dataIndex: "nameCus",
      key: "nameCus",
      className: "font-medium",
      render: (text) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            {text.charAt(0).toUpperCase()}
          </div>
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmountWithVAT",
      key: "totalAmountWithVAT",
      className: "font-medium",
      render: (amount) => (
        <span className="text-emerald-600 font-semibold">
          ${Number(amount).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "bookingType",
      key: "bookingType",
      render: (type) => (
        <span className={`px-3 py-1 rounded-full text-sm ${
          type === "BookingForTour" 
            ? "bg-blue-100 text-blue-700"
            : "bg-purple-100 text-purple-700"
        }`}>
          {type === "BookingForTour" ? "Tour" : "Koi"}
        </span>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => {
        const paymentIcons = {
          "Credit Card": {
            icon: "💳",
            class: "bg-blue-50 text-blue-600",
          },
          "PayPal": {
            icon: "🅿️",
            class: "bg-indigo-50 text-indigo-600",
          },
          "Bank Transfer": {
            icon: "🏦",
            class: "bg-green-50 text-green-600",
          },
          "Cash": {
            icon: "💵",
            class: "bg-yellow-50 text-yellow-600",
          },
          "Momo": {
            icon: "📱",
            class: "bg-pink-50 text-pink-600",
          },
          "VNPay": {
            icon: "🏧",
            class: "bg-red-50 text-red-600",
          },
        };

        const paymentConfig = paymentIcons[method] || {
          icon: "💰",
          class: "bg-gray-50 text-gray-600",
        };

        return (
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-lg ${paymentConfig.class} flex items-center justify-center text-sm`}>
              {paymentConfig.icon}
            </span>
            <span className={`font-medium ${paymentConfig.class.split(' ')[1]}`}>
              {method}
            </span>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        const statusConfig = {
          complete: { color: "bg-green-100 text-green-700", icon: "✓" },
          pending: { color: "bg-orange-100 text-orange-700", icon: "⌛" },
          processing: { color: "bg-blue-100 text-blue-700", icon: "↻" },
          delivery: { color: "bg-cyan-100 text-cyan-700", icon: "🚚" },
          cancelled: { color: "bg-red-100 text-red-700", icon: "✕" },
        };
        const config = statusConfig[status] || { color: "bg-gray-100 text-gray-700", icon: "?" };
        
        return (
          <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit ${config.color}`}>
            <span>{config.icon}</span>
            {status}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdate(record)}
            className="p-2 hover:bg-blue-50 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(record)}
            className="p-2 hover:bg-red-50 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          {record.bookingType === "BookingForTour" && record.role === 'CONSULTING_STAFF' && (
            <button
              onClick={() => handleCreateBookingKoi(record.id)}
              className="p-2 hover:bg-green-50 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
            <p className="text-gray-500 mt-1">Manage and monitor all bookings</p>
          </div>
          
          <div className="flex gap-4">
            <Select
              defaultValue="All"
              onChange={(value) => {
                setBookingType(value);
                fetchBookings();
              }}
              className="min-w-[150px]"
              dropdownStyle={{ borderRadius: '0.5rem' }}
            >
              <Option value="All">All Types</Option>
              <Option value="BookingForTour">Tour Bookings</Option>
              <Option value="BookingForKoi">Koi Bookings</Option>
            </Select>
            
            <Select
              defaultValue="All"
              onChange={(value) => {
                setPaymentStatus(value);
                fetchBookings();
              }}
              className="min-w-[150px]"
              dropdownStyle={{ borderRadius: '0.5rem' }}
            >
              <Option value="All">All Statuses</Option>
              <Option value="pending">Pending</Option>
              <Option value="processing">Processing</Option>
              <Option value="delivery">Delivery</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="complete">Complete</Option>
              <Option value="shipped">Shipped</Option>
            </Select>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          pagination={{
            pageSize: 10,
            className: "pt-4",
            showTotal: (total) => `Total ${total} bookings`,
          }}
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default BookingManagement;
