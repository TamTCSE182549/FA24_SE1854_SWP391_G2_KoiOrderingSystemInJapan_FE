import React, { useState, useEffect } from "react";
import { Card, Button, Tag, Space, Select, Table, Modal } from "antd";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const { Option } = Select;

const OrderManagement = () => {
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

  const handleUpdateStatus = (id) => {
    navigate(`/update-quotation/${id}`);
  };

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

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount}`,
    },
    {
      title: 'Staff',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: 'Status',
      dataIndex: 'isApprove',
      key: 'isApprove',
      render: (status) => (
        <Tag color={
          status === "PROCESS" ? "blue" :
          status === "FINISH" ? "green" : "red"
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
          <Button onClick={() => handleViewDetails(record.id)}>
            View Detail
          </Button>
          {record.isApprove === "PROCESS" && (
            <Button type="primary" onClick={() => handleUpdateStatus(record.id)}>
              Update Quotation
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredQuotations = quotations.filter(quotation => {
    if (statusFilter !== "ALL" && quotation.isApprove !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 bg-[#e7ede0]">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
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
                <p><strong>Approve Date:</strong> {new Date(selectedQuotation.approveTime).toLocaleDateString()}</p>
                <p><strong>Approve Time:</strong> {new Date(selectedQuotation.approveTime).toLocaleTimeString()}</p>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;
