import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Input, Card, Empty, Spin } from 'antd';
import { SearchOutlined, EyeOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';

const BookingForKoiList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [cookies] = useCookies();
  const token = cookies.token;
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/bookings/koi/list/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data.sort((a, b) => b.id - a.id));
    } catch (error) {
      toast.error("Could not fetch your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      complete: '#10B981',
      pending: '#F59E0B',
      processing: '#3B82F6',
      cancelled: '#EF4444',
      shipping: '#8B5CF6',
    };
    return colors[status.toLowerCase()] || '#6B7280';
  };

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      width: '8%',
      render: (id) => (
        <div className="flex items-center">
          <span className="text-lg font-semibold text-blue-600">#{id}</span>
        </div>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'nameCus',
      key: 'nameCus',
      width: '15%',
      render: (name) => (
        <div className="font-medium text-gray-700">{name}</div>
      ),
    },
    {
      title: 'Payment Details',
      key: 'paymentDetails',
      width: '25%',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal:</span>
            <span className="font-medium">${record.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">VAT ({record.vat * 100}%):</span>
            <span className="font-medium">${record.vatAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Discount:</span>
            <span className="font-medium text-red-500">-${record.discountAmount}</span>
          </div>
          <div className="flex justify-between pt-1 border-t">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold text-emerald-600">${record.totalAmountWithVAT}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Payment Info',
      key: 'paymentInfo',
      width: '15%',
      render: (_, record) => (
        <div className="space-y-2">
          <Tag className="w-full text-center py-1" color="blue">{record.paymentMethod}</Tag>
          <Tag 
            className="w-full text-center py-1"
            color={
              record.paymentStatus === 'complete' ? 'success' :
              record.paymentStatus === 'pending' ? 'warning' :
              record.paymentStatus === 'processing' ? 'processing' :
              'default'
            }
          >
            {record.paymentStatus.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Koi Details',
      key: 'koiDetails',
      width: '22%',
      render: (_, record) => (
        <div className="space-y-2">
          {record.koiDetails && record.koiDetails.length > 0 ? (
            record.koiDetails.map((koi, index) => (
              <div 
                key={koi.id || index}
                className="p-2 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity:</span>
                  <span className="font-medium">{koi.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Unit Price:</span>
                  <span className="font-medium">${koi.unitPrice}</span>
                </div>
                <div className="flex justify-between pt-1 border-t">
                  <span className="font-medium">Total:</span>
                  <span className="font-medium text-blue-600">${koi.totalAmount}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-2">
              No koi details available
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.id)}
          className="w-full bg-blue-500 hover:bg-blue-600 border-none shadow-md"
        >
          View Details
        </Button>
      ),
    },
  ];

  const filteredBookings = bookings.filter(booking => 
    booking.id.toString().includes(searchText) ||
    booking.paymentStatus.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-32 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <ToastContainer />
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Koi Bookings</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track and manage all your koi bookings in one place. View details, check status, and more.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <ClockCircleOutlined className="text-2xl text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500">Active Bookings</p>
                <p className="text-2xl font-semibold">
                  {bookings.filter(b => !['complete', 'cancelled'].includes(b.paymentStatus.toLowerCase())).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CalendarOutlined className="text-2xl text-green-600" />
              </div>
              <div>
                <p className="text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold">{bookings.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <Input
            placeholder="Search bookings..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="w-full max-w-md rounded-lg text-base shadow-sm"
            size="large"
          />
        </div>

        {/* Bookings Table */}
        <Card className="shadow-xl rounded-xl overflow-hidden border-0">
          <Spin spinning={loading}>
            {bookings.length > 0 ? (
              <Table
                columns={columns}
                dataSource={filteredBookings}
                rowKey="id"
                pagination={{
                  pageSize: 5,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} bookings`,
                }}
                className="custom-table"
                rowClassName="hover:bg-gray-50 transition-colors"
              />
            ) : (
              <Empty
                description={
                  <span className="text-gray-500 text-lg">
                    No bookings found
                  </span>
                }
                className="py-12"
              />
            )}
          </Spin>
        </Card>
      </div>
    </div>
  );
};

export default BookingForKoiList;
