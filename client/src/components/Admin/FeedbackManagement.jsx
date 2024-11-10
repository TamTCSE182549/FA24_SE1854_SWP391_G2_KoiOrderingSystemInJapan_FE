import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Rate,
  Typography,
  Spin,
  Input,
  Space,
  Avatar,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useCookies } from "react-cookie";

const { Title, Text } = Typography;

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/feedback/all", {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>Feedback Management</Title>
        <Space>
          <Input
            placeholder="Search feedbacks..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64"
          />
        </Space>
      </div>

      <Card className="shadow-sm">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={feedbacks}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} feedbacks`,
            }}
            className="custom-table"
          />
        </Spin>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="text-center">
          <Title level={3} className="text-blue-500">
            {feedbacks.length}
          </Title>
          <Text>Total Feedbacks</Text>
        </Card>
        <Card className="text-center">
          <Title level={3} className="text-green-500">
            {feedbacks.filter((f) => f.rating >= 4).length}
          </Title>
          <Text>Positive Feedbacks (4-5 ★)</Text>
        </Card>
        <Card className="text-center">
          <Title level={3} className="text-yellow-500">
            {(
              feedbacks.reduce((acc, curr) => acc + curr.rating, 0) /
                feedbacks.length || 0
            ).toFixed(1)}
          </Title>
          <Text>Average Rating</Text>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackManagement;
