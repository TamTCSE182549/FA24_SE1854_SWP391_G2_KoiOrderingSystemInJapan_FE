import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Radio,
  Row,
  Col,
  Typography,
  Divider,
  Form,
  Input,
  message,
} from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

const { Title, Text } = Typography;

const TicketPaymentForm = () => {
  const { id } = useParams();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/bookings/BookingForTour/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          setPaymentInfo(data);

          // Pre-fill the form with data from the response
          form.setFieldsValue({
            fullName: data.nameCus,
            email: data.email, // Ensure this field exists in the response
            phoneNumber: data.phone, // Ensure this field exists in the response
            totalPrice: data.totalAmount,
            totalPriceWithVAT: data.totalAmountWithVAT,
            paymentMethod: data.paymentMethod.toLowerCase(),
          });
        }
      } catch (error) {
        console.error("Error fetching payment information:", error);
        message.error("Failed to fetch payment information.");
      }
    };

    fetchPaymentInfo();
  }, [id, token, form]);

  if (!paymentInfo) {
    return <div>Loading payment information...</div>;
  }

  const handlePayment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/bookings/paymentUrl/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data); // Log the entire response

      if (response.status === 200) {
        console.log(response.data);
        window.location.href = response.data;
        // } else {
        //   console.error("Payment URL is undefined");
        //   message.error("Failed to retrieve VNPay payment URL.");
        // }
      }
    } catch (error) {
      console.error("Error creating VNPay URL:", error);
      message.error("Failed to create VNPay payment URL.");
    }
  };

  return (
    <div style={{ background: "#f0f2f5", padding: "50px 0", paddingTop: "100px" }}>
      <Card style={{ width: 800, margin: "0 auto" }}>
        <Title level={2}>Ticket Payment</Title>
        <Divider />
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={16}>
              <Card title="Personal Information" style={{ marginBottom: 24 }}>
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please input your full name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Card>
              <Card
                title="Payment Method"
                extra={<a href="#">Add new card</a>}
                style={{ marginBottom: 24 }}
              >
                <Form.Item name="paymentMethod" initialValue="visa">
                  <Radio.Group style={{ width: "100%" }}>
                    <Radio.Button
                      value="visa"
                      style={{
                        height: 60,
                        marginBottom: 16,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CreditCardOutlined
                        style={{ fontSize: 20, marginRight: 8 }}
                      />
                      VN Pay
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handlePayment}
                >
                  Pay {paymentInfo.totalAmountWithVAT.toLocaleString()} VND
                </Button>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Order Summary">
                <div style={{ marginBottom: 16 }}>
                  <Text>Ticket Price</Text>
                  <Text style={{ float: "right" }}>
                    {paymentInfo.totalAmount.toLocaleString()} VND
                  </Text>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text>VAT Amount</Text>
                  <Text style={{ float: "right" }}>
                    {paymentInfo.vatAmount.toLocaleString()} VND
                  </Text>
                </div>
                <Divider />
                <div>
                  <Text strong>Total with VAT</Text>
                  <Text strong style={{ float: "right" }}>
                    {paymentInfo.totalAmountWithVAT.toLocaleString()} VND
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default TicketPaymentForm;
