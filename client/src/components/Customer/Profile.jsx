import React, { useState } from "react";
import { Input, Button, Typography, Select } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";
import "antd/dist/reset.css"; // Reset CSS của Ant Design để dùng với Tailwind CSS

const { Text } = Typography;
const { Option } = Select;

const Profile = () => {
  // State để lưu thông tin người dùng
  const [userInfo, setUserInfo] = useState({
    name: "Quang Trần",
    displayName: "",
    email: "zxc072004@gmail.com",
    phone: "",
    dob: "",
    nationality: "Vietnam",
    gender: "",
    address: "",
    passportDetails: "",
  });

  // State để theo dõi trường nào đang được chỉnh sửa
  const [editingField, setEditingField] = useState(null);

  // Hàm xử lý khi người dùng muốn chỉnh sửa một trường
  const handleEdit = (field) => {
    setEditingField(field);
  };

  // Hàm xử lý lưu thông tin sau khi chỉnh sửa
  const handleSave = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
    setEditingField(null);
  };

  // Hàm xử lý khi giá trị trong input thay đổi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  // Hàm xử lý thay đổi trong dropdown quốc gia
  const handleNationalityChange = (value) => {
    setUserInfo({ ...userInfo, nationality: value });
  };

  // Tạo các thành phần hiển thị
  const renderField = (label, field, placeholder, type = "text") => (
    <div className="flex items-center justify-between mb-4 border-b pb-3">
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
            : handleEdit(field)
        }
        className="ml-4"
      />
    </div>
  );

  // Tạo dropdown cho Nationality
  const renderNationalityField = () => (
    <div className="flex items-center justify-between mb-4 border-b pb-3">
      <span className="w-1/4 font-semibold">Nationality</span>
      <div className="w-2/4">
        {editingField === "nationality" ? (
          <Select
            value={userInfo.nationality}
            onChange={handleNationalityChange}
            className="w-full"
          >
            <Option value="Vietnam">Vietnam</Option>
            <Option value="United States">United States</Option>
            <Option value="Japan">Japan</Option>
            <Option value="France">France</Option>
            <Option value="Germany">Germany</Option>
            <Option value="Canada">Canada</Option>
            {/* Bạn có thể thêm nhiều quốc gia hơn ở đây */}
          </Select>
        ) : (
          <Text>{userInfo.nationality || "Select your nationality"}</Text>
        )}
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={
          editingField === "nationality" ? <CheckOutlined /> : <EditOutlined />
        }
        onClick={() =>
          editingField === "nationality"
            ? handleSave("nationality", userInfo.nationality)
            : handleEdit("nationality")
        }
        className="ml-4"
      />
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-2xl bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Personal details</h2>
      <p className="text-gray-500 mb-6">
        Update your information and find out how it's used.
      </p>
      {/* Render các trường thông tin */}
      {renderField("Name", "name", "Enter your name")}
      {renderField("Display name", "displayName", "Choose a display name")}
      {renderField("Email address", "email", "Enter your email", "email")}
      {renderField("Phone number", "phone", "Add your phone number")}
      {renderField("Date of birth", "dob", "Enter your date of birth", "date")}
      {renderNationalityField()} {/* Dùng dropdown cho Nationality */}
      {renderField("Gender", "gender", "Select your gender")}
      {renderField("Address", "address", "Add your address")}
      {renderField("Passport details", "passportDetails", "Not provided")}
    </div>
  );
};

export default Profile;
