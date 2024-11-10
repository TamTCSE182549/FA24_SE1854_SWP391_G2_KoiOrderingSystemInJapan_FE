import React, { useState, useEffect } from "react";
import {
  Card,
  List,
  Rate,
  Button,
  Modal,
  Input,
  Empty,
  Spin,
  Typography,
  Tooltip,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const Feedback = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/feedback/customer",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedbacks(
        response.data.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        )
      );
    } catch (error) {
      toast.error("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feedback) => {
    setSelectedFeedback(feedback);
    setEditRating(feedback.rating);
    setEditContent(feedback.content);
    setIsEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/feedback/update/${selectedFeedback.id}`,
        {
          rating: editRating,
          content: editContent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Feedback updated successfully");
      setIsEditModalVisible(false);
      fetchFeedbacks();
    } catch (error) {
      toast.error("Failed to update feedback");
    }
  };

  const showDeleteConfirm = (feedbackId) => {
    confirm({
      title: "Are you sure you want to delete this feedback?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(feedbackId);
      },
    });
  };

  const handleDelete = async (feedbackId) => {
    try {
      await axios.delete(
        `http://localhost:8080/feedback/delete/${feedbackId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(feedbackId);
      toast.success("Feedback deleted successfully");
      fetchFeedbacks();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-32 pb-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <ToastContainer />

        {/* Header Section */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-900 mb-4">
            My Feedbacks
          </Title>
          <Text className="text-lg text-gray-600">
            Manage and review all your feedback submissions
          </Text>
        </div>

        {/* Feedback List */}
        <Spin spinning={loading}>
          {feedbacks.length > 0 ? (
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 3,
              }}
              dataSource={feedbacks}
              renderItem={(feedback) => (
                <List.Item>
                  <Card
                    className="hover:shadow-lg transition-shadow duration-300"
                    actions={[
                      <Tooltip title="Edit">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(feedback)}
                        />
                      </Tooltip>,
                      <Tooltip title="Delete">
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => showDeleteConfirm(feedback.id)}
                        />
                      </Tooltip>,
                    ]}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Text strong className="text-lg">
                            Booking #{feedback.bookingId}
                          </Text>
                          <div className="mt-2">
                            <Rate disabled value={feedback.rating} />
                          </div>
                        </div>
                        <Tag color="blue">
                          {new Date(feedback.createdDate).toLocaleDateString()}
                        </Tag>
                      </div>
                      <div className="mt-4">
                        <Text className="text-gray-600 block">
                          {feedback.content}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <Empty
              description={
                <span className="text-gray-500 text-lg">
                  No feedbacks found
                </span>
              }
              className="py-12"
            />
          )}
        </Spin>

        {/* Edit Modal */}
        <Modal
          title="Edit Feedback"
          visible={isEditModalVisible}
          onOk={handleUpdate}
          onCancel={() => setIsEditModalVisible(false)}
          okText="Update"
          cancelText="Cancel"
        >
          <div className="space-y-4">
            <div>
              <Text strong>Rating</Text>
              <Rate
                value={editRating}
                onChange={setEditRating}
                className="block mt-2"
              />
            </div>
            <div>
              <Text strong>Feedback</Text>
              <TextArea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                className="mt-2"
                placeholder="Enter your feedback here..."
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Feedback;
