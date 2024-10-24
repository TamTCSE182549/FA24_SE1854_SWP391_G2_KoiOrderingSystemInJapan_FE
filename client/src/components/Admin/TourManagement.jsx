import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, InputNumber, message } from "antd";

const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await axios.get("http://localhost:8080/tour/showAll");
      setTours(response.data);
    } catch (error) {
      console.error("Error fetching tours:", error);
      message.error("Failed to fetch tours");
    }
  };

  const handleCreate = async (values) => {
    try {
      await axios.post("http://localhost:8080/tour/createTourRes", values);
      message.success("Tour created successfully");
      setIsModalVisible(false);
      form.resetFields();
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
        values
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
      await axios.delete(`http://localhost:8080/tour/deleteTourRes/${id}`);
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
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => showModal(record)}
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
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true, message: "Please input the duration!" }]}
          >
            <Input />
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
