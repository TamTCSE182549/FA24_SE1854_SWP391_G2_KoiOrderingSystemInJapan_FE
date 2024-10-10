import React, { useContext, useState } from "react";
import { Input, Button, Avatar, Typography, Select } from "antd";
import { jwtDecode } from "jwt-decode";
// import { AuthContext } from "../../components/LoginAndSignIn/AuthContext"; // Import AuthContext to access the logged-in user
import { UserOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { Option } = Select;
import { useCookies } from "react-cookie";
const Profile = () => {
  const [email, setEmail] = useState(null);
  const [name, setName] = useState("John Doe"); // Default value for the name
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const decodedToken = jwtDecode(token);
  // State for managing profile information editing
  const [userInfo, setUserInfo] = useState({
    name: decodedToken.lastname,
    surname: decodedToken.firstname,
    email: decodedToken.email,
    phone: "",
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    state: "",
    area: "",
    education: "",
    country: "Vietnam",
    region: "",
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
  }, [navigate]);

  // If the user is not logged in, redirect to login
  if (token == null) {
    navigate("/Login");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-4 relative">
          {/* Avatar Section */}
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
      </div>

      <div className="profile-info">
        <Text strong>Name:</Text>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)} // Update name state on change
          style={{ marginTop: "10px" }}
        />
      </div>

      <div
        className="profile-actions"
        style={{ marginTop: "20px", textAlign: "center" }}
      >
        <Button type="primary" icon={<CheckOutlined />} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
