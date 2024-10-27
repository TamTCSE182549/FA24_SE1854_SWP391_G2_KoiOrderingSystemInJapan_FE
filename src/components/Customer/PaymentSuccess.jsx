import React from "react";
import { Button, Card } from "antd";
// import { CheckCircleOutlined } from "@ant-design/icons";

const PaymentSuccess = () => {
  const handleGoBack = () => {
    // Thực hiện hành động chuyển hướng sau khi thanh toán thành công, ví dụ trở về trang chính
    console.log("Redirect to home or another action");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-lg p-8 text-center">
        {/* <CheckCircleOutlined className="text-green-500 text-6xl mb-4" /> */}
        <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-6">
          Thank you for your payment. Your transaction was completed
          successfully.
        </p>

        <Button
          type="primary"
          onClick={handleGoBack}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Go to Home
        </Button>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
