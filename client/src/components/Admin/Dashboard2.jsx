// Dashboard.js
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Table } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [column, setColumn] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const barChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Sales",
        data: [12, 200, 3, 5, 2, 3, 10, 15, 7, 9, 13, 17],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const pieChartData = {
    labels: [
      "Category 1",
      "Category 2",
      "Category 3",
      "Category 4",
      "Category 5",
      "Category 6",
      "Category 7",
    ],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3, 10],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 10,
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: true,
        text: "Category Distribution",
        font: {
          size: 14,
        },
      },
    },
  };

  // Sample data for the table
  const tableData = [
    {
      key: "1",
      id: 1,
      type: "Sale",
      created_at: "2023-05-01",
      total_amount: 1000,
      account_id: "ACC001",
    },
    {
      key: "2",
      id: 2,
      type: "Purchase",
      created_at: "2023-05-02",
      total_amount: 1500,
      account_id: "ACC002",
    },
    // Add more sample data as needed
  ];

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "nameCus",
      key: "nameCus",
    },
    {
      title: "Total Amount with VAT",
      dataIndex: "totalAmountWithVAT",
      key: "totalAmountWithVAT",
    },
    {
      title: "Booking Type",
      dataIndex: "bookingType",
      key: "bookingType",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Updated By",
      dataIndex: "updatedBy",
      key: "updatedBy",
    },
    {
      title: "Updated Date",
      dataIndex: "updatedDate",
      key: "updatedDate",
    },
  ];

  

  useEffect(() => {
    axios
      .get("http://localhost:8080/bookings/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }) // Adjust API endpoint if needed
      .then((response) => {

        setColumn(columns); // Cập nhật state của columns
        setBookings(response.data); // Cập nhật state của bookings với dữ liệu lấy được
      })
      .catch((error) => console.error("Error fetching booking data:", error));
  }, []);

  return (

    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Overview</h3>
      <div className="grid grid-cols-3 gap-6 mb-6">

        <div className="p-4 bg-blue-500 text-white rounded-lg">
          <h4 className="text-2xl font-semibold">150</h4>
          <p>Total Users</p>
        </div>
        <div className="p-4 bg-green-500 text-white rounded-lg">
          <h4 className="text-2xl font-semibold">75</h4>
          <p>New Orders</p>
        </div>
        <div className="p-4 bg-yellow-500 text-white rounded-lg">
          <h4 className="text-2xl font-semibold">12</h4>
          <p>Pending Issues</p>
        </div>
      </div>
      <div className="flex justify-center items-center w-full mb-6">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-3 gap-15">
            <div className="col-span-2 mt-6 h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            <div className="mt-3 h-72">
              <Pie
                data={pieChartData}
                options={pieChartOptions}
                style={{ padding: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
        <Table columns={column} dataSource={bookings} />
      </div>
    </div>
  );
};

export default Dashboard;
