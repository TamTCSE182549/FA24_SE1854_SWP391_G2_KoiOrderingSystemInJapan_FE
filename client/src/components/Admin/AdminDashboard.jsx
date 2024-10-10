import React, { useState } from "react";
import {
  Layout,
  Menu,
  Card,
  Col,
  Row,
  Progress,
  Typography,
  Input,
} from "antd";
// import {
//   DashboardOutlined,
//   LineChartOutlined,
//   BarChartOutlined,
//   DollarOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts"; // Import từ recharts
const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

// Dữ liệu mẫu cho biểu đồ
const data = [
  { name: "Sun", orders: 400, sales: 240 },
  { name: "Mon", orders: 300, sales: 456 },
  { name: "Tue", orders: 500, sales: 139 },
  { name: "Wed", orders: 278, sales: 390 },
  { name: "Thu", orders: 189, sales: 480 },
  { name: "Fri", orders: 239, sales: 380 },
  { name: "Sat", orders: 349, sales: 430 },
];

const Dashboard = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider breakpoint="lg" collapsedWidth="0" theme="dark">
        <div className="logo text-white text-center py-4 text-2xl font-bold">
          Adminify
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<LineChartOutlined />}>
            CRM
          </Menu.Item>
          <Menu.Item key="3" icon={<BarChartOutlined />}>
            Sales Report
          </Menu.Item>
          <Menu.Item key="4" icon={<DollarOutlined />}>
            Payment
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout>
        <Header className="bg-white shadow-md px-4">
          <div className="flex justify-between items-center">
            <Title level={4} className="mb-0">
              Dashboard / Dashboard 1
            </Title>

            {/* Search Input */}
            <div className="relative">
              <Input
                className={`transition-all duration-300 ease-in-out ${
                  isFocused ? "w-72" : "w-40"
                } px-4 py-2 border rounded-lg shadow-sm focus:shadow-lg focus:outline-none focus:border-blue-400`}
                placeholder="Search"
                prefix={<SearchOutlined className="text-gray-400" />}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #d9d9d9",
                  transition: "all 0.3s ease-in-out",
                }}
              />
            </div>
          </div>
        </Header>

        <Content style={{ margin: "24px 16px 0" }}>
          <div className="p-4 bg-gradient-to-b from-white to-gray-100 shadow-lg rounded-lg">
            {/* Row of Cards */}
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card
                  style={{ backgroundColor: "#f6f8fd" }}
                  hoverable
                  className="shadow-lg"
                  bordered={false}
                >
                  <Title level={5} className="text-gray-600">
                    Total Revenue
                  </Title>
                  <p className="text-4xl text-blue-500 font-bold">256</p>
                  <p className="text-gray-500">Revenue Today</p>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  style={{ backgroundColor: "#fef2f5" }}
                  hoverable
                  className="shadow-lg"
                  bordered={false}
                >
                  <Title level={5} className="text-gray-600">
                    Total Orders
                  </Title>
                  <p className="text-4xl text-pink-500 font-bold">4,100</p>
                  <p className="text-gray-500">New Orders Today</p>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  style={{ backgroundColor: "#ebf8f2" }}
                  hoverable
                  className="shadow-lg"
                  bordered={false}
                >
                  <Title level={5} className="text-gray-600">
                    Daily Sales
                  </Title>
                  <Progress
                    type="circle"
                    percent={42}
                    strokeColor="#36cfc9"
                    format={(percent) => `${percent}%`}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  style={{ backgroundColor: "#faf5eb" }}
                  hoverable
                  className="shadow-lg"
                  bordered={false}
                >
                  <Title level={5} className="text-gray-600">
                    Expenses
                  </Title>
                  <Progress
                    type="circle"
                    percent={55}
                    strokeColor="#faad14"
                    format={(percent) => `${percent}%`}
                  />
                </Card>
              </Col>
            </Row>

            {/* Charts */}
            <Row gutter={[16, 16]} className="mt-6">
              <Col span={12}>
                <Card title="Sales Report" className="shadow-lg">
                  {/* <LineChart width={400} height={200} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                    <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
                  </LineChart> */}
                </Card>
              </Col>
              <Col span={12}>
                <Card title="User Stats" className="shadow-lg">
                  {/* <LineChart width={400} height={200} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#ff7300" />
                    <Line type="monotone" dataKey="sales" stroke="#387908" />
                  </LineChart> */}
                </Card>
              </Col>
            </Row>
          </div>
        </Content>

        <Footer style={{ textAlign: "center", backgroundColor: "#f6f8fd" }}>
          Admin Dashboard ©2024
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
