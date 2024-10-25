
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { Table, Button, Modal, Form, Input, message, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";

const { TextArea } = Input;


const FarmManagement = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [decodedToken, setDecodedToken] = useState(null);
  const [farms, setFarms] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState(null);


  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);


  useEffect(() => {
    fetchFarms();
  }, [token]);

  const fetchFarms = async () => {
    try {

      const response = await axios.get(
        "http://localhost:8080/koi-farm/list-farm-active",
        {
          headers: {

            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);

      message.error("Failed to fetch farms");
    }
  };

  const createFarm = async (values) => {

    try {
      const uploadedImages = await Promise.all(
        fileList.map(async (file) => {
          const url = await uploadFile(file.originFileObj);
          return url;
        })
      );

      const farmData = {
        ...values,
        images: uploadedImages,
        createdBy: decodedToken?.sub || "",
      };

      await axios.post("http://localhost:8080/koi-farm/create", farmData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Farm created successfully");
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchFarms();
    } catch (error) {
      console.error("Error creating farm:", error);
      message.error("Failed to create farm");
    }
  };

  const deleteFarm = async () => {
    if (!farmToDelete) {
      message.error("No farm selected for deletion");
      return;
    }

    try {
      const farmId = parseInt(farmToDelete, 10); // Convert to number
      if (isNaN(farmId)) {
        throw new Error("Invalid farm ID");
      }

      await axios.delete(
        `http://localhost:8080/koi-farm/deleteFarm/${farmId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Farm deleted successfully");
      setIsDeleteModalVisible(false);
      setFarmToDelete(null); // Reset farmToDelete after successful deletion
      fetchFarms();
    } catch (error) {
      console.error("Error deleting farm:", error);
      message.error("Failed to delete farm");
    }
  };

  const viewFarm = (id) => {
    navigate(`/admin/farm/${id}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "farmName",
      key: "farmName",
    },
    {
      title: "Phone",
      dataIndex: "farmPhoneNumber",
      key: "farmPhoneNumber",
    },
    {
      title: "Email",
      dataIndex: "farmEmail",
      key: "farmEmail",
    },
    {
      title: "Address",
      dataIndex: "farmAddress",
      key: "farmAddress",
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => viewFarm(record.id)}
            type="primary"
            style={{ marginRight: "8px" }}
          >
            View
          </Button>
          <Button
            onClick={() => showDeleteConfirm(record.id)}
            type="primary"
            danger
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const showDeleteConfirm = (id) => {
    if (id) {
      setFarmToDelete(id);
      setIsDeleteModalVisible(true);
    } else {
      message.error("Invalid farm ID");
    }

  };

  return (
    <div className="p-4">

      <h2 className="text-2xl font-bold mb-4">Farm Management</h2>
      <Button
        onClick={() => setIsModalVisible(true)}
        type="primary"
        className="mb-4"
      >
        Create New Farm
      </Button>
      <Table columns={columns} dataSource={farms} rowKey="id" />

      <Modal
        title="Create New Farm"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
      >
        <Form form={form} onFinish={createFarm} layout="vertical">
          <Form.Item
            name="farmName"
            label="Farm Name"
            rules={[{ required: true, message: "Please input the farm name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="farmPhoneNumber" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item
            name="farmEmail"
            label="Email"
            rules={[{ type: "email", message: "Please enter a valid email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="farmAddress"
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="images"
            label="Farm Images"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false}
              maxCount={5} // Allow up to 5 images
            >
              {fileList.length >= 5 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Farm
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={deleteFarm}
        onCancel={() => setIsDeleteModalVisible(false)}
      >
        <p>Are you sure you want to delete this farm?</p>
      </Modal>

    </div>
  );
};
export default FarmManagement;

