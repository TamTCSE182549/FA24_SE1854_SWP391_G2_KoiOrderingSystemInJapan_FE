import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Input, Card, Statistic, Space } from 'antd';
import { SearchOutlined, FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';

const BookingForKoiList = () => {
  const [bookings, setBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const token = cookies.token;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/bookings/BookingForKoi`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
  
  const handleViewDetail = (bookingId) => {
    navigate('/booking-detail', { state: { bookingId } });
  };

  const handleCreateDeposit = (bookingId) => {
    navigate(`/create-deposit/${bookingId}`);
  };

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <span style={{ fontWeight: 500, fontSize: '1rem' }}>#{id}</span>,
    },
    {
      title: 'Customer',
      dataIndex: 'nameCus',
      key: 'nameCus',
      render: (name) => <span style={{ fontSize: '1rem' }}>{name}</span>,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmountWithVAT',
      key: 'totalAmountWithVAT',
      render: (amount) => (
        <span style={{ color: '#059669', fontWeight: 500, fontSize: '1rem' }}>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
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
              status === 'complete' ? 'green' :
              status === 'pending' ? 'gold' :
              status === 'processing' ? 'blue' :
              status === 'cancelled' ? 'red' :
              status === 'shipping' ? 'pink' :
              'default'
            }
            style={{ fontSize: '0.9rem', padding: '4px 12px' }}
          >
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Button
          type="default"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.id)}
          size="large"
          className="font-medium"
        >
          View Details
        </Button>
      ),
    },
  ];

  const customTableStyles = `
    .custom-table {
      background: white;
      border-radius: 8px;
    }
    
    .custom-table .ant-table-thead > tr > th {
      background: white;
      border-bottom: 1px solid #eee;
      font-weight: 500;
      font-size: 1rem;
      padding: 16px;
    }
    
    .custom-table .ant-table-tbody > tr > td {
      border-bottom: 1px solid #f0f0f0;
      padding: 16px;
    }
    
    .custom-table .ant-table-tbody > tr:hover > td {
      background: #fafafa;
    }
    
    .ant-btn {
      font-size: 0.95rem;
      height: auto;
      padding: 8px 16px;
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50 pt-40">
      <div className="max-w-full px-6 py-8">
        <ToastContainer />
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Koi Booking Management</h1>
          <p className="mt-2 text-lg text-gray-600">Manage and track all your koi bookings in one place</p>
        </div>

        {/* Stats Card */}
        <Card className="mb-8">
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
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          bordered
          size="large"
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default BookingForKoiList;