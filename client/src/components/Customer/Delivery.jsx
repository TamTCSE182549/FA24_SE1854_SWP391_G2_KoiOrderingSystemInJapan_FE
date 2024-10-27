import React, { useEffect, useState } from "react";
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
  Card,
  DatePicker,
  Select,
} from "antd";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import {
  getDeliveryList,
  getCheckoutInfo,
  updateDelivery,
  deleteDelivery,
  addDelivery,
  checkoutDelivery,
} from "../../services/deliveryService"; // Import the service functions

const { Title, Text } = Typography;
const { Option } = Select;

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
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [checkoutCustomerName, setCheckoutCustomerName] = useState("");
  const [checkoutReceiveDate, setCheckoutReceiveDate] = useState(null);
  const [checkoutHealthDescription, setCheckoutHealthDescription] =
    useState("");
  const [checkoutStatus, setCheckoutStatus] = useState("");
  const [isUpdateCheckoutModalVisible, setIsUpdateCheckoutModalVisible] =
    useState(false);
  const [checkoutReason, setCheckoutReason] = useState("");

  const deliveryList = async () => {
    setLoading(true);
    try {
      const data = await getDeliveryList(bookingId, token);
      setDeliveries(data);
    } catch (error) {
      console.error("Error fetching delivery data:", error);
      setError("Failed to fetch delivery data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckoutInfo = async () => {
    try {
      const data = await getCheckoutInfo(bookingId, token);
      setCheckoutInfo(data);
    } catch (error) {
      console.error("Error fetching checkout info:", error);
      message.error("Failed to fetch checkout information");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await deliveryList();
      await fetchCheckoutInfo();
    };

    fetchData();
  }, []); // Ensure the dependency array is empty to run only once on mount

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
      await updateDelivery(
        selectedDelivery.deliveryId,
        { route: newRoute, healthKoiDescription: newDescription },
        token
      );
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
      onOk: async () => {
        try {
          await deleteDelivery(deliveryId, token);
          setDeliveries((prevDeliveries) =>
            prevDeliveries.filter(
              (delivery) => delivery.deliveryId !== deliveryId
            )
          );
          message.success("Delivery deleted successfully");
        } catch (error) {
          console.error("Error deleting delivery:", error);
          setError("Failed to delete delivery.");
          message.error("Failed to delete delivery");
        }
      },
      onCancel() {},
    });
  };

  const handleAdd = async () => {
    try {
      await addDelivery(
        bookingId,
        {
          route: newDeliveryRoute,
          healthKoiDescription: newDeliveryDescription,
        },
        token
      );
      message.success("Delivery added successfully");
      setIsAddModalVisible(false);
      await deliveryList();
    } catch (error) {
      console.error("Error adding delivery:", error);
      setError("Failed to add delivery data.");
      message.error("Failed to add delivery");
    }
  };

  const handleCheckout = async () => {
    if (checkoutStatus === "CANCELLED" && !checkoutReason.trim()) {
      message.error("Please provide a reason for cancellation");
      return;
    }

    try {
      const payload = {
        customerName: checkoutCustomerName,
        receiveDate: checkoutReceiveDate,
        healthKoiDescription: checkoutHealthDescription,
        status: checkoutStatus,
      };

      if (checkoutStatus === "CANCELLED") {
        payload.reason = checkoutReason;
      }

      await checkoutDelivery(bookingId, payload, token);
      message.success("Delivery checked out successfully");
      setIsCheckoutModalVisible(false);
      await fetchCheckoutInfo();
      setCheckoutReason(""); // Reset reason after successful checkout
    } catch (error) {
      console.error("Error checking out delivery:", error);
      message.error("Failed to checkout delivery");
    }
  };

  const showUpdateCheckoutModal = () => {
    if (checkoutInfo) {
      setCheckoutCustomerName(checkoutInfo.customerName);
      setCheckoutReceiveDate(
        checkoutInfo.receiveDate ? new Date(checkoutInfo.receiveDate) : null
      );
      setCheckoutHealthDescription(checkoutInfo.healthKoiDescription);
      setCheckoutStatus(checkoutInfo.status);
      setCheckoutReason(checkoutInfo.reason || "");
    }
    setIsUpdateCheckoutModalVisible(true);
  };

  const showCheckoutModal = () => {
    setIsCheckoutModalVisible(true);
  };

  const showAddModal = () => {
    setNewDeliveryRoute("");
    setNewDeliveryDescription("");
    setIsAddModalVisible(true);
  };

  return (
    <div
      className="mt-40"
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "50px auto",
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
          style={{ position: "absolute", top: "20px", right: "20px" }}
          onClick={showAddModal}
        >
          Add Delivery
        </Button>
      )}

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "0 auto" }} />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : deliveries.length === 0 ? (
        <Alert message="No deliveries found" type="info" showIcon />
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
        title="Add Delivery"
        visible={isAddModalVisible}
        onOk={handleAdd}
        onCancel={() => setIsAddModalVisible(false)}
      >
        <Input
          value={newDeliveryRoute}
          onChange={(e) => setNewDeliveryRoute(e.target.value)}
          placeholder="Route"
          style={{ marginBottom: 16 }}
        />
        <Input.TextArea
          value={newDeliveryDescription}
          onChange={(e) => setNewDeliveryDescription(e.target.value)}
          placeholder="Health Koi Description"
          rows={4}
          style={{ marginBottom: 16 }}
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
          placeholder="Route"
          style={{ marginBottom: 16 }}
        />
        <Input.TextArea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Health Koi Description"
          rows={4}
          style={{ marginBottom: 16 }}
        />
      </Modal>

      <Modal
        title="Checkout Delivery"
        visible={isCheckoutModalVisible}
        onOk={handleCheckout}
        onCancel={() => setIsCheckoutModalVisible(false)}
      >
        <Input
          value={checkoutCustomerName}
          onChange={(e) => setCheckoutCustomerName(e.target.value)}
          placeholder="Customer Name"
          style={{ marginBottom: 16 }}
        />
        <DatePicker
          value={checkoutReceiveDate}
          onChange={(date) => setCheckoutReceiveDate(date)}
          style={{ marginBottom: 16, width: "100%" }}
          placeholder="Receive Date"
        />
        <Input.TextArea
          value={checkoutHealthDescription}
          onChange={(e) => setCheckoutHealthDescription(e.target.value)}
          placeholder="Health Koi Description"
          rows={4}
          style={{ marginBottom: 16 }}
        />
        <Select
          value={checkoutStatus}
          onChange={(value) => setCheckoutStatus(value)}
          style={{ width: "100%", marginBottom: 16 }}
          placeholder="Select Delivery Status"
        >
          <Option value="COMPLETED">COMPLETED</Option>
          <Option value="CANCELLED">CANCELLED</Option>
        </Select>
        {checkoutStatus === "CANCELLED" && (
          <Input.TextArea
            value={checkoutReason}
            onChange={(e) => setCheckoutReason(e.target.value)}
            placeholder="Reason for cancellation"
            rows={4}
            style={{ marginBottom: 16 }}
            required
          />
        )}
      </Modal>

      {checkoutInfo && (
        <Card
          title="Checkout Information"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Text>
              <strong>Customer Name:</strong> {checkoutInfo.customerName}
            </Text>
            <Text>
              <strong>Delivery Date:</strong>{" "}
              {formatDateTime(checkoutInfo.receiveDate)}
            </Text>
            <Text>
              <strong>Koi Health:</strong> {checkoutInfo.healthKoiDescription}
            </Text>
            <Text>
              <strong>Delivery Status:</strong> {checkoutInfo.status}
            </Text>
            <Text>
              <strong>Payment Amount:</strong>
              {checkoutInfo.remainAmount}
            </Text>
            <Text>
              <strong>Delivery Staff:</strong> {checkoutInfo.staffName}
            </Text>
            {checkoutInfo.reason && (
              <Text>
                <strong>Reason:</strong> {checkoutInfo.reason}
              </Text>
            )}
          </div>
        </Card>
      )}

      {!loading &&
        !error &&
        deliveries.length > 0 &&
        role === "DELIVERING_STAFF" && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              onClick={showCheckoutModal}
              style={{ marginRight: "10px" }}
            >
              Checkout Delivery
            </Button>
            {checkoutInfo && (
              <Button
                type="default"
                size="large"
                onClick={showUpdateCheckoutModal}
              >
                Update Checkout Info
              </Button>
            )}
          </div>
        )}

      {/* Update Checkout Modal */}
      <Modal
        title="Update Checkout Information"
        visible={isUpdateCheckoutModalVisible}
        onOk={handleCheckout}
        onCancel={() => setIsUpdateCheckoutModalVisible(false)}
      >
        <Input
          value={checkoutCustomerName}
          onChange={(e) => setCheckoutCustomerName(e.target.value)}
          placeholder="Customer Name"
          style={{ marginBottom: 16 }}
        />
        <DatePicker
          value={checkoutReceiveDate ? moment(checkoutReceiveDate) : null}
          onChange={(date) => setCheckoutReceiveDate(date)}
          style={{ marginBottom: 16, width: "100%" }}
          placeholder="Receive Date"
        />
        <Input.TextArea
          value={checkoutHealthDescription}
          onChange={(e) => setCheckoutHealthDescription(e.target.value)}
          placeholder="Health Koi Description"
          rows={4}
          style={{ marginBottom: 16 }}
        />
        <Select
          value={checkoutStatus}
          onChange={(value) => setCheckoutStatus(value)}
          style={{ width: "100%", marginBottom: 16 }}
          placeholder="Select Delivery Status"
        >
          <Option value="COMPLETED">COMPLETED</Option>
          <Option value="CANCELLED">CANCELLED</Option>
        </Select>
        {checkoutStatus === "CANCELLED" && (
          <Input.TextArea
            value={checkoutReason}
            onChange={(e) => setCheckoutReason(e.target.value)}
            placeholder="Reason for cancellation"
            rows={4}
            style={{ marginBottom: 16 }}
            required
          />
        )}
      </Modal>
    </div>
  );
};

export default Delivery;
