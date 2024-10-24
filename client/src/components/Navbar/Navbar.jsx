import React, { useEffect, useState } from "react";
import { Input, Dropdown, Menu, Avatar, Drawer } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DownOutlined,
  MenuOutlined,
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

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/profile">View Profile</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/ViewBooking">Bookings & Trips</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/loyalty">Genius loyalty programme</Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link to="/reviews">Reviews</Link>
      </Menu.Item>
      <Menu.Item key="5" onClick={handleSignOut}>
        Sign out
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
          <span className="text-white font-serif text-xl">KOIBOOKING</span>
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
    <>
      <MenuOutlined
        className="text-white text-2xl cursor-pointer z-50 fixed top-3 left-3"
        onClick={onOpenDrawer}
      />
      <Sidebar />
    </>
  ) : (
    <div className="fixed top-0 left-0 w-full z-20 ">
      <div className="backdrop-filter bg-gradient-to-r from-emerald-700 via-green-800 to-teal-600 w-full shadow-lg fixed z-10">
        {/* upper Navbar */}

        <div className="flex justify-between items-center w-full px-6 lg:px-12 py-1">
          {/* Logo and site name */}
          <div className="flex items-center">
            <img
              src={Logo}
              alt="Logo"
              className="w-14 h-auto cursor-pointer"
              onClick={onHomeClick}
            />
            <div className="text-gray-300 font-serif text-2xl ml-2">
              KOIBOOKING
            </div>
          </div>

          {/* Navigation menu */}
          <div className="hidden md:flex flex-grow justify-center rounded-3xl">
            <ul className="flex justify-between w-[70%] rounded-3xl ">
              {MenuItems.map((data) => (
                <li
                  key={data.id}
                  className="flex-1 flex justify-center text-center items-center"
                >
                  <Link
                    to={data.link}
                    className="text-white font-serif text-lg transition duration-500
                             hover:text-white hover:shadow-2xl hover:rounded-3xl hover:font-bold w-full h-[50px]
                            flex justify-center items-center"
                  >
                    {data.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Search bar and Icons */}
          <div className="flex items-center space-x-6">
            {login ? (
              <Dropdown overlay={userMenu} trigger={["click"]}>
                <div className="flex items-center cursor-pointer text-gray-800 ">
                  <Avatar icon={<UserOutlined />} />
                  <span className="ml-2 text-white">{`${firstName} ${lastName}`}</span>
                  <DownOutlined className="ml-2" />
                </div>
              </Dropdown>
            ) : (
              <UserOutlined
                className="text-gray-300 text-2xl cursor-pointer"
                onClick={onMenuClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
