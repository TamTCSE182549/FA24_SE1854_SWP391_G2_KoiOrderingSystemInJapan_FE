import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Upload,
  Tag,
} from "antd";
import moment from "moment"; // Thêm import moment
import { useCookies } from "react-cookie";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import uploadFile from "../../utils/upload"; // Import hàm uploadFile

const formatVND = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
};

const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [form] = Form.useForm();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [fileList, setFileList] = useState([]); // State để quản lý danh sách file
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await axios.get("http://localhost:8080/tour/showAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTours(response.data);
    } catch (error) {
      console.error("Error fetching tours:", error);
      message.error("Failed to fetch tours");
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleCreate = async (values) => {
    try {
      // Upload images and get URLs
      const uploadedImages = await Promise.all(
        fileList.map(async (file) => {
          if (file.originFileObj) {
            try {
              const url = await uploadFile(file.originFileObj);
              return url;
            } catch (error) {
              console.error("Error uploading file:", error);
              message.error(`Failed to upload ${file.name}`);
              return null;
            }
          }
          return file.url;
        })
      );

      const validImages = uploadedImages.filter((img) => img !== null);

      // Convert dates to LocalDateTime format with time set to 00:00:00
      const tourData = {
        ...values,
        startTime: moment(values.startTime)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        endTime: moment(values.endTime)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        tourImg: validImages[0], // Include the image URL
      };

      // Call API to create tour
      await axios.post("http://localhost:8080/tour/createTourRes", tourData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Tour created successfully");
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchTours();
    } catch (error) {
      console.error("Error creating tour:", error);
      message.error("Failed to create tour");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(
        `http://localhost:8080/tour/updateTourRes/${editingTour.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Tour updated successfully");
      setIsModalVisible(false);
      setEditingTour(null);
      form.resetFields();
      fetchTours();
    } catch (error) {
      console.error("Error updating tour:", error);
      message.error("Failed to update tour");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/tour/deleteTourRes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Tour deleted successfully");
      fetchTours();
    } catch (error) {
      console.error("Error deleting tour:", error);
      message.error("Failed to delete tour");
    }
  };

  const showModal = (tour = null) => {
    setEditingTour(tour);
    form.setFieldsValue(tour || {});
    setIsModalVisible(true);
  };

  const handleEdit = (id) => {
    navigate(`/admin/tourdetail/${id}`); // Navigate to TourDetail with the tour ID
  };

  const columns = [
    {
      title: "Tour Name",
      dataIndex: "tourName",
      key: "tourName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => formatVND(price),
    },
    {
      title: "Max Participants",
      dataIndex: "maxParticipants",
      key: "maxParticipants",
    },
    {
      title: "Create date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => moment(text).format("DD/MM/YYYY"), // Định dạng lại ngày
    },
    {
      title: "Status",
      key: "tourStatus",
      dataIndex: "tourStatus",
      render: (active) => (
        <Tag color={active === "active" ? "green" : "red"}>{active}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => handleEdit(record.id)} // Use handleEdit for navigation
            type="primary"
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(record.id)} type="primary" danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tour Management</h2>
      <Button
        onClick={() => showModal()}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Add New Tour
      </Button>
      <Table columns={columns} dataSource={tours} rowKey="id" />

      <Modal
        title={editingTour ? "Edit Tour" : "Create New Tour"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTour(null);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingTour ? handleUpdate : handleCreate}
          layout="vertical"
        >
          <Form.Item
            name="tourName"
            label="Tour Name"
            rules={[{ required: true, message: "Please input the tour name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="unitPrice"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: "100%" }}
              formatter={(value) => value ? `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` : ''}
              parser={(value) => value?.replace(/\./g, '')}
              placeholder="Enter price in VND"
            />
          </Form.Item>
          <Form.Item
            name="maxParticipants"
            label="Max Participants"
            rules={[
              { required: true, message: "Please input the max participants!" },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[
              {
                required: true,
                message: "Please select the start date!",
              },
              {
                validator: (_, value) =>
                  value && moment(value).isAfter(moment().add(7, "days"))
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "Start date must be at least 7 days from today"
                        )
                      ),
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[
              {
                required: true,
                message: "Please select the end date!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    moment(value).isSameOrAfter(getFieldValue("startTime"))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "End date must be the same as or after the start date"
                    )
                  );
                },
              }),
            ]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Tour Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Ngăn không cho upload tự động
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTour ? "Update Tour" : "Create Tour"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TourManagement;
