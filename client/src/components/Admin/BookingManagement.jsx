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
      className: "text-gray-700 font-semibold",
    },
    {
      title: "Customer Name",
      dataIndex: "nameCus",
      key: "nameCus",
      className: "text-gray-700 font-semibold",
    },
    {
      title: "Total Amount with VAT",
      dataIndex: "totalAmountWithVAT",
      key: "totalAmountWithVAT",
      className: "text-gray-700 font-semibold",
    },
    {
      title: "Booking Type",
      dataIndex: "bookingType",
      key: "bookingType",
      className: "text-gray-700 font-semibold",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      className: "text-gray-700 font-semibold",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      className: "text-gray-700 font-semibold",
      render: (status) => {
        let color;
        switch (status) {
          case "complete":
            color = "green";
            break;
          case "pending":
            color = "orange";
            break;
          case "processing":
            color = "blue";
            break;
          case "delivery":
            color = "cyan";
            break;
          case "cancelled":
            color = "red";
            break;
          default:
            color = "purple";
            break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      className: "text-gray-700 font-semibold",
    },
    // {
    //   title: "Created By",
    //   dataIndex: "createdBy",
    //   key: "createdBy",
    //   className: "text-gray-700 font-semibold",
    // },
    // {
    //   title: "Created Date",
    //   dataIndex: "createdDate",
    //   key: "createdDate",
    //   className: "text-gray-700 font-semibold",
    // },
    // {
    //   title: "Updated By",
    //   dataIndex: "updatedBy",
    //   key: "updatedBy",
    //   className: "text-gray-700 font-semibold",
    // },
    // {
    //   title: "Updated Date",
    //   dataIndex: "updatedDate",
    //   key: "updatedDate",
    //   className: "text-gray-700 font-semibold",
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small" direction="vertical" className="w-full">
          <Button
            onClick={() => handleUpdate(record)}
            className="bg-blue-500 hover:bg-blue-600 text-white w-full"
          >
            Update
          </Button>
          <Button
            onClick={() => handleDelete(record)}
            className="bg-red-500 hover:bg-red-600 text-white w-full"
          >
            Delete
          </Button>
          {record.bookingType === "BookingForTour" && record.role === 'CONSULTING_STAFF' && ( // Điều kiện kiểm tra bookingType
            <Button
              onClick={() => handleCreateBookingKoi(record.id)}
              className="bg-green-500 hover:bg-green-600 text-white w-full"
            >
              Create Booking Koi
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold mb-4">Booking Table</h2>
        <div className="flex gap-4">
          <Select
            defaultValue="All"
            onChange={(value) => {
              setBookingType(value);
              fetchBookings();
            }}
            className="w-40"
          >
            <Option value="All">All</Option>
            <Option value="BookingForTour">Booking Tour</Option>
            <Option value="BookingForKoi">Booking Koi</Option>
          </Select>
          <Select
            defaultValue="All"
            onChange={(value) => {
              setPaymentStatus(value);
              fetchBookings();
            }}
            className="w-40"
          >
            <Option value="All">All</Option>
            <Option value="pending">pending</Option>
            <Option value="processing">processing</Option>
            <Option value="delivery">delivery</Option>
            <Option value="cancelled">cancelled</Option>
            <Option value="complete">complete</Option>
            <Option value="shipped">shipped</Option>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
};

export default BookingManagement;
