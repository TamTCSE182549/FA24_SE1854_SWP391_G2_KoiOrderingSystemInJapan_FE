import React, { useState, useEffect } from "react";
import { Card, Button, Tag, Space, Select, Row, Col, Pagination, Modal, Form, Input } from "antd";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const { Option } = Select;

const QuotationService = () => {
  const location = useLocation();
  const newQuotationId = location.state?.newQuotationId;
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentForm] = Form.useForm();

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/quotations/all", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setQuotations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error when getting Quotation List:", error);
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [newQuotationId]);

  const filteredQuotations = Array.isArray(quotations) ? quotations.filter(quotation => {
    if (statusFilter !== "ALL" && quotation.isApprove !== statusFilter) return false;
    return true;
  }) : [];

  const paginatedQuotations = filteredQuotations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/quotations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSelectedQuotation(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching quotation details:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedQuotation(null);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toTimeString().split(' ')[0];
    return { formattedDate, formattedTime };
  };

  const handleSendPayment = (quotation) => {
    if (quotation.isApprove === "FINISH") {
      setSelectedQuotation(quotation);
      setIsPaymentModalVisible(true);
    }
  };

  const handlePaymentSubmit = async (values) => {
    try {
      const response = await axios.put(
        "http://localhost:8080/admin/updateResponseFormStaff",  // Updated endpoint
        {
          bookingID: selectedQuotation.bookingId,
          paymentStatus: "processing",  // Using the PaymentStatus enum value
          paymentMethod: values.paymentMethod,
          vat: parseFloat(values.vat) / 100,  // Convert percentage to decimal
          discountAmount: parseFloat(values.discountAmount),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log("Payment updated:", response.data);
      setIsPaymentModalVisible(false);
      paymentForm.resetFields();
      fetchQuotations();
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  return (
    <div className="container mx-auto py-4" style={{ paddingLeft: '100px', paddingRight: '100px', paddingTop: '100px' }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quotations List</h1>
        <Button 
          onClick={() => navigate('/booking-list-for-staff')}
          type="primary"
        >
          Back to Booking List
        </Button>
      </div>

      <Space className="mb-4">
        <Select
          defaultValue="ALL"
          style={{ width: 120 }}
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="ALL">All Status</Option>
          <Option value="PROCESS">In Process</Option>
          <Option value="FINISH">Accept</Option>
          <Option value="REJECTED">Reject</Option>
        </Select>
        <Button type="primary" onClick={fetchQuotations}>
          Reload Quotations
        </Button>
      </Space>

      <Row gutter={[16, 16]}>
        {paginatedQuotations.map((quotation) => (
          <Col key={quotation.id} xs={24} sm={12} md={8}>
            <Card
              title={`Booking ID: ${quotation.bookingId}`}
              extra={
                <Tag color={
                  quotation.isApprove === "PROCESS" ? "blue" :
                  quotation.isApprove === "FINISH" ? "green" : "red"
                }>
                  {quotation.isApprove}
                </Tag>
              }
            >
              <p><strong>Amount:</strong> ${quotation.amount}</p>
              <p><strong>Staff:</strong> {quotation.staffName}</p>
              <Space className="mt-2">
                <Button onClick={() => handleViewDetails(quotation.id)}>
                  View Detail
                </Button>
                {quotation.isApprove === "FINISH" && (
                  <Button 
                    onClick={() => handleSendPayment(quotation)}
                    type="primary"
                  >
                    Send Payment
                  </Button>
                )}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination
        className="mt-4"
        current={currentPage}
        total={filteredQuotations.length}
        pageSize={pageSize}
        onChange={(page) => setCurrentPage(page)}
      />

      <Modal
        title="Quotation Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>
        ]}
      >
        {selectedQuotation && (
          <div>
            <p><strong>Booking ID:</strong> {selectedQuotation.bookingId}</p>
            <p><strong>Amount:</strong> ${selectedQuotation.amount}</p>
            <p><strong>Description:</strong> {selectedQuotation.description}</p>
            <p><strong>Staff Name:</strong> {selectedQuotation.staffName}</p>
            <p><strong>Manager Name:</strong> {selectedQuotation.managerName}</p>
            <p><strong>Status:</strong> {selectedQuotation.isApprove}</p>
            {selectedQuotation.approveTime && (
              <>
                <p><strong>Approve Date:</strong> {formatDateTime(selectedQuotation.approveTime).formattedDate}</p>
                <p><strong>Approve Time:</strong> {formatDateTime(selectedQuotation.approveTime).formattedTime}</p>
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="Send Payment"
        visible={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        footer={null}
      >
        <Form form={paymentForm} onFinish={handlePaymentSubmit} layout="vertical">
          <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true }]}>
            <Select>
              <Option value="CASH">Cash</Option>
              <Option value="CREDIT_CARD">Credit Card</Option>
              <Option value="BANK_TRANSFER">Bank Transfer</Option>
            </Select>
          </Form.Item>
          <Form.Item name="vat" label="VAT (%)" rules={[{ required: true }]}>
            <Input type="number" step="0.01" min="0" max="100" />
          </Form.Item>
          <Form.Item name="discountAmount" label="Discount Amount" rules={[{ required: true }]}>
            <Input type="number" step="0.01" min="0" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send Payment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuotationService;
