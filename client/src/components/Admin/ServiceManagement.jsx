import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Tag,
  Space,
  Select,
  Table,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const { Option } = Select;
const { TextArea } = Input;

const ServiceManagement = () => {
  const location = useLocation();
  const newQuotationId = location.state?.newQuotationId;
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [updateForm] = Form.useForm();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/quotations/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/bookings/BookingForTour/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookingDetails(response.data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      message.error("Failed to fetch booking details");
    }
  };

  const handleUpdateStatus = async (record) => {
    setSelectedQuotationId(record.id);
    setUpdateModalVisible(true);
    updateForm.setFieldsValue({
      status: record.isApprove,
      amount: record.amount,
      description: record.description,
    });
    await fetchBookingDetails(record.bookingId);
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/quotations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const handleUpdateSubmit = async (values) => {
    if (values.status === "PROCESS") {
      message.error("You must change the status to update Status");
      return;
    }

    if (values.status === "REJECTED") {
      if (!values.description || values.description.trim() === "") {
        message.error("Please provide a reason for rejection");
        return;
      }
      if (values.description.trim() === "Quotation being in Process") {
        message.error("Please provide a reason why rejected");
        return;
      }
    }

    try {
      const payload = {
        amount: values.amount,
        description:
          values.status === "FINISH"
            ? "Quotation has been accept"
            : values.description,
      };

      await axios.put(
        `http://localhost:8080/quotations/admin/${selectedQuotationId}?approveStatus=${values.status}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Quotation status updated successfully");
      setUpdateModalVisible(false);
      fetchQuotations();
    } catch (error) {
      console.error("Error updating quotation:", error);
      message.error("Failed to update quotation status");
    }
  };

  useEffect(() => {
    const status = updateForm.getFieldValue("status");
    if (status === "FINISH") {
      updateForm.setFieldValue("description", "");
    }
  }, [updateForm.getFieldValue("status")]);

  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatVND(amount),
    },
    {
      title: "Staff",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Status",
      dataIndex: "isApprove",
      key: "isApprove",
      render: (status) => (
        <Tag
          color={
            status === "PROCESS"
              ? "blue"
              : status === "FINISH"
              ? "green"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleViewDetails(record.id)}>
            View Detail
          </Button>
          {record.isApprove === "PROCESS" && (
            <Button type="primary" onClick={() => handleUpdateStatus(record)}>
              Update Quotation
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredQuotations = quotations.filter((quotation) => {
    if (statusFilter !== "ALL" && quotation.isApprove !== statusFilter)
      return false;
    return true;
  });

  return (
    <div className="p-6 bg-[#e7ede0]">
      <h1 className="text-2xl font-bold mb-4">Service Management</h1>
      <Card>
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
        </Space>

        <Table
          columns={columns}
          dataSource={filteredQuotations}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredQuotations.length,
            onChange: (page) => setCurrentPage(page),
          }}
          loading={loading}
        />
      </Card>

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
              <strong>Amount:</strong> {formatVND(selectedQuotation.amount)}
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
                  {new Date(selectedQuotation.approveTime).toLocaleDateString()}
                </p>
                <p>
                  <strong>Approve Time:</strong>{" "}
                  {new Date(selectedQuotation.approveTime).toLocaleTimeString()}
                </p>
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="Update Quotation Status"
        visible={updateModalVisible}
        onCancel={() => {
          setUpdateModalVisible(false);
          updateForm.resetFields();
          setBookingDetails(null);
        }}
        footer={null}
        width={700}
      >
        {bookingDetails && (
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-bold mb-4">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2">
                  <strong>Customer Name:</strong> {bookingDetails.nameCus}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {bookingDetails.email}
                </p>
                <p className="mb-2">
                  <strong>Phone:</strong> {bookingDetails.phone}
                </p>
                <p className="mb-2">
                  <strong>Booking Type:</strong> {bookingDetails.bookingType}
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong>Total Amount:</strong>{" "}
                  {formatVND(bookingDetails.totalAmount)}
                </p>
                <p className="mb-2">
                  <strong>VAT (%):</strong> {bookingDetails.vat}
                </p>
                <p className="mb-2">
                  <strong>VAT Amount:</strong>{" "}
                  {formatVND(bookingDetails.vatAmount)}
                </p>
                <p className="mb-2">
                  <strong>Discount Amount:</strong>{" "}
                  {formatVND(bookingDetails.discountAmount)}
                </p>
                <p className="mb-2">
                  <strong>Total with VAT:</strong>{" "}
                  {formatVND(bookingDetails.totalAmountWithVAT)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mb-2">
                  <strong>Payment Method:</strong>{" "}
                  {bookingDetails.paymentMethod}
                </p>
                <p className="mb-2">
                  <strong>Payment Status:</strong>{" "}
                  {bookingDetails.paymentStatus}
                </p>
                <p className="mb-2">
                  <strong>Created Date:</strong>{" "}
                  {bookingDetails.createdDate &&
                    new Date(bookingDetails.createdDate).toLocaleString()}
                </p>
                <p className="mb-2">
                  <strong>Updated Date:</strong>{" "}
                  {bookingDetails.updatedDate &&
                    new Date(bookingDetails.updatedDate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <Form form={updateForm} onFinish={handleUpdateSubmit} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            rules={[
              { required: true, message: "Please select a status" },
              {
                validator: (_, value) => {
                  if (value === "PROCESS") {
                    return Promise.reject(
                      "You must change the status to update Status"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Select>
              <Option value="FINISH">Accept</Option>
              <Option value="REJECTED">Rejected</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount (VND)"
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.reject("Amount is required");
                  }
                  if (isNaN(value)) {
                    return Promise.reject("Amount must be a number");
                  }
                  const numValue = parseFloat(value);
                  if (numValue <= 0) {
                    return Promise.reject("Amount must be greater than 0");
                  }
                  if (numValue > 10000000000) {
                    return Promise.reject(
                      "Amount cannot exceed 10,000,000,000 VND"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              type="number"
              min="0"
              max="10000000000"
              step="1000"
              placeholder="Enter amount in VND"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Reason"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue("status") === "REJECTED") {
                    if (!value || value.trim() === "") {
                      return Promise.reject(
                        "Please provide a reason for rejection"
                      );
                    }
                    if (value.trim() === "Quotation being in Process") {
                      return Promise.reject(
                        "Please provide a reason why rejected"
                      );
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <TextArea
              disabled={updateForm.getFieldValue("status") === "FINISH"}
              placeholder={
                updateForm.getFieldValue("status") === "REJECTED"
                  ? "Enter reason for rejection"
                  : ""
              }
              rows={4}
            />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Space>
              <Button
                onClick={() => {
                  setUpdateModalVisible(false);
                  updateForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
