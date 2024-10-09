import React, { useState, useContext } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LoginSocialFacebook, LoginSocialGoogle } from "reactjs-social-login"; // Import both Facebook and Google login
import { AuthContext } from "../../components/LoginAndSignIn/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from AuthContext
  const [profile, setProfile] = useState(null);

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleNavigateToSignIn = () => {
    navigate("/SignIn");
  };

  const handleSignIn = () => {
    navigate("/loginfacebook");
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
          {/* Google Login */}
          <div>
            {!profile ? (
              <LoginSocialGoogle
                client_id={
                  "1032030181299-td4b61j969gpaqp8ogt17ptva75gbupq.apps.googleusercontent.com"
                }
                scope="openid profile email"
                discoveryDocs="claims_supported"
                access_type="offline"
                onResolve={({ provider, data }) => {
                  console.log(provider, data);
                  setProfile(provider.data); // Set the profile data from Google login
                  login(provider.data); // Set login status and profile in context
                  navigate("/");
                  // Navigate after login
                }}
                onReject={(err) => {
                  console.log(err);
                }}
              >
                <button className="bg-white p-3 rounded-full flex items-center justify-center shadow hover:scale-105 transition-transform">
                  <FcGoogle className="text-2xl" />
                </button>
              </LoginSocialGoogle>
            ) : (
              ""
            )}
          </div>

          {/* Facebook Login */}
          <div>
            {!profile ? (
              <LoginSocialFacebook
                appId="521169357292851"
                onResolve={(response) => {
                  console.log(response);

                  // Lưu profile vào state
                  setProfile(response.data);

                  // Gọi hàm login để lưu trạng thái người dùng trong context hoặc state
                  login(response.data);

                  // Lấy access token từ phản hồi đăng nhập
                  const accessToken = response.data.accessToken; // Kiểm tra xem token nằm ở đâu trong response

                  // Lưu token vào localStorage hoặc sessionStorage
                  if (accessToken) {
                    localStorage.setItem("facebookAccessToken", accessToken);
                    console.log("Facebook Access Token:", accessToken);
                  }

                  // Điều hướng sau khi đăng nhập thành công
                  navigate("/");
                }}
                onReject={(error) => {
                  console.log(error);
                }}
              >
                <button className="bg-blue-600 p-3 rounded-full flex items-center justify-center shadow hover:scale-105 transition-transform">
                  <FaFacebook className="text-white text-2xl" />
                </button>
              </LoginSocialFacebook>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Profile Display */}
        {profile ? (
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
        )}

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
