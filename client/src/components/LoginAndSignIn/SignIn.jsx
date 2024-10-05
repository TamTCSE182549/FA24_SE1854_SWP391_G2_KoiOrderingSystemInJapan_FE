import React from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSignInSuccess = () => {
    navigate("/"); // Điều hướng về trang đăng nhập
  };

  const handleNavigateToLogin = () => {
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Sign up
        </h2>
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              className="bg-gray-700 text-white"
              placeholder="Enter your username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              className="bg-gray-700 text-white"
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
              className="bg-gray-700 text-white"
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              className="bg-gray-700 text-white"
              placeholder="Confirm your password"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-cyan-500 text-white"
              onClick={handleSignInSuccess}
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-white my-4">
          <span>Already have an account?</span>
          <span
            className="text-cyan-500 hover:underline ml-2 cursor-pointer"
            onClick={handleNavigateToLogin}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
