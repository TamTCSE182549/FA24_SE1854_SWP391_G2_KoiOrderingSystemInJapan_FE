import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Card, Typography, Button, Input, DatePicker, Divider, Descriptions, Tag, Switch } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, DollarOutlined, CalendarOutlined, HomeOutlined, PercentageOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useCookies } from "react-cookie";
const { Title, Text } = Typography;

const ViewDetailDeposit = () => {
  const { bookingId } = useParams();
  const [deposit, setDeposit] = useState(null);
  const [BookingDetails, setBookingDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const [cookies] = useCookies();
  const token = cookies.token;
  // State for editable fields
  const [editableDeposit, setEditableDeposit] = useState({
    shippingFee: '',
    deliveryExpectedDate: '',
    shippingAddress: '',
    depositPercentage: '',
    depositStatus: 'processing'
  });

  // Tách fetchDepositData ra để tái sử dụng
  const fetchDepositData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/deposit/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Kiểm tra nếu response.data là object
      if (response.data && typeof response.data === 'object') {
        // Nếu response.data là object trực tiếp
        const depositData = Array.isArray(response.data) ? response.data[0] : response.data;
        setDeposit(depositData);
        setEditableDeposit({
          shippingFee: depositData.shippingFee || 0,
          deliveryExpectedDate: depositData.deliveryExpectedDate || null,
          shippingAddress: depositData.shippingAddress || '',
          depositPercentage: depositData.depositPercentage ? Math.round(depositData.depositPercentage * 100) : 0,
          depositStatus: depositData.depositStatus || 'processing'
        });
      } else {
        console.error("Invalid deposit data format:", response.data);
        toast.error("Error loading deposit data");
      }
    } catch (error) {
      console.error("Error fetching deposit data:", error);
      toast.error("Failed to fetch deposit data");
    }
  };

  useEffect(() => {
    fetchDepositData();
    fetchBookingData();
  }, [bookingId, token]);

  const fetchBookingData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/bookings/ViewDetail/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookingDetails(response.data);
    } catch (error) {
      console.error("Error fetching booking data:", error);
      toast.error("Failed to fetch booking data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableDeposit({ ...editableDeposit, [name]: value });
  };

  const handleUpdate = async () => {
    if (!deposit) return;

    try {
      const updateData = {
        ...editableDeposit,
        depositPercentage: parseFloat(editableDeposit.depositPercentage) / 100,
        depositStatus: editableDeposit.depositStatus
      };

      await axios.put(`http://localhost:8080/deposit/${deposit.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success("Deposit updated successfully!");
      await fetchDepositData();
    } catch (error) {
      console.error("Error updating deposit:", error);
      toast.error(error.response?.data?.message || "Failed to update deposit");
    }
  };

  // Validation cho ngày
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  if (!deposit || !BookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-40">
      <ToastContainer />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/staff/booking-for-koi-list')}
          className="mb-4"
        >
          Back to List
        </Button>
        <Title level={2}>Deposit Details</Title>
        <Text type="secondary" className="text-lg">
          Booking #{bookingId}
        </Text>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposit Information Card */}
        <Card className="col-span-2 shadow-md rounded-lg">
          <Title level={4} className="mb-6">Deposit Information</Title>
          
          <Descriptions bordered column={1} className="mb-6">
            <Descriptions.Item label="Deposit Amount">
              <Tag color="green" className="text-lg px-3 py-1">
                {deposit?.depositAmount?.toLocaleString()} VND
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Remain Amount">
              <Tag color="orange" className="text-lg px-3 py-1">
                {deposit?.remainAmount?.toLocaleString()} VND
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Deposit Date">
              {deposit?.depositDate}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <div className="space-y-4">
            <div>
              <Text strong className="mb-2 block">Shipping Fee</Text>
              <Input
                prefix={<span className="text-gray-400">VND</span>}
                name="shippingFee"
                value={editableDeposit.shippingFee}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <Text strong className="mb-2 block">Expected Delivery Date</Text>
              <DatePicker
                name="deliveryExpectedDate"
                value={editableDeposit.deliveryExpectedDate ? dayjs(editableDeposit.deliveryExpectedDate) : null}
                onChange={(date, dateString) => handleInputChange({
                  target: { name: 'deliveryExpectedDate', value: dateString }
                })}
                disabledDate={disabledDate}
                className="w-full"
                format="YYYY-MM-DD"
              />
            </div>

            <div>
              <Text strong className="mb-2 block">Shipping Address</Text>
              <Input.TextArea
                name="shippingAddress"
                value={editableDeposit.shippingAddress}
                onChange={handleInputChange}
                rows={4}
                className="w-full"
              />
            </div>

            <div>
              <Text strong className="mb-2 block">Deposit Percentage</Text>
              <Input
                suffix="%"
                type="number"
                name="depositPercentage"
                value={editableDeposit.depositPercentage}
                onChange={handleInputChange}
                className="w-full"
                min={1}
                max={100}
                step={1} // Chỉ cho phép nhập số nguyên
                placeholder="Enter whole number (1-100)"
              />
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <Text strong>Mark as Complete</Text>
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={editableDeposit.depositStatus === 'complete'}
                            onChange={(checked) => {
                                setEditableDeposit(prev => ({
                                    ...prev,
                                    depositStatus: checked ? 'complete' : 'processing'
                                }));
                            }}
                            className={`${
                                editableDeposit.depositStatus === 'complete' ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                        />
                        <Tag color={editableDeposit.depositStatus === 'complete' ? 'success' : 'default'}>
                            {editableDeposit.depositStatus}
                        </Tag>
                    </div>
                </div>
                <Text type="secondary" className="mt-2 block text-sm">
                    Toggle this switch to mark the deposit as complete
                </Text>
            </div>

            <Button 
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleUpdate}
              size="large"
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Update Deposit
            </Button>
          </div>
        </Card>

        {/* Booking Information Card */}
        <Card className="shadow-md rounded-lg">
          <Title level={4} className="mb-6">Booking Information</Title>
          
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Customer Name">
              {BookingDetails?.nameCus}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              {BookingDetails?.totalAmount?.toLocaleString()} VND
            </Descriptions.Item>
            <Descriptions.Item label="VAT">
              {BookingDetails?.vat}%
            </Descriptions.Item>
            <Descriptions.Item label="VAT Amount">
              {BookingDetails?.vatAmount?.toLocaleString()} VND
            </Descriptions.Item>
            <Descriptions.Item label="Discount">
              {BookingDetails?.discountAmount?.toLocaleString()} VND
            </Descriptions.Item>
            <Descriptions.Item label="Total with VAT">
              <Text strong className="text-lg">
                {BookingDetails?.totalAmountWithVAT?.toLocaleString()} VND
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Tag color={BookingDetails?.paymentStatus === 'PAID' ? 'green' : 'orange'}>
                {BookingDetails?.paymentStatus}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Title level={5} className="mb-4">Koi Details</Title>
          {BookingDetails?.koiDetails.map((koi) => (
            <Card key={koi.id} size="small" className="mb-2">
              <Descriptions size="small" column={1}>
              <Descriptions.Item label="Farm Name">{koi.farmName}</Descriptions.Item>
                <Descriptions.Item label="Koi Name">{koi.koiName}</Descriptions.Item>
                <Descriptions.Item label="Koi Origin">{koi.origin}</Descriptions.Item>
                <Descriptions.Item label="Quantity">{koi.quantity}</Descriptions.Item>
                <Descriptions.Item label="Unit Price">{koi.unitPrice?.toLocaleString()} VND</Descriptions.Item>
                <Descriptions.Item label="Total">{koi.totalAmount?.toLocaleString()} VND</Descriptions.Item>
              </Descriptions>
            </Card>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default ViewDetailDeposit;

