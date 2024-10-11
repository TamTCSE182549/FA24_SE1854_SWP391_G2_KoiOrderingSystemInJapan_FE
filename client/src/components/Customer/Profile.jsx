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
    name: decodedToken.last_name,
    surname: decodedToken.first_name,
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
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        avatar: reader.result, // Update avatar in base64 format
      }));
    };
    if (file) {
      reader.readAsDataURL(file); // Convert the uploaded file to base64
    }
  };

  // If the user is not logged in, redirect to login
  if (token == null) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-6 min-h-screen flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex items-center space-x-4 mb-6">
          {/* Avatar */}
          <Avatar size={64} icon={<UserOutlined />} />
          {/* User Name next to Avatar */}
          <div>
            <h2 className="text-2xl font-bold text-black">
              {userInfo.name} {userInfo.surname}
            </h2>
            <p className="text-gray-500">{userInfo.email}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Personal details</h2>
        <p className="text-gray-600 mb-6">
          Update your information and find out how it's used.
        </p>

        <div className="grid grid-cols-1 gap-6">
          {/* Name */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h4 className="text-sm text-gray-500">Name</h4>
              <div>
                <p className="text-black">{userInfo.name}</p>
              </div>
            </div>
            <Button type="link">Edit</Button>
          </div>

          {/* Display Name */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h4 className="text-sm text-gray-500">Display name</h4>
              <p>{userInfo.displayName}</p>
            </div>
            <Button type="link">Edit</Button>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h4 className="text-sm text-gray-500">Email address</h4>
              <p>
                {userInfo.email}{" "}
                <span className="text-green-600">Verified</span>
              </p>
              <p className="text-xs text-gray-400">
                This is the email address you use to sign in. It’s also where we
                send your booking confirmations.
              </p>
            </div>
            <Button type="link">Edit</Button>
          </div>

          {/* Phone */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h4 className="text-sm text-gray-500">Phone number</h4>
              <p>{userInfo.phone}</p>
              <p className="text-xs text-gray-400">
                Properties or attractions you book will use this number if they
                need to contact you.
              </p>
            </div>
            <Button type="link">Edit</Button>
          </div>

          {/* Date of Birth */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h4 className="text-sm text-gray-500">Date of birth</h4>
              <p>{userInfo.dob}</p>
            </div>
            <Button type="link">Edit</Button>
          </div>

          {/* Nationality */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h4 className="text-sm text-gray-500">Nationality</h4>
              <p>{userInfo.nationality}</p>
            </div>
            <Button type="link">Edit</Button>
          </div>

          {/* Gender */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h4 className="text-sm text-gray-500">Gender</h4>
              <p>{userInfo.gender}</p>
            </div>
            <Button type="link">Edit</Button>
          </div>

          {/* Address */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h4 className="text-sm text-gray-500">Address</h4>
              <p>{userInfo.address}</p>
            </div>
            <Button type="link">Edit</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
