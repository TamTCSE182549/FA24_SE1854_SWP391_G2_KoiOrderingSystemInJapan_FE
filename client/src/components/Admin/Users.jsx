import React, { useState, useEffect } from "react";
import { Table, Tag, Spin, message, Button } from "antd";
import axios from "axios"; // Make sure to install axios: npm install axios
import { useCookies } from "react-cookie";
import { format } from "date-fns";

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true); // Đọc token từ cookie
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get("http://localhost:8080/api/account", {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      const formattedData = response.data.map((user) => ({
        ...user,
        key: user.id.toString(),
        createdDate: format(new Date(user.createdDate), "dd/MM/yyyy HH:mm:ss"),
      }));
      setUserData(formattedData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to fetch user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBan = (userId) => {
    // Implement ban logic here
    console.log(`Ban user with ID: ${userId}`);
    message.success(`User with ID ${userId} has been banned.`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Status",
      key: "active",
      dataIndex: "active",
      render: (active) => (
        <Tag color={active === true ? "green" : "red"}>
          {active === true ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleBan(record.id)}>
          Ban
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={userData} />
      )}
    </div>
  );
};

export default Users;
