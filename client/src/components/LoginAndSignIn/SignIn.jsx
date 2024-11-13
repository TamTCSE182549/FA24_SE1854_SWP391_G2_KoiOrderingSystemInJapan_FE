import React from "react";
import { Form, Input, Button, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for making API requests

const { Option } = Select;

const SignIn = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Make API call to register user
      const response = await axios.post(
        `http://localhost:8080/api/register`,
        values
      );

      if (response.status === 200) {
        message.success("Registration successful!");
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill all required fields correctly.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-black text-3xl font-bold text-center mb-6">
          Sign up
        </h2>
        <Form
          name="register"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email address!" },
                ]}
              >
                <Input className="bg-white text-black" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long!",
                  },
                ]}
              >
                <Input.Password className="bg-white text-black" size="large" />
              </Form.Item>

              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input className="bg-white text-black" size="large" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  { required: true, message: "Please input your last name!" },
                ]}
              >
                <Input className="bg-white text-black" size="large" />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select your gender!" }]}
              >
                <Select className="bg-white text-black" size="large">
                  <Option value="MALE">Male</Option>
                  <Option value="FEMALE">Female</Option>
                  <Option value="OTHER">Other</Option>
                </Select>
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: "Please input your phone number!" },
                  {
                    pattern: /^(84|0[3|5|7|8|9])\d{8}$/,
                    message: "Please enter a valid phone number!",
                  },
                ]}
              >
                <Input className="bg-white text-black" size="large" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please input your address!" }]}
              >
                <Input.TextArea className="bg-white text-black" size="large" />
              </Form.Item>

              <Form.Item
                name="nationality"
                label="Nationality"
                rules={[
                  { required: true, message: "Please input your nationality!" },
                ]}
              >
                <Input className="bg-white text-black" size="large" />
              </Form.Item>
            </div>
          </div>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-black my-4">
          <span>Already have an account?</span>
          <span
            className="text-black hover:underline ml-2 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
