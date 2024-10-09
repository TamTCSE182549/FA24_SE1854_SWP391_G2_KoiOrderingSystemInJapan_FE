import React, { useContext, useState } from "react";
import { Input, Button, Avatar, Typography, Select } from "antd";
import { AuthContext } from "../../components/LoginAndSignIn/AuthContext"; // Import AuthContext to access the logged-in user
import { UserOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { Option } = Select;

const ProfileView = () => {
  const { userProfile, isLoggedIn } = useContext(AuthContext); // Get user profile and login state from context
  const navigate = useNavigate();

  // State for managing profile information editing
  const [userInfo, setUserInfo] = useState({
    name: userProfile?.name,
    surname: userProfile?.surname,
    email: userProfile?.email,
    phone: "",
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    state: "",
    area: "",
    education: "",
    country: "Vietnam",
    region: "",
    avatar: userProfile?.picture?.data?.url || userProfile?.picture || null, // Use Facebook avatar or default
  });

  const [editingField, setEditingField] = useState(null);

  // Handle saving edited fields
  const handleSave = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
    setEditingField(null);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  // Handle dropdown country change
  const handleCountryChange = (value) => {
    setUserInfo({ ...userInfo, country: value });
  };

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserInfo({ ...userInfo, avatar: reader.result }); // Update avatar in base64 format
    };
    if (file) {
      reader.readAsDataURL(file); // Convert the uploaded file to base64
    }
  };

  // Render form field
  const renderField = (label, field, placeholder, type = "text") => (
    <div className="flex items-center justify-between mb-4">
      <span className="w-1/4 font-semibold">{label}</span>
      <div className="w-2/4">
        {editingField === field ? (
          <Input
            type={type}
            name={field}
            value={userInfo[field]}
            onChange={handleChange}
            className="w-full"
            placeholder={placeholder}
          />
        ) : (
          <Text>{userInfo[field] || placeholder}</Text>
        )}
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={editingField === field ? <CheckOutlined /> : <EditOutlined />}
        onClick={() =>
          editingField === field
            ? handleSave(field, userInfo[field])
            : setEditingField(field)
        }
        className="ml-4"
      />
    </div>
  );

  // Render dropdown for country selection
  const renderCountryField = () => (
    <div className="flex items-center justify-between mb-4">
      <span className="w-1/4 font-semibold">Country</span>
      <div className="w-2/4">
        {editingField === "country" ? (
          <Select
            value={userInfo.country}
            onChange={handleCountryChange}
            className="w-full"
          >
            <Option value="Vietnam">Vietnam</Option>
            <Option value="United States">United States</Option>
            <Option value="Japan">Japan</Option>
            <Option value="France">France</Option>
            <Option value="Germany">Germany</Option>
            <Option value="Canada">Canada</Option>
          </Select>
        ) : (
          <Text>{userInfo.country || "Select your country"}</Text>
        )}
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={editingField === "country" ? <CheckOutlined /> : <EditOutlined />}
        onClick={() =>
          editingField === "country"
            ? handleSave("country", userInfo.country)
            : setEditingField("country")
        }
        className="ml-4"
      />
    </div>
  );

  // If the user is not logged in, redirect to login
  if (!isLoggedIn) {
    navigate("/Login");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-4 relative">
          {/* Avatar Section */}
          <Avatar
            size={100}
            src={userInfo.avatar} // Use avatar from userInfo
            icon={<UserOutlined />}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
            id="avatar-upload"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute top-8 left-24 bg-gray-100 p-1 rounded-full cursor-pointer"
            title="Change Avatar"
          >
            <EditOutlined className="text-gray-700" /> {/* Pencil Icon */}
          </label>
          <div className="ml-6">
            <h2 className="text-3xl font-bold">{userInfo.name}</h2>
            <Text className="text-gray-500">{userInfo.email}</Text>
          </div>
        </div>

        {/* Profile Settings Form */}
        <h2 className="text-3xl font-bold mb-6">Profile Settings</h2>
        <div className="grid grid-cols-2 gap-6">
          {renderField("Name", "name", "Enter your name")}
          {renderField("Surname", "surname", "Enter your surname")}
          {renderField("Mobile Number", "phone", "Enter phone number")}
          {renderField(
            "Address Line 1",
            "addressLine1",
            "Enter address line 1"
          )}
          {renderField(
            "Address Line 2",
            "addressLine2",
            "Enter address line 2"
          )}
          {renderField("Postcode", "postcode", "Enter postcode")}
          {renderField("State", "state", "Enter state")}
          {renderField("Area", "area", "Enter area")}
          {renderField("Email ID", "email", "Enter email", "email")}
          {renderField("Education", "education", "Enter education")}
          {renderCountryField()} {/* Render dropdown for Country */}
          {renderField("State/Region", "region", "Enter region")}
        </div>

        {/* Save Profile Button */}
        <div className="mt-6 text-center">
          <Button type="primary" size="large">
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
