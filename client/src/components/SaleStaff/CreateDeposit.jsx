import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, DatePicker, Button, Card, Typography, Modal, Select } from 'antd';
import { ArrowLeftOutlined, DollarOutlined, EnvironmentOutlined, CalendarOutlined, PercentageOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const CreateDeposit = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [cookies] = useCookies();
  const token = cookies.token;

  // Thêm state để lưu trữ previous location
  const [previousLocation] = useState(document.referrer);

  // Thêm hàm kiểm tra form có thay đổi
  const hasFormChanges = () => {
    const values = form.getFieldsValue();
    return Object.keys(values).some(key => values[key] !== undefined && values[key] !== '');
  };

  const handleSubmit = async (values) => {
    try {
      const formData = {
        shippingFee: parseFloat(values.shippingFee),
        deliveryExpectedDate: values.deliveryExpectedDate.format('YYYY-MM-DD'),
        shippingAddress: values.shippingAddress,
        depositPercentage: parseFloat(values.depositPercentage) / 100, // Chuyển đổi % thành decimal
        depositDate: values.depositDate.format('YYYY-MM-DD'), // Thêm deposit date
        paymentMethod: values.paymentMethod, // Thêm payment method
        depositStatus: "processing" // Thêm trạng thái mặc định
      };

      await axios.post(
        `http://localhost:8080/deposit/${bookingId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Deposit created successfully!");
      navigate(`/view-detail-deposit/${bookingId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create deposit");
    }
  };

  // Sửa lại hàm validate cho depositDate
  const disabledDepositDate = (current) => {
    // Cho phép chọn ngày trong quá khứ và tương lai, nhưng không quá 30 ngày trước
    const thirtyDaysAgo = dayjs().subtract(30, 'days');
    const thirtyDaysAhead = dayjs().add(30, 'days'); // Thêm giới hạn 30 ngày tương lai
    return current < thirtyDaysAgo || current > thirtyDaysAhead;
  };

  // Giữ nguyên hàm validate cho deliveryExpectedDate
  const disabledDeliveryDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  // Sửa lại hàm xử lý click Back
  const handleBack = () => {
    if (hasFormChanges()) {
      Modal.confirm({
        title: 'Leave page?',
        content: 'Are you sure you want to leave? Your changes will be lost.',
        okText: 'Leave',
        cancelText: 'Stay',
        onOk: () => {
          // Nếu đến từ trang booking detail
          if (previousLocation.includes('/booking-detail')) {
            navigate('/staff/booking-for-koi-list');
          } else {
            navigate(-1);
          }
        },
        okButtonProps: {
          className: 'bg-red-500 hover:bg-red-600',
        },
        centered: true,
      });
    } else {
      // Nếu form chưa có thay đổi, back trực tiếp
      if (previousLocation.includes('/booking-detail')) {
        navigate('/booking-koi-list');
      } else {
        navigate(-1);
      }
    }
  };

  // Thêm xử lý khi user refresh hoặc đóng tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasFormChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ToastContainer />
        
        {/* Header Section */}
        <div className="mb-8">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            className="mb-4 hover:bg-gray-100"
            type="text"
          >
            Back to List
          </Button>
          <Title level={2} className="mb-2">Create Deposit</Title>
          <Text type="secondary" className="text-lg">
            Creating deposit for Booking #{bookingId}
          </Text>
        </div>

        {/* Main Form Card */}
        <Card 
          className="shadow-md rounded-lg"
          bodyStyle={{ padding: '24px' }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            className="space-y-6"
          >
            <Form.Item
              label={<span className="text-gray-700 font-medium">Shipping Fee</span>}
              name="shippingFee"
              rules={[
                { required: true, message: 'Please enter shipping fee' },
                { 
                  validator: async (_, value) => {
                    const num = Number(value);
                    if (isNaN(num)) {
                      throw new Error('Please enter a valid number');
                    }
                    if (num <= 0) {
                      throw new Error('Shipping fee must be positive');
                    }
                  }
                }
              ]}
              tooltip="Shipping fee must be positive"
            >
              <Input 
                prefix={<span className="text-gray-400">VND</span>}
                type="number"
                placeholder="Enter shipping fee"
                className="h-11 rounded-lg"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Expected Delivery Date</span>}
              name="deliveryExpectedDate"
              rules={[
                { required: true, message: 'Please select delivery date' },
              ]}
              tooltip="Delivery date must be in the future"
            >
              <DatePicker 
                className="w-full h-11 rounded-lg"
                disabledDate={disabledDeliveryDate}  // Sử dụng hàm validate cho ngày giao hàng
                placeholder="Select delivery date"
                size="large"
                suffixIcon={<CalendarOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Shipping Address</span>}
              name="shippingAddress"
              rules={[
                { required: true, message: 'Please enter shipping address' },
                { min: 5, message: 'Address must be at least 5 characters' },
              ]}
            >
              <Input.TextArea 
                prefix={<EnvironmentOutlined className="text-gray-400" />}
                placeholder="Enter complete shipping address"
                className="rounded-lg"
                rows={4}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Deposit Percentage</span>}
              name="depositPercentage"
              rules={[
                { required: true, message: 'Please enter deposit percentage' },
                { 
                  validator: async (_, value) => {
                    const num = Number(value);
                    if (isNaN(num)) {
                      throw new Error('Please enter a valid number');
                    }
                    if (!Number.isInteger(num)) {
                      throw new Error('Please enter a whole number');
                    }
                    if (num < 1 || num > 100) {
                      throw new Error('Percentage must be between 1 and 100');
                    }
                  }
                }
              ]}
              tooltip="Enter a whole number between 1-100"
            >
              <Input 
                suffix="%" 
                type="number"
                placeholder="Enter deposit percentage (1-100)"
                className="h-11 rounded-lg"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Deposit Date</span>}
              name="depositDate"
              rules={[
                { required: true, message: 'Please select deposit date' },
              ]}
              tooltip="Select deposit date (within 30 days before or after today)"
            >
              <DatePicker 
                className="w-full h-11 rounded-lg"
                disabledDate={disabledDepositDate}
                placeholder="Select deposit date"
                size="large"
                suffixIcon={<CalendarOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Payment Method</span>}
              name="paymentMethod"
              rules={[
                { required: true, message: 'Please select payment method' },
              ]}
            >
              <Select
                size="large"
                className="w-full h-11 rounded-lg"
                placeholder="Select payment method"
              >
                <Select.Option value="CASH">Cash</Select.Option>
                <Select.Option value="VISA">Visa</Select.Option>
                <Select.Option value="TRANSFER">Transfer</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item className="mb-0 pt-4">
              <Button 
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full bg-blue-500 hover:bg-blue-600 border-none h-12 text-lg font-medium rounded-lg"
              >
                Create Deposit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateDeposit;
