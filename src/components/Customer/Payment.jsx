import React, { useState } from "react";
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
  DatePicker,
} from "antd";
import { CreditCardOutlined, DollarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const TicketPaymentForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onSuccess = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values);
        navigate("/paymentsuccess");
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  return (
    <div style={{ background: "#f0f2f5", padding: "50px 0" }}>
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
                <Form.Item
                  name="dateOfBirth"
                  label="Date of Birth"
                  rules={[
                    {
                      required: true,
                      message: "Please select your date of birth!",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
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
                <Button type="primary" size="large" block onClick={onSuccess}>
                  Pay $50.00
                </Button>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Order Summary">
                <div style={{ marginBottom: 16 }}>
                  <Text>Ticket Price</Text>
                  <Text style={{ float: "right" }}>$50.00</Text>
                </div>
                <Divider />
                <div>
                  <Text strong>Total</Text>
                  <Text strong style={{ float: "right" }}>
                    $50.00
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
