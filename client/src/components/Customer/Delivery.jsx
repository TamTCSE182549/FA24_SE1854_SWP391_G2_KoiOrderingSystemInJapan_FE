import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Divider,
  Steps,
  Typography,
  Spin,
  Alert,
  Button,
  Modal,
  Input,
  message,
} from "antd";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { format } from "date-fns"; // Import date-fns
import { jwtDecode } from "jwt-decode";

const { Title } = Typography;

const Delivery = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const { bookingId } = useParams();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [newRoute, setNewRoute] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newDeliveryRoute, setNewDeliveryRoute] = useState("");
  const [newDeliveryDescription, setNewDeliveryDescription] = useState("");

  const deliveryList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/delivery-history/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setDeliveries(response.data);
      }
    } catch (error) {
      console.error("Error fetching delivery data:", error);
      setError("Failed to fetch delivery data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    deliveryList();
  }, []);

  const formatDateTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      return format(date, "dd/MM/yyyy HH:mm:ss"); // Format as needed
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateTimeString; // Return original if formatting fails
    }
  };

  const showUpdateModal = (delivery) => {
    setSelectedDelivery(delivery);
    setNewRoute(delivery.route);
    setNewDescription(delivery.healthKoiDescription);
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/delivery-history/${selectedDelivery.deliveryId}`,
        {
          route: newRoute,
          healthKoiDescription: newDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setDeliveries((prevDeliveries) =>
          prevDeliveries.map((delivery) =>
            delivery.deliveryId === selectedDelivery.deliveryId
              ? {
                  ...delivery,
                  route: newRoute,
                  healthKoiDescription: newDescription,
                }
              : delivery
          )
        );
        message.success("Delivery updated successfully");
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating delivery:", error);
      setError("Failed to update delivery data.");
      message.error("Failed to update delivery");
    }
  };

  const handleDelete = (deliveryId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this delivery?",
      content: "This action cannot be undone.",
      onOk: () => deleteDelivery(deliveryId),
      onCancel() {},
    });
  };

  const deleteDelivery = async (deliveryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/delivery-history/${deliveryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Remove the deleted delivery from the state
        setDeliveries((prevDeliveries) =>
          prevDeliveries.filter(
            (delivery) => delivery.deliveryId !== deliveryId
          )
        );
        message.success("Delivery deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting delivery:", error);
      setError("Failed to delete delivery.");
      message.error("Failed to delete delivery");
    }
  };

  const showAddModal = () => {
    setNewDeliveryRoute("");
    setNewDeliveryDescription("");
    setIsAddModalVisible(true);
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/delivery-history/${bookingId}`,
        {
          route: newDeliveryRoute,
          healthKoiDescription: newDeliveryDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Delivery added successfully");
        setIsAddModalVisible(false);
        // Gọi lại hàm deliveryList để cập nhật danh sách
        await deliveryList();
      }
    } catch (error) {
      console.error("Error adding delivery:", error);
      setError("Failed to add delivery data.");
      message.error("Failed to add delivery");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#f0f2f5",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Delivery History
      </Title>

      {role === "DELIVERING_STAFF" && (
        <Button
          type="primary"
          onClick={showAddModal}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
          }}
        >
          Add New Delivery
        </Button>
      )}

      {loading ? (
        <Spin
          tip="Loading..."
          style={{ display: "block", margin: "20px auto" }}
        />
      ) : error ? (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      ) : (
        <>
          <Steps
            progressDot
            current={deliveries.length - 1}
            items={deliveries.map((delivery) => ({
              title: delivery.route,
            }))}
          />
          <Divider />
          {deliveries.map((delivery, index) => (
            <div
              key={delivery.deliveryId}
              style={{
                marginBottom: "20px",
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Steps
                progressDot
                current={0}
                direction="vertical"
                items={[
                  {
                    title: `${delivery.route} - ${formatDateTime(
                      delivery.time
                    )}`,
                    description: `Handled by: ${delivery.staffName} - ${delivery.healthKoiDescription}`,
                  },
                ]}
              />
              {role === "DELIVERING_STAFF" && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    type="link"
                    onClick={() => showUpdateModal(delivery)}
                    style={{ marginRight: 8 }}
                  >
                    Update
                  </Button>
                  <Button
                    type="link"
                    danger
                    onClick={() => handleDelete(delivery.deliveryId)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </>
      )}
      <Modal
        title="Add New Delivery"
        visible={isAddModalVisible}
        onOk={handleAdd}
        onCancel={() => setIsAddModalVisible(false)}
      >
        <Input
          value={newDeliveryRoute}
          onChange={(e) => setNewDeliveryRoute(e.target.value)}
          placeholder="New Route"
          style={{ marginBottom: 16 }}
        />
        <Input.TextArea
          value={newDeliveryDescription}
          onChange={(e) => setNewDeliveryDescription(e.target.value)}
          placeholder="Health Koi Description"
          rows={4}
        />
      </Modal>
      <Modal
        title="Update Delivery"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={newRoute}
          onChange={(e) => setNewRoute(e.target.value)}
          placeholder="New Route"
          style={{ marginBottom: 16 }}
        />
        <Input.TextArea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="New Health Koi Description"
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default Delivery;
