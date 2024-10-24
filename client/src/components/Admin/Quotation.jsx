import React, { useState, useEffect } from "react";
import { Card, Button, Tag, Space, DatePicker, Select, Row, Col, Pagination } from "antd";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/quotations/all");
      setQuotations(response.data);
    } catch (error) {
      console.error("Error when getting Quotation List:", error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchQuotations();
  }, [newQuotationId]);

  const handleViewDetails = (id) => {
    navigate(`/update-quotation/${id}`);
  };

  const filteredQuotations = quotations.filter(quotation => {
    if (statusFilter !== "ALL" && quotation.isApprove !== statusFilter) return false;
    if (dateFilter && !quotation.approveTime.startsWith(dateFilter.format("YYYY-MM-DD"))) return false;
    return true;
  });

  const paginatedQuotations = filteredQuotations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container mx-auto py-4" style={{ paddingLeft: '100px', paddingRight: '100px', paddingTop: '100px' }}>
      <h1 className="text-2xl font-bold mb-4">Quotations List</h1>
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
                {quotation.isApprove === "PROCESS" ? (
                  <Button type="primary" onClick={() => handleViewDetails(quotation.id)}>
                    Update Quotation
                  </Button>
                ) : (
                  <Button onClick={() => handleViewDetails(quotation.id)}>
                    View Detail
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
          if (type === 'next' || type === 'prev') {
            return (
              <Button 
                style={{ 
                  color: 'white', 
                  backgroundColor: '#1890ff', 
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',  // Đảm bảo kích thước đồng nhất
                  height: '32px', // Đảm bảo kích thước đồng nhất
                  fontSize: '14px' // Điều chỉnh kích thước chữ nếu cần
                }}
              >
                {type === 'next' ? '>' : '<'}
              </Button>
            );
          }
          return originalElement;
        }}
      />
    </div>
  );
};

export default Quotation;
