import React, { useState, useEffect } from "react";
import { Table, Card, Tag, Typography, Spin, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useCookies } from "react-cookie";
import moment from "moment";

const { Title, Text } = Typography;

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/delivery", {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setDeliveries(response.data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: "success",
      CANCELLED: "error",
      PROCESSING: "processing",
      PENDING: "warning",
    };
    return colors[status] || "default";
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      sorter: (a, b) => a.bookingId - b.bookingId,
      width: 100,
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
      render: (text) => <Text strong>{text}</Text>,
      filterable: true,
    },
    {
      title: "Staff",
      dataIndex: "staffName",
      key: "staffName",
      width: 150,
    },
    {
      title: "Receive Date",
      dataIndex: "receiveDate",
      key: "receiveDate",
      width: 150,
      render: (date) => (date ? moment(date).format("DD/MM/YYYY HH:mm") : "-"),
      sorter: (a, b) => moment(a.receiveDate) - moment(b.receiveDate),
    },
    {
      title: "Health Description",
      dataIndex: "healthKoiDescription",
      key: "healthKoiDescription",
      width: 200,
      render: (text) => text || "-",
    },
    {
      title: "Remain Amount",
      dataIndex: "remainAmount",
      key: "remainAmount",
      width: 120,
      render: (amount) => (
        <Text type={amount > 0 ? "success" : "secondary"}>
          ${amount?.toFixed(2) || "0.00"}
        </Text>
      ),
      sorter: (a, b) => a.remainAmount - b.remainAmount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Completed", value: "COMPLETED" },
        { text: "Cancelled", value: "CANCELLED" },
        { text: "Processing", value: "PROCESSING" },
        { text: "Pending", value: "PENDING" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 200,
      render: (text) => text || "-",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 200,
      render: (text) => text || "-",
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = deliveries.filter((item) =>
    Object.values(item).some(
      (val) =>
        val && val.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Delivery Management</Title>
        <Space>
          <Input.Search
            placeholder="Search deliveries..."
            allowClear
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64"
          />
        </Space>
      </div>

      <Card className="shadow-sm">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="bookingId"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} deliveries`,
            }}
            scroll={{ x: 1500 }} // Enable horizontal scrolling
            className="custom-table"
          />
        </Spin>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card className="text-center">
          <Title level={4}>{deliveries.length}</Title>
          <Text type="secondary">Total Deliveries</Text>
        </Card>
        <Card className="text-center">
          <Title level={4}>
            {deliveries.filter((d) => d.status === "COMPLETED").length}
          </Title>
          <Text type="success">Completed</Text>
        </Card>
        <Card className="text-center">
          <Title level={4}>
            {deliveries.filter((d) => d.status === "PROCESSING").length}
          </Title>
          <Text type="warning">Processing</Text>
        </Card>
        <Card className="text-center">
          <Title level={4}>
            {deliveries.filter((d) => d.status === "CANCELLED").length}
          </Title>
          <Text type="danger">Cancelled</Text>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryManagement;
