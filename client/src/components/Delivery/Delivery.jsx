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
import { useParams, useNavigate } from "react-router-dom";
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
  updateDeliveryHistory,
} from "../../services/deliveryService"; // Import the service functions
import { LeftOutlined } from "@ant-design/icons"; // Thêm import này

const { Title, Text } = Typography;
const { Option } = Select;

const ROUTE_OPTIONS = {
  TAKE_KOI_AT_FARM: "Take Koi at Farm",
  DEPARTING_FROM_JAPAN: "Departing from Japan",
  ARRIVED_YOUR_COUNTRY: "Arrived Your Country",
  IN_LOCAL_TRANSIT: "In Local Transit",
  DELIVERED_TO_CUSTOMER: "Delivered to Customer",
};

const Delivery = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const { bookingId } = useParams();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;

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
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [checkoutAddress, setCheckoutAddress] = useState("");

  const navigate = useNavigate();

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
      // message.error("Failed to fetch checkout information");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await deliveryList();
      await fetchCheckoutInfo();
    };

    fetchData();

    // Cleanup function
    return () => {
      setDeliveries([]);
      setCheckoutInfo(null);
      setError(null);
    };
  }, [bookingId, token]); // Ensure the dependency array is empty to run only once on mount

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
    setIsUpdateModalVisible(true);
  };

  const handleUpdate = async () => {
    const routeError = validateRoute(newRoute);
    const descriptionError = validateDescription(newDescription);

    if (routeError) {
      message.error(routeError);
      return;
    }
    if (descriptionError) {
      message.error(descriptionError);
      return;
    }

    try {
      await updateDeliveryHistory(
        selectedDelivery.deliveryId,
        {
          route: newRoute,
          healthKoiDescription: newDescription.trim(),
        },
        token
      );
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.deliveryId === selectedDelivery.deliveryId
            ? {
                ...delivery,
                route: newRoute,
                healthKoiDescription: newDescription.trim(),
              }
            : delivery
        )
      );
      message.success("Delivery updated successfully");
      setIsUpdateModalVisible(false);
    } catch (error) {
      console.error("Error updating delivery:", error);
      message.error(error.response?.data || "Failed to update delivery");
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

  const validateRoute = (route) => {
    if (!route) {
      return "Route is required";
    }
    if (!Object.keys(ROUTE_OPTIONS).includes(route)) {
      return "Invalid route selected";
    }
    return null;
  };

  const validateDescription = (description) => {
    if (!description || !description.trim()) {
      return "Health description is required";
    }
    if (description.length > 500) {
      return "Description cannot exceed 500 characters";
    }
    return null;
  };

  const validateCheckout = (data) => {
    const errors = {};

    if (!data.customerName || !data.customerName.trim()) {
      errors.customerName = "Customer name is required";
    } else if (data.customerName.length > 50) {
      errors.customerName = "Customer name cannot exceed 50 characters";
    }

    if (!data.receiveDate) {
      errors.receiveDate = "Receive date is required";
    } else {
      const currentDate = new Date();
      const selectedDate = new Date(data.receiveDate);
      // if (selectedDate < currentDate) {
      //   errors.receiveDate = "Receive date cannot be in the past";
      // }
    }

    if (!data.healthKoiDescription || !data.healthKoiDescription.trim()) {
      errors.healthKoiDescription = "Health description is required";
    }

    if (!data.status) {
      errors.status = "Status is required";
    }

    if (data.status === "CANCELLED" && (!data.reason || !data.reason.trim())) {
      errors.reason = "Reason is required for cancelled status";
    }

    // if (!data.address || !data.address.trim()) {
    //   errors.address = "Address is required";
    // } else if (data.address.length > 200) {
    //   errors.address = "Address cannot exceed 200 characters";
    // }

    if (data.reason && data.reason.length > 200) {
      errors.reason = "Reason cannot exceed 200 characters";
    }

    return errors;
  };

  const handleAdd = async () => {
    const routeError = validateRoute(newDeliveryRoute);
    const descriptionError = validateDescription(newDeliveryDescription);

    if (routeError) {
      message.error(routeError);
      return;
    }
    if (descriptionError) {
      message.error(descriptionError);
      return;
    }

    try {
      await addDelivery(
        bookingId,
        {
          route: newDeliveryRoute,
          healthKoiDescription: newDeliveryDescription.trim(),
        },
        token
      );
      message.success("Delivery added successfully");
      setIsAddModalVisible(false);
      await deliveryList();
    } catch (error) {
      console.error("Error adding delivery:", error);
      message.error(error.response?.data || "Failed to add delivery");
    }
  };

  const handleCheckout = async () => {
    const checkoutData = {
      customerName: checkoutCustomerName,
      receiveDate: checkoutReceiveDate,
      healthKoiDescription: checkoutHealthDescription,
      status: checkoutStatus,
      reason: checkoutReason,
    };

    const errors = validateCheckout(checkoutData);

    if (Object.keys(errors).length > 0) {
      // Hiển thị lỗi đầu tiên tìm thấy
      message.error(Object.values(errors)[0]);
      return;
    }

    try {
      await checkoutDelivery(bookingId, checkoutData, token);
      message.success("Delivery checked out successfully");
      setIsCheckoutModalVisible(false);
      await fetchCheckoutInfo();
      setCheckoutReason("");
    } catch (error) {
      console.error("Error checking out delivery:", error);
      message.error(error.response?.data || "Failed to checkout delivery");
    }
  };

  const handleUpdateCheckout = async () => {
    try {
      const payload = {
        customerName: checkoutCustomerName,
        receiveDate: checkoutReceiveDate,
        healthKoiDescription: checkoutHealthDescription,
        status: checkoutStatus,
        reason: checkoutReason,
        address: checkoutAddress,
      };

      await updateDelivery(bookingId, payload, token);
      message.success("Checkout information updated successfully");
      setIsUpdateCheckoutModalVisible(false);
      await fetchCheckoutInfo();
    } catch (error) {
      console.error("Error updating checkout info:", error);
      message.error("Failed to update checkout information");
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
      setCheckoutAddress(checkoutInfo.address || "");
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

  // Thêm helper function để format route text
  const formatRouteText = (route) => {
    return ROUTE_OPTIONS[route]?.split(" ").join("\n") || route;
  };

  // Reset states when closing modals
  const handleCloseModals = () => {
    setIsCheckoutModalVisible(false);
    setIsUpdateCheckoutModalVisible(false);
    setIsAddModalVisible(false);
    setIsUpdateModalVisible(false);
    setCheckoutCustomerName("");
    setCheckoutReceiveDate(null);
    setCheckoutHealthDescription("");
    setCheckoutStatus("");
    setCheckoutReason("");
    setCheckoutAddress("");
    setNewDeliveryRoute("");
    setNewDeliveryDescription("");
  };

  return (
    <div
      className="mt-60"
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "100px auto",
        backgroundColor: "#f0f2f5",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <Button
        type="default"
        onClick={() => navigate(-1)}
        icon={<LeftOutlined />}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          display: "flex",
          alignItems: "center",
          padding: "4px 15px",
          borderRadius: "6px",
          transition: "all 0.3s",
          backgroundColor: "#fff",
          border: "1px solid #d9d9d9",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
        className="hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
      >
        <span style={{ marginLeft: "4px" }}>Back</span>
      </Button>

      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Delivery History
      </Title>

      {role === "DELIVERING_STAFF" && !checkoutInfo && (
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
              title: (
                <div
                  className="step-title"
                  style={{
                    whiteSpace: "pre-line",
                    fontSize: "12px",
                    lineHeight: "1.2",
                    textAlign: "center",
                    maxWidth: "120px", // Điu chỉnh độ rộng phù hợp
                    margin: "0 auto",
                  }}
                >
                  {ROUTE_OPTIONS[delivery.route]}
                </div>
              ),
              description: formatDateTime(delivery.createdDate), // Thêm ngày tháng nếu cần
            }))}
            style={{
              margin: "20px 0",
              padding: "20px 0",
            }}
          />
          <style jsx>{`
            .ant-steps-item-title {
              padding-right: 0 !important;
            }

            .ant-steps-item {
              padding: 0 0px !important;
            }

            .step-title {
              position: relative;
              top: 8px;
            }

            @media (max-width: 768px) {
              .step-title {
                font-size: 10px !important;
              }
            }
          `}</style>
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
              {role === "DELIVERING_STAFF" && !checkoutInfo && (
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

      {checkoutInfo && (
        <Card
          title="Checkout Information"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Text>
              <strong>Customer Name: </strong> {checkoutInfo.customerName}
            </Text>
            <Text>
              <strong>Delivery Date: </strong>{" "}
              {formatDateTime(checkoutInfo.receiveDate)}
            </Text>
            <Text>
              <strong>Koi Health: </strong> {checkoutInfo.healthKoiDescription}
            </Text>
            <Text>
              <strong>Delivery Status: </strong> {checkoutInfo.status}
            </Text>
            <Text>
              <strong>Payment Amount: </strong>
              {checkoutInfo.remainAmount}
            </Text>
            <Text>
              <strong>Address: </strong>
              {checkoutInfo.address}
            </Text>
            <Text>
              <strong>Delivery Staff: </strong> {checkoutInfo.staffName}
            </Text>
            {checkoutInfo.reason && (
              <Text>
                <strong>Reason: </strong> {checkoutInfo.reason}
              </Text>
            )}
          </div>
        </Card>
      )}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {!loading &&
          !error &&
          deliveries.length > 0 &&
          role === "DELIVERING_STAFF" && (
            <>
              {!checkoutInfo && (
                <Button
                  type="primary"
                  size="large"
                  onClick={showCheckoutModal}
                  style={{ marginRight: "10px" }}
                >
                  Checkout Delivery
                </Button>
              )}

              {checkoutInfo && (
                <Button
                  type="default"
                  size="large"
                  onClick={showUpdateCheckoutModal}
                  style={{ marginRight: "10px" }}
                >
                  Update Checkout Info
                </Button>
              )}
            </>
          )}
        {role === "DELIVERING_STAFF" && (
          <Button
            type="default"
            size="large"
            onClick={() => navigate("/staff/booking-koi-for-delivery")}
          >
            Back to Booking For Koi
          </Button>
        )}
      </div>

      {/* Back to BookingForKoi Button */}

      {/* Checkout Modal */}
      <Modal
        title="Checkout Delivery"
        visible={isCheckoutModalVisible}
        onOk={handleCheckout}
        onCancel={handleCloseModals}
      >
        <Input
          value={checkoutCustomerName}
          onChange={(e) => setCheckoutCustomerName(e.target.value)}
          placeholder="Customer Name"
          style={{ marginBottom: 16 }}
        />
        <DatePicker
          value={checkoutReceiveDate ? moment(checkoutReceiveDate) : null}
          onChange={(date) => {
            setCheckoutReceiveDate(date ? date.toDate() : null);
          }}
          style={{ marginBottom: 16, width: "100%" }}
          placeholder="Receive Date"
          showTime={{ format: "HH:mm" }}
          format="DD/MM/YYYY HH:mm"
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

      {/* Update Checkout Modal */}
      <Modal
        title="Update Checkout Information"
        visible={isUpdateCheckoutModalVisible}
        onOk={handleUpdateCheckout}
        onCancel={handleCloseModals}
      >
        <Input
          value={checkoutCustomerName}
          onChange={(e) => setCheckoutCustomerName(e.target.value)}
          placeholder="Customer Name"
          style={{ marginBottom: 16 }}
        />
        <DatePicker
          value={checkoutReceiveDate ? moment(checkoutReceiveDate) : null}
          onChange={(date) => {
            setCheckoutReceiveDate(date ? date.toDate() : null);
          }}
          style={{ marginBottom: 16, width: "100%" }}
          placeholder="Receive Date"
          showTime={{ format: "HH:mm" }}
          format="DD/MM/YYYY HH:mm"
        />
        <Input.TextArea
          value={checkoutHealthDescription}
          onChange={(e) => setCheckoutHealthDescription(e.target.value)}
          placeholder="Health Koi Description"
          rows={4}
          style={{ marginBottom: 16 }}
        />
        <Input.TextArea
          value={checkoutAddress}
          onChange={(e) => setCheckoutAddress(e.target.value)}
          placeholder="Delivery Address"
          rows={3}
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

      <Modal
        title="Add New Delivery"
        visible={isAddModalVisible}
        onOk={handleAdd}
        onCancel={handleCloseModals}
      >
        <Select
          value={newDeliveryRoute}
          onChange={(value) => setNewDeliveryRoute(value)}
          placeholder="Select Delivery Route"
          style={{ width: "100%", marginBottom: 16 }}
        >
          {Object.entries(ROUTE_OPTIONS).map(([key, value]) => (
            <Select.Option key={key} value={key}>
              {value}
            </Select.Option>
          ))}
        </Select>
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
        visible={isUpdateModalVisible}
        onOk={handleUpdate}
        onCancel={handleCloseModals}
      >
        <Input.TextArea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Health Koi Description"
          rows={4}
          style={{ marginBottom: 16 }}
        />
      </Modal>
    </div>
  );
};

export default Delivery;
