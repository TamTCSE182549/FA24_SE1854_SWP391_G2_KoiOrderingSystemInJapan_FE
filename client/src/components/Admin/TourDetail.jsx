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
  Table,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";
import { useCookies } from "react-cookie";
import moment from "moment"; // Import moment for date manipulation

const { TextArea } = Input;
const { Option } = Select;

function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [tableData, setTableData] = useState([]); // State for table data
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddFarmModalVisible, setIsAddFarmModalVisible] = useState(false); // State for add farm modal
  const [form] = Form.useForm();
  const [addFarmForm] = Form.useForm(); // Form for adding farm
  const [fileList, setFileList] = useState([]);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [farms, setFarms] = useState([]); // State for farms data

  useEffect(() => {
    fetchTour();
    fetchTableData(); // Fetch table data
    fetchFarms(); // Fetch farms data
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

  const fetchTableData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/TourDetail/tour/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTableData(response.data); // Set the fetched data to tableData
    } catch (error) {
      console.error("Error fetching table data:", error);
      message.error("Failed to fetch table data");
    }
  };

  const fetchFarms = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/koi-farm/list-farm-active`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFarms(response.data); // Set the fetched farms data
    } catch (error) {
      console.error("Error fetching farms:", error);
      message.error("Failed to fetch farms");
    }
  };

  const handleDelete = async (recordId) => {
    try {
      await axios.delete(`http://localhost:8080/TourDetail/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Record deleted successfully");
      fetchTableData(); // Refresh table data after deletion
    } catch (error) {
      console.error("Error deleting record:", error);
      message.error("Failed to delete record");
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
        startTime: moment(values.startTime)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        endTime: moment(values.endTime)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        tourImg: validImages[0], // Ensure the image is included in the update
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

  const handleAddFarm = async () => {
    try {
      // Validate form fields
      const values = await addFarmForm.validateFields();

      // Construct the payload
      const newFarmInTour = {
        tourID: parseInt(id), // Use the tourID from the URL parameters
        farmID: values.farmName, // Assuming farmName is the ID of the farm
        description: values.description, // Directly from the form
      };

      // Send the payload to the server
      await axios.post(
        `http://localhost:8080/TourDetail/create`,
        newFarmInTour,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Success message and actions
      message.success("Farm added to tour successfully");
      setIsAddFarmModalVisible(false);
      addFarmForm.resetFields(); // Reset form fields
      fetchTableData(); // Refresh table data after adding a farm
    } catch (error) {
      // Error handling
      console.error("Error adding farm to tour:", error);
      message.error(error.response?.data || "Failed to add farm to tour");
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

  // Define columns for the table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tour Name",
      dataIndex: "tourName",
      key: "tourName",
    },
    {
      title: "Farm Name",
      dataIndex: "farmName",
      key: "farmName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleDelete(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

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
          <Button type="primary" onClick={() => setIsAddFarmModalVisible(true)}>
            Add Farm to Tour
          </Button>
        </div>
      </Card>

      {/* Render the table */}
      <Table columns={columns} dataSource={tableData} pagination={false} />

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
          <Form.Item
            name="status"
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
        title="Add Farm to Tour"
        visible={isAddFarmModalVisible}
        onCancel={() => setIsAddFarmModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsAddFarmModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddFarm}>
            Add Farm
          </Button>,
        ]}
      >
        <Form form={addFarmForm} layout="vertical">
          <Form.Item
            name="farmName"
            label="Farm Name"
            rules={[{ required: true, message: "Please select a farm!" }]}
          >
            <Select placeholder="Select a farm">
              {farms.map((farm) => (
                <Option key={farm.id} value={farm.id}>
                  {farm.farmName}
                </Option>
              ))}
            </Select>
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
