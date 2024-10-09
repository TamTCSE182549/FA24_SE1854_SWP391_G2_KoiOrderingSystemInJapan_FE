import React, { useState, useEffect } from "react";
import { Input, Button, Avatar, Typography } from "antd";
import { UserOutlined, CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const Profile = () => {
  const [email, setEmail] = useState(null);
  const [name, setName] = useState("John Doe"); // Default value for the name
  const navigate = useNavigate();

  // Load the email from localStorage when the component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate("/Login"); // Redirect to login if no email is found
    }
  }, [navigate]);

  // Save updated profile information
  const handleSave = () => {
    // Example: Save the updated name to the backend or localStorage
    console.log("Updated profile:", { email, name });
    // Here, you'd typically send the updated data to the server
  };

  return (
    <div
      className="profile-container"
      style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
    >
      <div
        className="profile-avatar"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        <Avatar size={100} icon={<UserOutlined />} />
        <div style={{ marginTop: "10px" }}>
          <Text strong>{email}</Text> {/* Display logged-in email */}
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
