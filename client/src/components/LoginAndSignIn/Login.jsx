import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Cookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const navigate = useNavigate();
  const cookies = new Cookies();
  const clientId =
    "738391852199-e9cllf84bulqf7hsbgl5i7gofq1vrb8o.apps.googleusercontent.com";

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        email: values.email,
        password: values.password,
      });

      if (response.status === 200) {
        const decoded = jwtDecode(response.data.token);
        cookies.set("token", response.data.token, {
          expires: new Date(decoded.exp * 1000),
        });
        toast.success("Login successful!");

        navigateBasedOnRole(decoded.role);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data || "An error occurred during login.";
        toast.error(errorMessage);
      } else {
        toast.error("An unknown error occurred during login.");
      }
    }
  };

  const navigateBasedOnRole = (role) => {
    if (role === "CUSTOMER") {
      navigate("/");
    } else if (role === "MANAGER") {
      navigate("/admin/dashboard");
    } else if (
      ["SALES_STAFF", "DELIVERING_STAFF", "CONSULTING_STAFF"].includes(role)
    ) {
      navigate("/staff/dashboard");
    } else {
      toast.error("Unauthorized role");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleNavigateToSignIn = () => {
    navigate("/SignIn");
  };

  const handleNavigateToForgotPassword = () => {
    navigate("/forgotpassword");
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post("http://localhost:8080/api/google", {
        token: credentialResponse.credential,
      });

      if (response.status === 200) {
        const decoded = jwtDecode(response.data.token);
        cookies.set("token", response.data.token, {
          expires: new Date(decoded.exp * 1000),
          path: "/",
          secure: true,
          sameSite: "None",
        });
        toast.success("Google login successful!");

        navigateBasedOnRole(decoded.role);
      } else {
        throw new Error(
          response.data?.message || "Google login failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data || "An error occurred during Google login.";
        toast.error(errorMessage);
      } else {
        toast.error(
          error.message || "An unknown error occurred during Google login."
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white mt-36 mb-36 p-10 rounded-2xl shadow-2xl w-full max-w-md transform hover:scale-[1.02] transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome
          </h2>
          <p className="text-gray-500 mt-2">Please sign in to continue</p>
        </div>

        <ToastContainer />
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-gray-700 font-medium">Email</span>}
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              className="rounded-lg border-gray-300 hover:border-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
              size="large"
              prefix={<i className="fas fa-envelope text-gray-400 mr-2" />}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700 font-medium">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              className="rounded-lg border-gray-300 hover:border-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              size="large"
              prefix={<i className="fas fa-lock text-gray-400 mr-2" />}
            />
          </Form.Item>

          <div className="flex justify-between items-center mb-6">
            <Checkbox className="text-gray-600 hover:text-blue-600">
              Remember me
            </Checkbox>
            <span
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
              onClick={handleNavigateToForgotPassword}
            >
              Forgot password?
            </span>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-gray-500 text-sm">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => toast.error("Google login failed")}
              useOneTap
              shape="pill"
              size="large"
              width={350}
              theme="filled_blue"
            />
          </GoogleOAuthProvider>
        </div>

        <div className="text-center text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
            onClick={handleNavigateToSignIn}
          >
            Sign up now
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
