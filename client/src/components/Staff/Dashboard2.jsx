// Dashboard.js
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Table, Select } from "antd";
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

  // New state variables for chart data
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topKoiData, setTopKoiData] = useState([]);
  const [dataStats, setDataStats] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    // Fetch booking data

    // Fetch monthly revenue data
    axios
      .get("http://localhost:8080/api/admin/revenue/monthy", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const revenueData = Array(12).fill(0); // Initialize with 12 months
        const years = new Set();
        response.data.monthlyRevenue.forEach((data) => {
          if (data.year === selectedYear) {
            revenueData[data.month - 1] = data.totalAmount; // Fill in the data
          }
          years.add(data.year);
        });
        setMonthlyRevenue(revenueData);
        setAvailableYears(Array.from(years));
      })
      .catch((error) =>
        console.error("Error fetching monthly revenue:", error)
      );

    // Fetch top koi data
    axios
      .get("http://localhost:8080/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTopKoiData(response.data.topKoi);
        setDataStats(response.data);
      })
      .catch((error) => console.error("Error fetching top koi data:", error));
  }, [token, selectedYear]);

  // Prepare data for bar chart
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
        label: `Revenue for ${selectedYear}`,
        data: monthlyRevenue,
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
        text: `Monthly Revenue for ${selectedYear}`,
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

  // Prepare data for pie chart
  const pieChartData = {
    labels: topKoiData.map((koi) => koi.name),
    datasets: [
      {
        data: topKoiData.map((koi) => koi.totalSold),
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
        text: "Top Koi Sales",
        font: {
          size: 14,
        },
      },
    },
  };

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Overview</h3>
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="p-4 bg-blue-500 text-white rounded-lg">
          <h4 className="text-2xl font-semibold">{dataStats.totalCustomer}</h4>
          <p>Total Customers</p>
        </div>
        <div className="p-4 bg-green-500 text-white rounded-lg">
          <h4 className="text-2xl font-semibold">{dataStats.totalFarm}</h4>
          <p>Total Farms</p>
        </div>
        <div className="p-4 bg-yellow-500 text-white rounded-lg">
          <h4 className="text-2xl font-semibold">{dataStats.totalTOur}</h4>
          <p>Total Tours</p>
        </div>
        <div className="p-4 bg-red-500 text-white rounded-lg">
          <h4 className="text-2xl font-semibold">{dataStats.totalKoi}</h4>
          <p>Total Koi</p>
        </div>
      </div>
      <div className="flex justify-center items-center w-full mb-6">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-3 gap-15">
            <div className="col-span-2 mt-6 h-80">
              <Select
                value={selectedYear}
                onChange={(value) => setSelectedYear(value)}
                style={{ marginBottom: 20 }}
              >
                {availableYears.map((year) => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
              </Select>
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
    </div>
  );
};

export default Dashboard;
