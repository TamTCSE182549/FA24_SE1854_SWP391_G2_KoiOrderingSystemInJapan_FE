import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Button, Input, Card, Statistic, Space, Modal } from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  EyeOutlined,
  CarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";

const BookingForKoiList = () => {
  const [bookings, setBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies();
  const token = cookies.token;
  const navigate = useNavigate();
  const [depositsInfo, setDepositsInfo] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/bookings/koi/list/staff`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedBookings = response.data.sort((a, b) => b.id - a.id);
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to fetch bookings");
        setErrorMessage("Failed to fetch bookings");
      }
    };

    fetchBookings();
  }, [token]);

  
  useEffect(() => {
    const fetchDepositsInfo = async () => {
      try {
        const depositsData = {};
        
        for (const booking of bookings) {
          try {
            const response = await axios.get(`http://localhost:8080/deposit/${booking.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            console.log(`Deposit data for booking ${booking.id}:`, response.data);
            
            if (response.data) {
              depositsData[booking.id] = response.data;
            } else {
              depositsData[booking.id] = null;
            }
          } catch (error) {
            console.log(`No deposit found for booking ${booking.id}`);
            depositsData[booking.id] = null;
          }
        }
        
        console.log('Final deposits data:', depositsData);
        setDepositsInfo(depositsData);
      } catch (error) {
        console.error("Error fetching deposits info:", error);
      }
    };

    if (bookings.length > 0) {
      fetchDepositsInfo();
    }
  }, [bookings, token]);


  const handleViewDetail = (bookingId) => {
    navigate("/booking-detail", { state: { bookingId } });
  };

  const handleCreateDeposit = (bookingId) => {
    navigate(`/create-deposit/${bookingId}`);
  };

  const handleNavigateToDelivery = (bookingId) => {
    navigate(`/delivery/${bookingId}`);
  };

  const handleDelete = async (bookingId) => {
    Modal.confirm({
      title: 'Are you sure you want to cancel this booking?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Cancel it',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          await axios.put(`http://localhost:8080/bookings/delete/koi/${bookingId}`, null, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          setBookings(prevBookings => 
            prevBookings.map(booking => 
              booking.id === bookingId 
                ? { ...booking, paymentStatus: 'cancelled' }
                : booking
            )
          );
          
          toast.success('Booking cancelled successfully');
        } catch (error) {
          console.error('Error cancelling booking:', error);
          toast.error('Failed to cancel booking');
        }
      },
    });
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <span style={{ fontWeight: 500, fontSize: "1rem" }}>#{id}</span>
      ),
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => (
        <span style={{ fontSize: "1rem" }}>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      ),
    },
    {
      title: "Customer",
      dataIndex: "nameCus",
      key: "nameCus",
      render: (name) => <span style={{ fontSize: "1rem" }}>{name}</span>,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmountWithVAT",
      key: "totalAmountWithVAT",
      render: (amount) => (
        <span style={{ color: "#059669", fontWeight: 500, fontSize: "1rem" }}>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(amount)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => {
        return (
          <Tag
            color={
              status === "complete"
                ? "green"
                : status === "pending"
                ? "gold"
                : status === "processing"
                ? "blue"
                : status === "cancelled"
                ? "red"
                : status === "shipping"
                ? "pink"
                : "default"
            }
            style={{ fontSize: "0.9rem", padding: "4px 12px" }}
          >
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Deposit Status',
      key: 'depositStatus',
      render: (_, record) => {
        if (record.paymentStatus === 'cancelled') {
          return (
            <Tag color="default" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
              CANCELLED
            </Tag>
          );
        }

        if (record.paymentStatus === 'pending') {
          return (
            <Tag color="default" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
              WAITING
            </Tag>
          );
        }

        const hasDeposit = depositsInfo[record.id] !== null;

        if (record.paymentStatus === 'processing' && !hasDeposit) {
          return (
            <Tag color="orange" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
              NO DEPOSIT
            </Tag>
          );
        }

        if (record.paymentStatus === 'processing' && hasDeposit) {
          return (
            <Tag color="blue" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
              PENDING
            </Tag>
          );
        }

        if (record.paymentStatus === 'shipping' || record.paymentStatus === 'complete') {
          return (
            <Tag color="green" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
              APPROVED
            </Tag>
          );
        }
      },
    },
    {
      title: "Confirmed Date",
      dataIndex: "updatedDate",
      key: "updatedDate",
      render: (date, record) => (
        <span style={{ fontSize: "1rem" }}>
          {record.paymentStatus === 'pending' ? (
            'Not confirmed yet'
          ) : (
            new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          )}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          {record.paymentStatus !== 'cancelled' && (
            <Button
              type="default"
              icon={<CarOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateToDelivery(record.id);
              }}
              size="large"
              className="font-medium"
            >
              Delivery
            </Button>
          )}
          
          {(record.paymentStatus === 'pending' || record.paymentStatus === 'processing') && (
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record.id);
              }}
              size="large"
              className="font-medium"
            />
          )}
        </Space>
      ),
    },
  ];

  const customTableStyles = `
    .custom-table {
      background: white;
      border-radius: 8px;
      width: 100%;
    }
    
    .custom-table .ant-table {
      width: 100%;
    }
    
    .custom-table .ant-table-thead > tr > th {
      background: white;
      border-bottom: 1px solid #eee;
      font-weight: 500;
      font-size: 1rem;
      padding: 16px;
      white-space: nowrap;
    }
    
    .custom-table .ant-table-tbody > tr > td {
      border-bottom: 1px solid #f0f0f0;
      padding: 16px;
    }
    
    .custom-table .ant-table-tbody > tr:hover > td {
      background: #f5f5f5;
    }
    
    .ant-btn {
      font-size: 0.95rem;
      height: auto;
      padding: 8px 16px;
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50 pt-40">
      <div className="px-4 py-8 w-full">
        <ToastContainer />

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Koi Booking Management
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage and track all your koi bookings in one place
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-8 w-full">
          <Statistic
            title="Total Bookings"
            value={bookings.length}
            prefix={<FileTextOutlined />}
          />
        </Card>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search bookings..."
            prefix={<SearchOutlined />}
            size="large"
            style={{ maxWidth: 400 }}
          />
        </div>

        {/* Table Section */}
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          bordered
          size="large"
          className="custom-table"
          scroll={{ x: true }}
          onRow={(record) => ({
            onClick: () => handleViewDetail(record.id),
            style: { cursor: 'pointer' }
          })}
        />
      </div>
    </div>
  );
};

export default BookingForKoiList;
