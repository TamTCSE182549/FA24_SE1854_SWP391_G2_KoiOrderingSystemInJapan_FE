import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useCookies } from "react-cookie";
import uploadFile from "../../utils/upload";

const { Option } = Select;
const { TextArea } = Input;

const KoiManagement = () => {
  const [kois, setKois] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKoi, setEditingKoi] = useState(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchKois();
  }, []);

  const fetchKois = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/kois/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKois(response.data);
    } catch (error) {
      console.error("Error fetching kois:", error);
      message.error("Failed to fetch kois");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (koi = null) => {
    setEditingKoi(koi);
    if (koi) {
      form.setFieldsValue({
        koiName: koi.koiName,
        description: koi.description,
        color: koi.color,
        origin: koi.origin,
      });
      setFileList(
        koi.koiImageList
          ? koi.koiImageList.map((image, index) => ({
              uid: `-${index}`,
              name: `image-${index}.png`,
              status: "done",
              url: image.imageUrl,
            }))
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingKoi(null);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const uploadedImages = await Promise.all(
        fileList.map(async (file) => {
          if (file.originFileObj) {
            try {
              const url = await uploadFile(file.originFileObj);
              return { imageUrl: url };
            } catch (error) {
              console.error("Error uploading file:", error);
              message.error(`Failed to upload ${file.name}`);
              return null;
            }
          }
          return { imageUrl: file.url };
        })
      );

      const validImages = uploadedImages.filter((img) => img !== null);

      const koiData = {
        koiName: values.koiName,
        koiImageList: validImages,
        description: values.description,
        color: values.color,
        origin: values.origin,
      };

      if (editingKoi) {
        await axios.put(
          `http://localhost:8080/kois/${editingKoi.id}`,
          koiData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        message.success("Koi updated successfully");
      } else {
        await axios.post("http://localhost:8080/kois/", koiData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Koi created successfully");
      }
      setIsModalVisible(false);
      fetchKois();
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Error submitting koi:", error);
      message.error("Failed to submit koi");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/kois/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Koi deleted successfully");
      fetchKois();
    } catch (error) {
      console.error("Error deleting koi:", error);
      message.error("Failed to delete koi");
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "koiName",
      key: "koiName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Origin",
      dataIndex: "origin",
      key: "origin",
    },
    {
      title: "Status",
      key: "active",
      dataIndex: "active",
      render: (active) => (
        <Tag color={active === true ? "green" : "red"}>
          {active === true ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Koi Management</h1>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Add New Koi
      </Button>
      <Table
        columns={columns}
        dataSource={kois}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title={editingKoi ? "Edit Koi" : "Add New Koi"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {editingKoi ? "Update" : "Create"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="koiName" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="color" label="Color" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="origin" label="Origin" rules={[{ required: true }]}>
            <Select>
              <Option value="Japan">Japan</Option>
              <Option value="China">China</Option>
              <Option value="EU">EU</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={previewOpen}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default KoiManagement;
