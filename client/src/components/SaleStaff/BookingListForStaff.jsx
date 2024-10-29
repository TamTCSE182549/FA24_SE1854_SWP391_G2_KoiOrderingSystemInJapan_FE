import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Table, Modal, Button, Tag, Space } from 'antd';

const BookingListForStaff = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [bookingList, setBookingList] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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
        setBookingList(response.data);
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

  const handleCreateQuotation = (booking) => {
    navigate(`/createQuotation/${booking.id}`, {
      state: { bookingData: booking },
    });
  };

  const handleCreateCheckin = (bookingId) => {
    navigate(`/create-checkin/${bookingId}`);  // Updated path with hyphen
  };
    // Mỗi booking sẽ có nút Create Checkin
    // Nút sẽ bị vô hiệu hóa nếu booking chưa được thanh toán
    // Khi nhấn vào nút, người dùng sẽ được chuyển đến trang CreateCheckin với bookingId tương ứng
    // CreateCheckin component sẽ nhận bookingId từ URL params và sử dụng nó để tạo checkin mới

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer Name',
      dataIndex: 'nameCus',
      key: 'nameCus',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `$${amount}`,
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => (
        <Tag color={
          status === 'PAID' ? 'green' :
          status === 'PENDING' ? 'gold' :
          status === 'PROCESSING' ? 'blue' :  // Changed to blue for processing
          'red'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleViewDetailBooking(record)}>
            View Details
          </Button>
          <Button onClick={() => handleCreateQuotation(record)}>
            Create Quotation
          </Button>
          <Button 
            type="default"
            onClick={() => handleCreateCheckin(record.id)}
            disabled={record.paymentStatus.toLowerCase() !== 'processing'}
          >
            Create Checkin
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6" style={{ marginTop: '100px' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booking List</h1>
        <Space>
          <Button 
            type="primary"
            onClick={() => navigate('/QuotationService')}
            style={{ zIndex: 1000 }}
          >
            View Quotations
          </Button>
          <Button 
            type="primary"
            onClick={() => navigate('/CheckinService')}
            style={{ zIndex: 1000 }}
          >
            View Check-ins
          </Button>
        </Space>
      </div>
      
      <Table 
        columns={columns}
        dataSource={bookingList}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Booking Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedBooking && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Booking ID:</strong> {selectedBooking.id}</p>
              <p><strong>Customer Name:</strong> {selectedBooking.nameCus}</p>
              <p><strong>Customer ID:</strong> {selectedBooking.customerID}</p>
              <p><strong>Created Date:</strong> {formatDateTime(selectedBooking.createdDate)}</p>
              <p><strong>Created By:</strong> {selectedBooking.createdBy}</p>
            </div>
            <div>
              <p><strong>Total Amount:</strong> ${selectedBooking.totalAmount}</p>
              <p><strong>VAT:</strong> {selectedBooking.vat}%</p>
              <p><strong>VAT Amount:</strong> ${selectedBooking.vatAmount}</p>
              <p><strong>Discount Amount:</strong> ${selectedBooking.discountAmount}</p>
              <p><strong>Total Amount with VAT:</strong> ${selectedBooking.totalAmountWithVAT}</p>
              <p><strong>Payment Method:</strong> {selectedBooking.paymentMethod}</p>
              <p><strong>Payment Status:</strong> {selectedBooking.paymentStatus}</p>
            </div>
          </div>
        )}
      </Modal>
      
      <ToastContainer />
    </div>
  );
};

export default BookingListForStaff;
