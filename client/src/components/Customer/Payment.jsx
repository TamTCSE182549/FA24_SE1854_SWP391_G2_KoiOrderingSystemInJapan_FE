import React from "react";
import { Form, Input, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const TicketPaymentForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Received values:", values);
    // Thực hiện hành động thêm thẻ
  };

  const onSuccess = () => {
    navigate("/paymentsuccess");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">Settings</h2>

        <h3 className="text-lg font-semibold mb-4">Add new card:</h3>

        <Form
          form={form}
          name="paymentForm"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="cardholderName"
            label={<span className="font-semibold">Card holder name</span>}
            rules={[
              { required: true, message: "Please enter cardholder's name" },
            ]}
          >
            <Input placeholder="Card holder name" />
          </Form.Item>

          <Form.Item
            name="cardNumber"
            label={<span className="font-semibold">Card number</span>}
            rules={[
              { required: true, message: "Please enter your card number" },
            ]}
          >
            <Input placeholder="XXXX-XXXX-XXXX-XXXX" />
          </Form.Item>

          <div className="flex space-x-4">
            <Form.Item
              name="expiryDate"
              label={<span className="font-semibold">Exp. date</span>}
              className="flex-1"
              rules={[
                { required: true, message: "Please enter the expiry date" },
              ]}
            >
              <Input placeholder="MM/YY" />
            </Form.Item>

            <Form.Item
              name="cvv"
              label={<span className="font-semibold">CVV</span>}
              className="flex-1"
              rules={[{ required: true, message: "Please enter CVV" }]}
            >
              <Input placeholder="CVV" />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              onClick={onSuccess}
            >
              Add card
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TicketPaymentForm;
