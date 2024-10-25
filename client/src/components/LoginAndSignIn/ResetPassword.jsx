import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");


  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/reset-password`,
        { 
          password: values.newPassword,  // Thay đổi từ newPassword thành password
          confirmPassword: values.newPassword,
          token: token
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      

      if (response.status === 200) {
        if(response.data.token){
          const decoded = jwtDecode(response.data.token);
          setUser(decoded);
          console.log(decoded);
        }
        message.success("Password reset successful!");
        navigate("/login");
      } else {
        throw new Error(response.data.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      message.error(
        error.response?.data?.message ||
          "Password reset failed. Please try again."
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill all required fields correctly.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#c5bd92] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Reset Password
        </h2>
        <Form
          name="reset-password"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please input your new password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password className="bg-white text-black" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password className="bg-white text-black" size="large" />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#b7aa61] text-white hover:bg-[#b7aa59] hover:scale-105 transition-all duration-300"
            >
              Reset Password
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

export default ResetPassword;
