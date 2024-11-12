import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Tag,
  Space,
  DatePicker,
  Select,
  Row,
  Col,
  Pagination,
  Modal,
  Form,
  Input,
  message,
  Checkbox,
} from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const { Option } = Select;

const Quotation = () => {
  const location = useLocation();
  const newQuotationId = location.state?.newQuotationId;
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentForm] = Form.useForm();
  const [completedPayments, setCompletedPayments] = useState(new Set());
  const [bookingDetails, setBookingDetails] = useState(null);
  const [allowPaymentMethodChange, setAllowPaymentMethodChange] = useState(false);
  const [originalPaymentMethod, setOriginalPaymentMethod] = useState(null);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/quotations/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedQuotations = Array.isArray(response.data)
        ? [...response.data].sort((a, b) => b.id - a.id) // Sắp xếp ngược theo ID
        : [];
      setQuotations(sortedQuotations);
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

  const handleUpdateStatus = (id) => {
    navigate(`/update-quotation/${id}`);
  };

  // Add a check before filtering
  const filteredQuotations = Array.isArray(quotations)
    ? quotations.filter((quotation) => {
        if (statusFilter !== "ALL" && quotation.isApprove !== statusFilter)
          return false;
        if (
          dateFilter &&
          !quotation.approveTime.startsWith(dateFilter.format("YYYY-MM-DD"))
        )
          return false;
        return true;
      })
    : [];

  const paginatedQuotations = filteredQuotations
    .slice() // Tạo bản sao đ không ảnh hưởng đến mảng gốc
    .sort((a, b) => b.id - a.id) // Sắp xếp ngược theo ID
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/quotations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request headers
          },
        }
      );
      console.log("Quotation data:", response.data); // Log d liệu nhận được
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
    const formattedDate = date.toISOString().split("T")[0]; // Lấy phần ngày
    const formattedTime = date.toTimeString().split(" ")[0]; // Lấy phần thời gian
    return { formattedDate, formattedTime };
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await axios.get(`http://localhost:8080/bookings/BookingForTour/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBookingDetails(response.data);
      setOriginalPaymentMethod(response.data.paymentMethod);
      
      // Convert VAT to nearest allowed value (0, 5, or 10)
      const vatPercentage = response.data.vat * 100;
      let normalizedVat;
      if (vatPercentage <= 0) normalizedVat = "0";
      else if (vatPercentage <= 5) normalizedVat = "5";
      else normalizedVat = "10";

      // Pre-fill the form with initial values
      paymentForm.setFieldsValue({
        paymentMethod: response.data.paymentMethod,
        vat: normalizedVat,
        discountAmount: response.data.discountAmount
      });
    } catch (error) {
      console.error("Error fetching booking details:", error);
      message.error("Failed to fetch booking details");
    }
  };

  const handleSendPayment = async (quotation) => {
    if (quotation.isApprove === "FINISH") {
      setSelectedQuotation(quotation);
      await fetchBookingDetails(quotation.bookingId);
      setIsPaymentModalVisible(true);
    }
  };

  const handlePaymentSubmit = async (values) => {
    try {
      const response = await axios.put(
        "http://localhost:8080/bookings/admin/updateResponseFormStaff",
        {
          bookingID: selectedQuotation.bookingId,
          paymentStatus: "processing",
          paymentMethod: values.paymentMethod,
          vat: Number(values.vat) / 100,
          discountAmount: parseFloat(values.discountAmount),
          amount: selectedQuotation.amount,
          quoId: selectedQuotation.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompletedPayments((prev) => new Set([...prev, selectedQuotation.id]));
      message.success("Payment sent successfully!");
      setIsPaymentModalVisible(false);
      paymentForm.resetFields();
      fetchQuotations();
    } catch (error) {
      console.error("Error updating payment:", error);
      message.error("Failed to send payment. Please try again.");
    }
  };

  // Thêm hàm tính discountAmount
  const calculateDiscountAmount = (baseAmount, vatAmount, discountRate) => {
    return (baseAmount + vatAmount) * discountRate;
  };

  return (
    <div
      className="container mx-auto py-4"
      style={{
        paddingLeft: "100px",
        paddingRight: "100px",
        paddingTop: "100px",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quotations List</h1>
        <Button
          onClick={() => navigate("/staff/booking-list-for-staff")}
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
        {/* <DatePicker
          onChange={(date) => setDateFilter(date)}
        /> */}
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
                <Tag
                  color={
                    quotation.isApprove === "PROCESS"
                      ? "blue"
                      : quotation.isApprove === "FINISH"
                      ? "green"
                      : "red"
                  }
                >
                  {quotation.isApprove}
                </Tag>
              }
            >
              <p>
                <strong>Amount:</strong> ${quotation.amount}
              </p>
              <p>
                <strong>Staff:</strong> {quotation.staffName}
              </p>
              <Space className="mt-2">
                <Button onClick={() => handleViewDetails(quotation.id)}>
                  View Detail
                </Button>
                {quotation.isApprove === "FINISH" && !quotation.send &&
                  !completedPayments.has(quotation.id) && (
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
        itemRender={(_, type, originalElement) => {
          if (type === "next" || type === "prev") {
            return (
              <Button
                style={{
                  color: "white",
                  backgroundColor: "#1890ff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px", // Đảm bảo kích thước đồng nhất
                  height: "32px", // Đảm bảo kích thước đồng nhất
                  fontSize: "14px", // Điều chỉnh kích thước chữ nếu cần
                }}
              >
                {type === "next" ? ">" : "<"}
              </Button>
            );
          }
          return originalElement;
        }}
      />

      <Modal
        title="Quotation Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {selectedQuotation && (
          <div>
            <p>
              <strong>Booking ID:</strong> {selectedQuotation.bookingId}
            </p>
            <p>
              <strong>Amount:</strong> ${selectedQuotation.amount}
            </p>
            <p>
              <strong>Description:</strong> {selectedQuotation.description}
            </p>
            <p>
              <strong>Staff Name:</strong> {selectedQuotation.staffName}
            </p>
            <p>
              <strong>Manager Name:</strong> {selectedQuotation.managerName}
            </p>
            <p>
              <strong>Status:</strong> {selectedQuotation.isApprove}
            </p>
            {selectedQuotation.approveTime && (
              <>
                <p>
                  <strong>Approve Date:</strong>{" "}
                  {formatDateTime(selectedQuotation.approveTime).formattedDate}
                </p>
                <p>
                  <strong>Approve Time:</strong>{" "}
                  {formatDateTime(selectedQuotation.approveTime).formattedTime}
                </p>
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="Send Payment"
        visible={isPaymentModalVisible}
        onCancel={() => {
          setIsPaymentModalVisible(false);
          setBookingDetails(null);
          paymentForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        {bookingDetails && (
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-bold mb-4">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2"><strong>Customer Name:</strong> {bookingDetails.nameCus}</p>
                <p className="mb-2"><strong>Email:</strong> {bookingDetails.email}</p>
                <p className="mb-2"><strong>Phone:</strong> {bookingDetails.phone}</p>
                <p className="mb-2"><strong>Booking Type:</strong> {bookingDetails.bookingType}</p>
              </div>
              <div>
                <p className="mb-2"><strong>Base Amount:</strong> ${bookingDetails.totalAmount}</p>
                <p className="mb-2"><strong>VAT (%):</strong> {bookingDetails.vat * 100}%</p>
                <p className="mb-2"><strong>VAT Amount:</strong> +${bookingDetails.vatAmount}</p>
                <p className="mb-2">
                  <strong>Discount Rate:</strong> {(bookingDetails.discountAmount / (bookingDetails.totalAmount + bookingDetails.vatAmount) * 100).toFixed(1)}%
                </p>
                <p className="mb-2">
                  <strong>Discount Amount:</strong> -${bookingDetails.discountAmount}
                  <span className="text-gray-500 text-sm ml-2">
                    ({(bookingDetails.discountAmount / (bookingDetails.totalAmount + bookingDetails.vatAmount) * 100).toFixed(1)}% of ${bookingDetails.totalAmount + bookingDetails.vatAmount})
                  </span>
                </p>
                <p className="mb-2 text-lg font-bold border-t pt-2">
                  <strong>Final Total:</strong> ${bookingDetails.totalAmountWithVAT}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mb-2"><strong>Payment Method:</strong> {bookingDetails.paymentMethod}</p>
                <p className="mb-2"><strong>Payment Status:</strong> {bookingDetails.paymentStatus}</p>
                <p className="mb-2"><strong>Created Date:</strong> {bookingDetails.createdDate && new Date(bookingDetails.createdDate).toLocaleString()}</p>
                <p className="mb-2"><strong>Updated Date:</strong> {bookingDetails.updatedDate && new Date(bookingDetails.updatedDate).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        <Form
          form={paymentForm}
          onFinish={(values) => {
            if (allowPaymentMethodChange && values.paymentMethod === originalPaymentMethod) {
              message.error('Please select a different payment method or uncheck the change option');
              return;
            }
            handlePaymentSubmit(values);
          }}
          layout="vertical"
        >
          <Form.Item
            name="allowChangePayment"
            valuePropName="checked"
          >
            <Checkbox 
              onChange={(e) => setAllowPaymentMethodChange(e.target.checked)}
            >
              Allow payment method change
            </Checkbox>
          </Form.Item>

          <Form.Item
            name="paymentMethod"
            label="Payment Method"
            rules={[{ required: true, message: 'Please select payment method' }]}
          >
            <Select disabled={!allowPaymentMethodChange}>
              <Option value="CASH">Cash</Option>
              <Option value="VISA">Credit Card</Option>
              <Option value="TRANSFER">Bank Transfer</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="vat" 
            label="VAT" 
            rules={[
              { required: true, message: 'Please select VAT rate' }
            ]}
          >
            <Select placeholder="Select VAT rate">
              <Option value="0">NO VAT (0%)</Option>
              <Option value="5">5%</Option>
              <Option value="10">10%</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="discountAmount"
            label="Discount Rate"
            tooltip="Enter discount rate (0 to 0.5, e.g., 0.1 for 10%)"
            rules={[
              { required: true, message: 'Please input discount rate' },
              {
                validator: (_, value) => {
                  const rate = parseFloat(value);
                  if (isNaN(rate) || rate < 0) {
                    return Promise.reject('Discount rate cannot be negative');
                  }
                  if (rate > 0.5) {
                    return Promise.reject('Discount rate cannot exceed 0.5');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              type="number" 
              step="0.01" 
              min="0"
              max="0.5"
              placeholder="Enter discount rate (e.g., 0.1)" 
              onChange={(e) => {
                const rate = parseFloat(e.target.value);
                const baseAmount = selectedQuotation.amount;
                const vatAmount = baseAmount * (paymentForm.getFieldValue('vat') / 100);
                const calculatedDiscount = calculateDiscountAmount(baseAmount, vatAmount, rate);
                console.log(`Calculated discount: $${calculatedDiscount} (${rate * 100}%)`);
              }}
            />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <Space>
              <Button onClick={() => {
                setIsPaymentModalVisible(false);
                setBookingDetails(null);
                paymentForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Confirm Payment
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Quotation;
