import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/forgot-password`,
        values
      );

      if (response.status === 200) {
        message.success("Password reset instructions sent to your email!");
        navigate("/login");
      } else {
        throw new Error(
          response.data.message || "Password reset request failed"
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      message.error(
        error.response?.data ||
          "Failed to process your request. Please try again."
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please enter a valid email address.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#c5bd92] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Forgot Password
        </h2>
        <Form
          name="forgot-password"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Your email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input className="bg-white text-black" size="large" />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#b7aa61] text-white hover:bg-[#b7aa59] hover:scale-105 transition-all duration-300"
            >
              Send Reset Instructions
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-white my-4">
          <span>Remember your password?</span>
          <span
            className="text-white hover:underline ml-2 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
