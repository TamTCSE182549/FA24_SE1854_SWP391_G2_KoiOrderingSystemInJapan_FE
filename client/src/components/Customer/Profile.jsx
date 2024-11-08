import React, { useState, useEffect } from "react";
import { Input, Button, Avatar, Typography, Select, message } from "antd";
import { jwtDecode } from "jwt-decode";
import { UserOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

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
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">{label}</h4>
          <Select
            value={editedInfo[field] !== undefined ? editedInfo[field] : userInfo[field]}
            onChange={(value) => handleChange(field, value)}
            className="w-full"
            size="large"
            style={{ borderRadius: '0.5rem' }}
          >
            <Option value="MALE">Male</Option>
            <Option value="FEMALE">Female</Option>
            <Option value="OTHER">Other</Option>
          </Select>
        </div>
      );
    } else if (field === "nationality") {
      return (
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">{label}</h4>
          <Select
            value={editedInfo[field] !== undefined ? editedInfo[field] : userInfo[field]}
            onChange={(value) => handleChange(field, value)}
            className="w-full"
            size="large"
            style={{ borderRadius: '0.5rem' }}
          >
            <Option value="Vietnam">Vietnam</Option>
            <Option value="Japan">Japan</Option>
            <Option value="America">America</Option>
            <Option value="Laos">Laos</Option>
            <Option value="Indonesia">Indonesia</Option>
            <Option value="India">India</Option>
          </Select>
        </div>
      );
    }
    return (
      <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{label}</h4>
        <Input
          type={type}
          name={field}
          value={editedInfo[field] !== undefined ? editedInfo[field] : userInfo[field]}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          size="large"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-40 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-10">
            <div className="flex items-center space-x-8">
              <div className="relative">
                <Avatar 
                  size={96} 
                  icon={<UserOutlined className="text-2xl" />} 
                  className="border-4 border-white shadow-lg ring-4 ring-blue-400 ring-opacity-50"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition-colors duration-200">
                  <EditOutlined className="text-white text-sm" />
                </div>
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold tracking-tight">
                  {userInfo.firstName} {userInfo.lastName}
                </h2>
                <p className="text-blue-100 mt-1 flex items-center">
                  <span className="mr-2">✉️</span>
                  {userInfo.email}
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Personal Details</h2>
              {isEditing && (
                <Button
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  type="primary"
                  size="large"
                  className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 rounded-lg px-6 h-12 flex items-center"
                >
                  <span className="ml-2">Save Changes</span>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderField("First Name", "firstName")}
              {renderField("Last Name", "lastName")}
              {renderField("Phone number", "phone", "tel")}
              {renderField("Address", "address")}
              {renderField("Gender", "gender")}
              {renderField("Nationality", "nationality")}
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <UserOutlined className="text-xl text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Account Status</h3>
                <p className="text-sm text-gray-500">Your account is active and verified</p>
              </div>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-full">
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoogleMapComponent = ({ country }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" // Thay thế bằng API key của bạn
  });

  const countryCoordinates = {
    Vietnam: { lat: 14.0583, lng: 108.2772, zoom: 5 },
    Japan: { lat: 36.2048, lng: 138.2529, zoom: 5 },
    America: { lat: 37.0902, lng: -95.7129, zoom: 4 },
    India: { lat: 20.5937, lng: 78.9629, zoom: 4 },
    Indonesia: { lat: -0.7893, lng: 113.9213, zoom: 4 },
    Laos: { lat: 19.8563, lng: 102.4955, zoom: 6 }
  };

  const coords = countryCoordinates[country] || countryCoordinates.Vietnam;

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '400px',
        borderRadius: '0.5rem'
      }}
      center={{ lat: coords.lat, lng: coords.lng }}
      zoom={coords.zoom}
      options={{
        styles: [
          {
            featureType: "administrative.country",
            elementType: "geometry",
            stylers: [
              {
                visibility: "on"
              },
              {
                weight: 2
              }
            ]
          }
        ]
      }}
    >
      <Marker position={{ lat: coords.lat, lng: coords.lng }} />
    </GoogleMap>
  );
};

export default Profile;
