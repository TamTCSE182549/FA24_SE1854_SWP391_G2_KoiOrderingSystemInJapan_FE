import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Button,
  message,
  Modal,
  Form,
  Input,
  Upload,
  Select,
  InputNumber,
  Table,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";
import { useCookies } from "react-cookie";

const { TextArea } = Input;
const { Option } = Select;

function Farmdetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [koiForm] = Form.useForm();
  const [koiFileList, setKoiFileList] = useState([]);
  const [allKois, setAllKois] = useState([]);
  const [isAddKoiToFarmModalVisible, setIsAddKoiToFarmModalVisible] =
    useState(false);
  const [addKoiToFarmForm] = Form.useForm();

  const [farmKois, setFarmKois] = useState([]);

  useEffect(() => {
    fetchFarm();
    fetchAllKois();
    fetchFarmKois();
  }, [id]);

  const fetchFarm = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/koi-farm/get/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFarm(response.data);
      form.setFieldsValue(response.data);
      if (response.data.koiFarmImages) {
        setFileList(
          response.data.koiFarmImages.map((image, index) => ({
            uid: `-${index}`,
            name: `Image ${index + 1}`,
            status: "done",
            url: image.imageUrl,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching farm:", error);
      message.error("Failed to fetch farm details");
    }
  };

  const fetchAllKois = async () => {
    try {
      const response = await axios.get("http://localhost:8080/kois/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllKois(response.data);
    } catch (error) {
      console.error("Error fetching all kois:", error);
      message.error("Failed to fetch kois");
    }
  };

  const fetchFarmKois = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/KoiOfFarm/farm/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFarmKois(response.data);
    } catch (error) {
      console.error("Error fetching farm kois:", error);
      message.error("Failed to fetch farm kois");
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
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

      const updatedFarm = {
        farmName: values.farmName,
        farmPhoneNumber: values.farmPhoneNumber,
        farmEmail: values.farmEmail,
        farmAddress: values.farmAddress,
        website: values.website,
        description: values.description,
        images: validImages,
        active: values.active, // Add active status
      };

      await axios.put(
        `http://localhost:8080/koi-farm/update/${id}`,
        updatedFarm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Farm updated successfully");
      setIsModalVisible(false);
      fetchFarm();
    } catch (error) {
      console.error("Error updating farm:", error);
      message.error("Failed to update farm");
    }
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

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

  const addKoiToFarm = async () => {
    try {
      const values = await addKoiToFarmForm.validateFields();
      const newKoiInFarm = {
        koiId: values.koiId,
        farmId: parseInt(id),
        quantity: values.quantity,
        available: true,
      };

      await axios.post(`http://localhost:8080/KoiOfFarm`, newKoiInFarm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Koi added to farm successfully");
      setIsAddKoiToFarmModalVisible(false);
      addKoiToFarmForm.resetFields();
      fetchFarm(); // Refresh farm data
    } catch (error) {
      console.error("Error adding koi to farm:", error);
      message.error(error.response?.data);
    }
  };

  const handleKoiChange = ({ fileList: newFileList }) =>
    setKoiFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const deleteKoiFromFarm = async (koiOfFarmId) => {
    try {
      await axios.delete(`http://localhost:8080/KoiOfFarm/${koiOfFarmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Koi removed f  rom farm successfully");
      fetchFarmKois(); // Refresh the list of kois
    } catch (error) {
      console.error("Error removing koi from farm:", error);
      message.error("Failed to remove koi from farm");
    }
  };

  if (!farm) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Farm Details</h2>
      <Card>
        <p>
          <strong>Farm Name:</strong> {farm.farmName}
        </p>
        <p>
          <strong>Phone Number:</strong> {farm.farmPhoneNumber}
        </p>
        <p>
          <strong>Email:</strong> {farm.farmEmail}
        </p>
        <p>
          <strong>Address:</strong> {farm.farmAddress}
        </p>
        <p>
          <strong>Website:</strong> {farm.website}
        </p>
        <p>
          <strong>Description:</strong> {farm.description}
        </p>
        <div>
          <strong>Images:</strong>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {farm.koiFarmImages &&
              farm.koiFarmImages.map((image) => (
                <img
                  key={image.id}
                  src={image.imageUrl}
                  alt={`Farm Image ${image.id}`}
                  style={{
                    width: 100,
                    height: 100,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                />
              ))}
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            style={{ marginRight: 8 }}
          >
            Update Farm
          </Button>
          <Button
            type="primary"
            onClick={() => setIsAddKoiToFarmModalVisible(true)}
            style={{ marginRight: 8 }}
          >
            Add Koi to Farm
          </Button>
        </div>
      </Card>

      <Modal
        title="Update Farm"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdate}>
            Update
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
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
          <Form.Item name="farmEmail" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="farmAddress" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="active"
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
              maxCount={5}
            >
              {fileList.length >= 5 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Koi to Farm"
        visible={isAddKoiToFarmModalVisible}
        onCancel={() => setIsAddKoiToFarmModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsAddKoiToFarmModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={addKoiToFarm}>
            Add Koi
          </Button>,
        ]}
      >
        <Form form={addKoiToFarmForm} layout="vertical">
          <Form.Item
            name="koiId"
            label="Select Koi"
            rules={[{ required: true, message: "Please select a koi!" }]}
          >
            <Select>
              {allKois.map((koi) => (
                <Option key={koi.id} value={koi.id}>
                  {koi.koiName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <InputNumber min={1} />
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

      <h3 className="text-xl font-bold mt-8 mb-4">Kois in this Farm</h3>
      <Table
        dataSource={farmKois}
        columns={[
          {
            title: "Koi Name",
            dataIndex: "koiName",
            key: "koiName",
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
          },
          {
            title: "Available",
            dataIndex: "available",
            key: "available",
            render: (available) => (available ? "Yes" : "No"),
          },
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Button
                onClick={() => deleteKoiFromFarm(record.id)}
                type="primary"
                danger
              >
                Delete
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}

export default Farmdetail;
