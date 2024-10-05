import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleNavigateToSignIn = () => {
    navigate("/SignIn"); // Điều hướng về trang đăng nhập
  };
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Sign in
        </h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              className="bg-gray-700 text-black"
              placeholder="your@email.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              className="bg-gray-700 text-black"
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <div className="flex justify-between items-center text-white">
            <Checkbox>Remember me</Checkbox>
            <a href="#" className="text-cyan-500 hover:underline">
              Forgot your password?
            </a>
          </div>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-cyan-500 text-white"
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-white my-4">Or Login with</div>

        <div className="flex justify-center gap-4 mb-6">
          <button className="bg-white p-3 rounded-full flex items-center justify-center shadow hover:scale-105 transition-transform">
            <FcGoogle className="text-2xl" />
          </button>
          <button className="bg-blue-600 p-3 rounded-full flex items-center justify-center shadow hover:scale-105 transition-transform">
            <FaFacebook className="text-white text-2xl" />
          </button>
        </div>

        <div className="text-center">
          <span className="text-white">Don't have an account?</span>
          <span
            className="text-cyan-500 hover:underline ml-2 cursor-pointer"
            onClick={handleNavigateToSignIn}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
