import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Input, Card, Empty, Spin, Modal } from 'antd';
import { SearchOutlined, EyeOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';

const BookingForKoiList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [cookies] = useCookies();
  const token = cookies.token;
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

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
      width: '15%',
      render: (id) => (
        <div className="flex items-center">
          <span className="text-lg font-semibold text-blue-600">#{id}</span>
        </div>
      ),
    },
    {
      title: 'Booking Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      width: '20%',
      render: (date) => (
        <div className="font-medium text-gray-700">
          {new Date(date).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      title: 'Total Amount',
      key: 'totalAmount',
      width: '25%',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="text-lg font-semibold text-emerald-600">
            {record.totalAmountWithVAT.toLocaleString('vi-VN')} VND
          </div>
          <div className="text-xs text-gray-500">
            VAT: {(record.vat * 100)}%
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: '20%',
      render: (_, record) => (
        <div className="space-y-2">
          <Tag 
            className="w-full text-center py-1"
            color={
              record.paymentStatus === 'complete' ? 'success' :
              record.paymentStatus === 'pending' ? 'warning' :
              record.paymentStatus === 'processing' ? 'processing' :
              record.paymentStatus === 'shipping' ? 'purple' :
              record.paymentStatus === 'cancelled' ? 'error' :
              'default'
            }
          >
            {record.paymentStatus.toUpperCase()}
          </Tag>
          <div className="text-xs text-gray-500 text-center">
            {record.paymentMethod}
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_, record) => (
        <div>
          {record.paymentStatus.toLowerCase() === 'shipping' && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/customer/viewdelivery/${record.id}`);
              }}
              className="w-full border-purple-500 text-purple-500 hover:bg-purple-50"
            >
              Track Delivery
            </Button>
          )}
        </div>
      ),
    },
  ];

  const filteredBookings = bookings.filter(booking => 
    booking.id.toString().includes(searchText) ||
    booking.paymentStatus.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleViewDetail = async (bookingId) => {
    try {
        setLoadingDetail(true);
        const response = await axios.get(
            `http://localhost:8080/bookings/ViewDetail/${bookingId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        setBookingDetail(response.data);
        setIsModalVisible(true);
    } catch (error) {
        toast.error("Failed to fetch booking details");
    } finally {
        setLoadingDetail(false);
    }
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ToastContainer />
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track your Koi fish orders</p>
        </div>

        {/* Stats Cards - Thay đổi layout và style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl border-none">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <ClockCircleOutlined className="text-2xl text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-800">
                  {bookings.filter(b => !['complete', 'cancelled'].includes(b.paymentStatus.toLowerCase())).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl border-none">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CalendarOutlined className="text-2xl text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
              </div>
            </div>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl border-none">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <SearchOutlined className="text-2xl text-purple-600" />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Search bookings..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="w-full rounded-lg border-gray-200"
                  size="large"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Table Section - Cải thiện style */}
        <Card className="shadow-xl rounded-xl overflow-hidden border-none bg-white">
          <Spin spinning={loading}>
            {bookings.length > 0 ? (
              <Table
                columns={columns}
                dataSource={bookings.filter(booking =>
                  booking.id.toString().includes(searchText) ||
                  booking.paymentStatus.toLowerCase().includes(searchText.toLowerCase())
                )}
                rowKey="id"
                pagination={{
                  pageSize: 7,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} bookings`,
                  className: "px-4"
                }}
                className="custom-table"
                rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
                onRow={(record) => ({
                  onClick: () => handleViewDetail(record.id),
                })}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
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

        <Modal
          title={
            <div className="flex items-center gap-3 px-2 py-1">
              <span className="text-xl font-bold text-gray-800">Booking Details</span>
              <Tag className="mt-1" color="blue">#{bookingDetail?.id}</Tag>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button 
              key="close" 
              onClick={() => setIsModalVisible(false)}
              className="px-8"
            >
              Close
            </Button>
          ]}
          width={800}
          className="custom-modal"
        >
          <Spin spinning={loadingDetail}>
            {bookingDetail && (
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">{bookingDetail.nameCus}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Booking Date</p>
                      <p className="font-medium">
                        {new Date(bookingDetail.bookingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Koi Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Koi Details</h3>
                  <div className="space-y-4">
                    {bookingDetail.koiDetails.map((koi, index) => (
                      <div key={koi.bookingKoiDetailId} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500">Koi Name</p>
                            <p className="font-medium">{koi.koiName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Origin</p>
                            <p className="font-medium">{koi.origin}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Color</p>
                            <p className="font-medium">{koi.color}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Unit Price</p>
                            <p className="font-medium">{koi.unitPrice.toLocaleString('vi-VN')} VND</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Quantity</p>
                            <p className="font-medium">{koi.quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total Amount</p>
                            <p className="font-medium text-blue-600">{koi.totalAmount.toLocaleString('vi-VN')} VND</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Payment Method</p>
                      <Tag color="blue">{bookingDetail.paymentMethod}</Tag>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment Status</p>
                      <Tag color={getStatusColor(bookingDetail.paymentStatus)}>
                        {bookingDetail.paymentStatus.toUpperCase()}
                      </Tag>
                    </div>
                    <div>
                      <p className="text-gray-500">Subtotal</p>
                      <p className="font-medium">{bookingDetail.totalAmount.toLocaleString('vi-VN')} VND</p>
                    </div>
                    <div>
                      <p className="text-gray-500">VAT Amount</p>
                      <p className="font-medium">{bookingDetail.vatAmount.toLocaleString('vi-VN')} VND</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Discount</p>
                      <p className="font-medium text-red-500">-{bookingDetail.discountAmount.toLocaleString('vi-VN')} VND</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Amount</p>
                      <p className="font-medium text-emerald-600">{bookingDetail.totalAmountWithVAT.toLocaleString('vi-VN')} VND</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Spin>
        </Modal>
      </div>
    </div>
  );
};

export default BookingForKoiList;
