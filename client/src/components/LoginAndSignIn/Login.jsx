import React, { useState, useContext } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
import { Cookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const Login = () => {
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
        }); // Store the token (if you implement JWT)
        toast.success("Login successful!"); // Notify user of success
        navigate("/"); // Redirect to homepage or another protected route
      } else {
        toast.error(
          response.data?.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "An error occurred during login."
        );
      } else {
        toast.error("An unknown error occurred during login.");
      }
    }
  };

  useEffect(() => {
    if (user) {
      console.log(user); // This will log whenever `user` is updated
    }
  }, [user]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleNavigateToSignIn = () => {
    navigate("/SignIn"); // Điều hướng về trang đăng ký
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log(credentialResponse); // The credential token from Google

    try {
      // Send the token to the backend
      const response = await axios.post("http://localhost:8080/api/google", {
        token: credentialResponse.credential,
      });

      //     console.log("Backend Response:", response.data);
      //     // After successful login, you can store the token or navigate to a protected route
      //     navigate("/");

      //   } catch (error) {
      //     console.error("Error sending credential to backend:", error);
      //   }
      // };
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); // Store token in localStorage
        toast.success("Google login successful!"); // Notify user of success
        navigate("/"); // Redirect to homepage or another protected route
      } else {
        // If the response status is not 200, handle it as an error
        toast.error(
          response.data?.message || "Google login failed. Please try again."
        );
      }
    } catch (error) {
      // Handle Axios-specific errors and general errors
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred during Google login."
        );
      } else {
        toast.error("An unknown error occurred during Google login.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#c5bd92] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Log In
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
            <a href="#" className="text-white hover:underline">
              Forgot your password?
            </a>
          </div>

          <Form.Item className="mt-6">
            <Button
              type="custom"
              htmlType="submit"
              className="w-full bg-[#b7aa61] text-white hover:bg-[#b7aa59] hover:scale-105 transition-all duration-300"
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-white my-4">Or Login with</div>

        <div className="flex justify-center gap-4 mb-6">
          {/* <button className="bg-white p-3 rounded-full flex items-center justify-center shadow hover:scale-105 transition-transform">
            <FcGoogle className="text-2xl" /> */}
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
          {/* </button>
          <button className="bg-blue-600 p-3 rounded-full flex items-center justify-center shadow hover:scale-105 transition-transform">
            <FaFacebook className="text-white text-2xl" />
          </button> */}
        </div>

        {/* Profile Display */}
        {/* {profile ? (
          <div className="mt-4 text-white text-center">
            <h3 className="text-xl font-bold">Welcome, {profile.name}!</h3>
            {profile.picture && (
              <img
                className="mx-auto mt-2 rounded-full"
                src={profile.picture.data?.url || profile.picture}
                alt="Profile Avatar"
                width="100"
                height="100"
              />
            )}
            <p>{profile.email}</p>
          </div>
        ) : (
          ""
        )} */}

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
