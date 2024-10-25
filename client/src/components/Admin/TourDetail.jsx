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
  InputNumber,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";
import { useCookies } from "react-cookie";

const { TextArea } = Input;
const { Option } = Select;

function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/tour/findById/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTour(response.data);
      form.setFieldsValue(response.data);
      if (response.data.tourImg) {
        setFileList([
          {
            uid: "-1",
            name: "Tour Image",
            status: "done",
            url: response.data.tourImg,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching tour:", error);
      message.error("Failed to fetch tour details");
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

      const updatedTour = {
        ...values,
        tourImg: validImages[0],
      };

      await axios.put(
        `http://localhost:8080/tour/updateTourAdmin/${id}`,
        updatedTour,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Tour updated successfully");
      setIsModalVisible(false);
      fetchTour();
    } catch (error) {
      console.error("Error updating tour:", error);
      message.error("Failed to update tour");
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

  if (!tour) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tour Details</h2>
      <Card>
        <p>
          <strong>Tour Name:</strong> {tour.tourName}
        </p>
        <p>
          <strong>Description:</strong> {tour.description}
        </p>
        <p>
          <strong>Price:</strong> {tour.unitPrice}
        </p>
        <p>
          <strong>Max Participants:</strong> {tour.maxParticipants}
        </p>
        <p>
          <strong>Start Time:</strong> {tour.startTime}
        </p>
        <p>
          <strong>End Time:</strong> {tour.endTime}
        </p>
        <div>
          <strong>Image:</strong>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {tour.tourImg && (
              <img
                src={tour.tourImg}
                alt="Tour Image"
                style={{
                  width: 100,
                  height: 100,
                  marginRight: 8,
                  marginBottom: 8,
                }}
              />
            )}
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            style={{ marginRight: 8 }}
          >
            Update Tour
          </Button>
        </div>
      </Card>

      <Modal
        title="Update Tour"
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
            name="tourName"
            label="Tour Name"
            rules={[{ required: true, message: "Please input the tour name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="unitPrice"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
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
          <Form.Item name="startTime" label="Start Time">
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="endTime" label="End Time">
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            name="status" // Ensure this matches the API response
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="full">Full</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
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
}

export default TourDetail;
