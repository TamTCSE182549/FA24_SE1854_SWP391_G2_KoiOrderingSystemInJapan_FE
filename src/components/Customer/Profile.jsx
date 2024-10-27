import React, { useState, useEffect } from "react";
import { Input, Button, Avatar, Typography, Select, message } from "antd";
import { jwtDecode } from "jwt-decode";
import { UserOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const { Text } = Typography;
const { Option } = Select;

const Profile = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const [userInfo, setUserInfo] = useState({});
  const [editedInfo, setEditedInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      const decodedToken = jwtDecode(token);
      setUserInfo({
        lastName: decodedToken.lastName,
        firstName: decodedToken.firstName,
        email: decodedToken.email,
        phone: decodedToken.phone,
        address: decodedToken.address,
        gender: decodedToken.gender,
        nationality: decodedToken.nationality,
        role: decodedToken.role,
      });
      setEditedInfo({});
    }
  }, [token, navigate]);

  const handleChange = (name, value) => {
    setEditedInfo({ ...editedInfo, [name]: value });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedUser = { ...userInfo, ...editedInfo };
      const response = await axios.put(
        "http://localhost:8080/api/profile/update",
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setUserInfo(updatedUser);
        setEditedInfo({});
        setIsEditing(false);
        message.success("Profile updated successfully");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      message.error("Failed to update. Please try again.");
    }
  };

  const renderField = (label, field, type = "text") => {
    if (field === "gender") {
      return (
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <h4 className="text-sm text-gray-500">{label}</h4>
            <Select
              value={
                editedInfo[field] !== undefined
                  ? editedInfo[field]
                  : userInfo[field]
              }
              onChange={(value) => handleChange(field, value)}
              style={{ width: 120 }}
            >
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
              <Option value="OTHER">Other</Option>
            </Select>
          </div>
        </div>
      );
    } else if (field === "nationality") {
      return (
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <h4 className="text-sm text-gray-500">{label}</h4>
            <Select
              value={
                editedInfo[field] !== undefined
                  ? editedInfo[field]
                  : userInfo[field]
              }
              onChange={(value) => handleChange(field, value)}
              style={{ width: 120 }}
            >
              <Option value="Vietnam">Vietnam</Option>
              <Option value="Japan">Japan</Option>
              <Option value="America">America</Option>
              <Option value="Laos">Laos</Option>
              <Option value="Indonesia">Indonesia</Option>
              <Option value="India">India</Option>
            </Select>
          </div>
        </div>
      );
    }
    return (
      <div className="flex justify-between items-center border-b pb-2">
        <div>
          <h4 className="text-sm text-gray-500">{label}</h4>
          <Input
            type={type}
            name={field}
            value={
              editedInfo[field] !== undefined
                ? editedInfo[field]
                : userInfo[field]
            }
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            className="border-none hover:border-none focus:border-none"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <h2 className="text-2xl font-bold text-gray-500">
              {userInfo.firstName} {userInfo.lastName}
            </h2>
            <p className="text-gray-500">{userInfo.email}</p>
          </div>
        </div>

        <h2 className="text-xl  mb-4 text-gray-500">Personal details</h2>

        <div className="grid grid-cols-1 gap-6">
          {renderField("First Name", "firstName")}
          {renderField("Last Name", "lastName")}
          {renderField("Phone number", "phone", "tel")}
          {renderField("Address", "address")}
          {renderField("Gender", "gender")}
          {renderField("Nationality", "nationality")}
        </div>

        {isEditing && (
          <Button
            icon={<SaveOutlined />}
            onClick={handleSave}
            className="mt-4"
            type="primary"
          >
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
};

export default Profile;
