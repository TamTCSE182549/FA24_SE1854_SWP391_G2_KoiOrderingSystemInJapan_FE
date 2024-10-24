import React, { useState, useEffect } from "react";
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
  const [user, setUser] = useState(null);
  const clientId =
    "738391852199-e9cllf84bulqf7hsbgl5i7gofq1vrb8o.apps.googleusercontent.com";

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        email: values.email,
        password: values.password,
      });
      const decoded = jwtDecode(response.data.token);
      setUser(decoded);
      console.log(decoded);

      if (response.status === 200) {
        cookies.set("token", response.data.token, {
          expires: new Date(decoded.exp * 1000),
        });
        toast.success("Login successful!");
        navigate("/");
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

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

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
        console.log(credentialResponse);
        const decoded = jwtDecode(response.data.token);
        console.log(decoded);
        cookies.set("token", response.data.token, {
          expires: new Date(decoded.exp * 1000), // Ensure the expiry is set correctly
          path: "/", // Ensure the cookie is available to all pages
          secure: true, // Use secure cookies if your site is HTTPS
          sameSite: "None", // Adjust SameSite attribute if needed
        });
        toast.success("Google login successful!");
        navigate("/");
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="backdrop-filter backdrop-blur-3xl p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Log In
        </h2>
        <ToastContainer />
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
              className="bg-white text-black"
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
              className="bg-white text-black"
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <div className="flex justify-between items-center text-white">
            <Checkbox className="text-white">Remember me</Checkbox>
            <span
              className="text-white hover:underline ml-2 cursor-pointer"
              onClick={handleNavigateToForgotPassword}
            >
              Forgot password?
            </span>
          </div>

          <Form.Item className="mt-6">
            <Button
              type="custom"
              htmlType="submit"
              className="w-full backdrop-filter backdrop-blur-3xl text-white hover:bg-gradient-to-r from-green-600 to-green-950 hover:scale-105 transition-all duration-300 border border-white"
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-white my-4">Or Login with</div>

        <div className="flex justify-center gap-4 mb-6">
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => toast.error("Google login failed")}
              useOneTap
              shape={"square"}
              size={"large"}
              width={390}
            />
          </GoogleOAuthProvider>
        </div>

        <div className="text-center">
          <span className="text-white">Don't have an account?</span>
          <span
            className="text-white hover:underline ml-2 cursor-pointer"
            onClick={handleNavigateToSignIn}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
