import React, { useEffect, useState } from "react";
import { Input, Dropdown, Menu, Avatar, Drawer } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DownOutlined,
  MenuOutlined,
  CalendarOutlined,
  BookOutlined,
  FileTextOutlined,
  StarOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ShopOutlined
} from "@ant-design/icons";
import Logo from "../../assets/bg_f8f8f8-flat_750x_075_f-pad_750x1000_f8f8f8-removebg-preview.png";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { div } from "framer-motion/client";

const { Search } = Input;

const MenuItems = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Tour", link: "/tour" },
  { id: 3, name: "Koi Products", link: "/koiforsale" },
  { id: 4, name: "Farm", link: "/farm" },
  { id: 5, name: "About us", link: "/aboutus" },
];

const Navbar = () => {
  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email);
        setFirstName(decodedToken.firstName);
        setLastName(decodedToken.lastName);
        setRole(decodedToken.role);
        setLogin(true);
      } catch (error) {
        console.log("Invalid token", error);
        setLogin(false);
      }
    }
  }, [cookies]);

  const onSearch = (value) => {
    console.log(value);
  };

  const onMenuClick = () => {
    navigate("/login");
  };

  const onHomeClick = () => {
    navigate("/");
  };

  const onOpenDrawer = () => {
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const handleSignOut = () => {
    removeCookie("token");
    setLogin(false);
    navigate("/");
  };

  const isStaff = role === "SALES_STAFF" || role === "DELIVERING_STAFF" || role === "CONSULTING_STAFF";
  const isManager = role === "MANAGER";

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/profile" className="flex items-center space-x-2">
          <UserOutlined className="text-blue-500" />
          <span>View Profile</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/ViewBooking" className="flex items-center space-x-2">
          <CalendarOutlined className="text-green-500" />
          <span>Bookings & Trips</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/customer/booking-for-koi-list" className="flex items-center space-x-2">
          <ShopOutlined className="text-orange-500" />
          <span>Booking Koi</span>
        </Link>
      </Menu.Item>
      {/* <Menu.Item key="4">
        <Link to="/Quotation" className="flex items-center space-x-2">
          <FileTextOutlined className="text-purple-500" />
          <span>Quotations</span>
        </Link>
      </Menu.Item> */}
      <Menu.Item key="4">
        <Link to="/reviews" className="flex items-center space-x-2">
          <StarOutlined className="text-yellow-500" />
          <span>Reviews</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="5">
        <Link to="/ViewCheckin" className="flex items-center space-x-2">
          <CheckCircleOutlined className="text-cyan-500" />
          <span>Check-in</span>
        </Link>
      </Menu.Item>
      {isStaff && (
        <Menu.Item key="staff-dashboard">
          <Link to="/staff/dashboard" className="flex items-center space-x-2">
            <DashboardOutlined className="text-blue-600" />
            <span>Staff Dashboard</span>
          </Link>
        </Menu.Item>
      )}
      {isManager && (
        <Menu.Item key="admin-dashboard">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <DashboardOutlined className="text-red-600" />
            <span>Admin Dashboard</span>
          </Link>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="6" onClick={handleSignOut} danger>
        <div className="flex items-center space-x-2 text-red-500">
          <LogoutOutlined />
          <span>Sign out</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  const Sidebar = () => (
    <Drawer
      placement="left"
      onClose={onCloseDrawer}
      open={drawerVisible}
      maskTransitionName="fade"
      closable={false}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
      bodyStyle={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div className="flex flex-col justify-between items-center">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-16 h-auto pr-4" />
          <span className="text-white font-serif text-xl">
            Koi Ordering System
          </span>
        </div>

        {login ? (
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar icon={<UserOutlined />} size={64} />
              <span className="text-white font-serif text-lg">{`${firstName} ${lastName}`}</span>
            </div>
          </div>
        ) : (
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-white font-serif text-lg transition duration-500 hover:text-white hover:shadow-2xl hover:rounded-3xl hover:font-bold w-full h-[50px] flex justify-center items-center"
              onClick={() => setDrawerVisible(false)}
            >
              Login
            </Link>
          </div>
        )}

        <div className="flex flex-col">
          <ul className="flex-1 overflow-auto">
            {MenuItems.map((data) => (
              <li
                key={data.id}
                className="flex-1 flex justify-center text-center items-center"
              >
                <Link
                  to={data.link}
                  className="text-white font-serif text-lg transition duration-500 hover:text-white hover:shadow-2xl hover:rounded-3xl hover:font-bold w-full h-[50px] flex justify-center items-center"
                  onClick={() => setDrawerVisible(false)}
                >
                  {data.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {login && (
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-red-600 w-full h-[50px] flex justify-center items-center"
          >
            Logout
          </button>
        </div>
      )}
    </Drawer>
  );

  return location.pathname === "/" ? (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white cursor-pointer" onClick={onHomeClick}>
            <img 
              src={Logo} 
              alt="Koi Ordering System" 
              className="h-12 w-auto mr-3"
            />
            <span className="text-xl font-bold whitespace-nowrap">
              Koi Ordering System
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex space-x-8">
              {MenuItems.map((data) => (
                <Link
                  key={data.id}
                  to={data.link}
                  className="text-white hover:text-red-500 transition cursor-pointer"
                >
                  {data.name}
                </Link>
              ))}
            </div>
            {login ? (
              <Dropdown overlay={userMenu} trigger={["click"]}>
                <div className="flex items-center cursor-pointer text-white">
                  <Avatar icon={<UserOutlined />} />
                  <span className="ml-2">{`${firstName} ${lastName}`}</span>
                  <DownOutlined className="ml-2" />
                </div>
              </Dropdown>
            ) : (
              <UserOutlined
                className="text-white text-2xl cursor-pointer"
                onClick={onMenuClick}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  ) : (
    <div className="fixed top-0 left-0 w-full z-20">
      {/* Gradient background overlay */}
      <div className="bg-gradient-to-r from-white via-gray-50 to-white backdrop-blur-sm border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-24">
            {/* Logo Section - Enhanced */}
            <div className="flex-shrink-0 flex items-center group">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-14 w-auto cursor-pointer transition-transform duration-500 group-hover:scale-110"
                  onClick={onHomeClick}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="ml-4 text-gray-800 font-bold text-xl tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                Koi Ordering System
              </span>
            </div>

            {/* Navigation Links - Enhanced */}
            <div className="hidden md:flex items-center space-x-1">
              {MenuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="relative px-4 py-2 text-gray-700 font-medium text-sm tracking-wide group"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-blue-600">
                    {item.name}
                  </span>
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
                </Link>
              ))}
            </div>

            {/* User Section - Redesigned with Tailwind only */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center">
                {login ? (
                  <Dropdown overlay={userMenu} trigger={["click"]}>
                    <div className="flex items-center gap-3 px-4 py-2.5 cursor-pointer group relative bg-white hover:bg-gray-50 rounded-xl transition-all duration-300">
                      {/* Avatar Container */}
                      <div className="relative">
                        <div className="relative p-[2px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                          <Avatar 
                            icon={<UserOutlined />} 
                            className="!flex items-center justify-center !bg-white !text-gray-700 border-2 border-white"
                            size={45}
                          />
                        </div>
                        {/* Online Status Indicator */}
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>

                      {/* User Info */}
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                          {`${firstName} ${lastName}`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {isManager ? 'Admin' : isStaff ? 'Staff' : 'Member'}
                        </span>
                      </div>

                      {/* Dropdown Icon */}
                      <div className="flex items-center">
                        <DownOutlined className="text-gray-400 text-xs transform transition-transform duration-300 group-hover:-rotate-180" />
                      </div>

                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gray-200 transition-colors duration-300"></div>
                    </div>
                  </Dropdown>
                ) : (
                  <button
                    onClick={onMenuClick}
                    className="relative group px-6 py-2.5 rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="relative flex items-center gap-2">
                      <UserOutlined className="text-white text-lg" />
                      <span className="text-white font-medium">Login</span>
                    </div>
                    
                    {/* Shine effect on hover */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={onOpenDrawer}
                className="md:hidden relative p-2.5 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-all duration-300"
              >
                <MenuOutlined className="h-6 w-6 transform transition-transform duration-300 hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
