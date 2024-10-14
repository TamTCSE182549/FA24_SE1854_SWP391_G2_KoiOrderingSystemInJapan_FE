import React, { useEffect, useState } from "react";
import { Input, Dropdown, Menu, Avatar } from "antd";
import { IoMdSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DownOutlined,
} from "@ant-design/icons";
// import { AuthContext } from "../../components/LoginAndSignIn/AuthContext";
import Logo from "../../assets/bg_f8f8f8-flat_750x_075_f-pad_750x1000_f8f8f8-removebg-preview.png";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode"; // Import chính xác mà không cần dấu ngoặc nhọn
import { set } from "react-hook-form";

const { Search } = Input;

const MenuItems = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Tour", link: "/tour" },
  { id: 3, name: "Koi Products", link: "/koiforsale" },
  { id: 4, name: "Farm", link: "/farm" },
  { id: 5, name: "All About Koi", link: "/allaboutkoi" },
  { id: 6, name: "About us", link: "/aboutus" },
];

const Navbar = () => {
  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email);
        setFirstName(decodedToken.first_name);
        setLastName(decodedToken.last_name);
        console.log("Valid token", decodedToken.first_name);
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

  // Handle sign out
  const handleSignOut = () => {
    removeCookie("token"); // Xóa token từ cookies
    setLogin(false); // Đặt lại trạng thái đăng nhập
    navigate("/login"); // Chuyển hướng đến trang đăng nhập
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/profile">View Profile</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/bookings">Bookings & Trips</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/loyalty">Genius loyalty programme</Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link to="/rewards">Rewards & Wallet</Link>
      </Menu.Item>
      <Menu.Item key="5">
        <Link to="/reviews">Reviews</Link>
      </Menu.Item>
      <Menu.Item key="6">
        <Link to="/saved">Saved</Link>
      </Menu.Item>
      <Menu.Item key="7" onClick={handleSignOut}>
        Sign out
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-[#c5bd92] w-full">
      {/* upper Navbar */}
      <div className="flex justify-between items-center w-full px-6 lg:px-12 py-3">
        {/* Logo and site name */}
        <div className="flex items-center">
          <img
            src={Logo}
            alt="Logo"
            className="w-14 h-auto cursor-pointer"
            onClick={onHomeClick}
          />
          <div className="text-gray-900 font-bold text-2xl ml-2">
            KOIBOOKING
          </div>
        </div>

        {/* Navigation menu */}
        <div className="hidden md:flex flex-grow justify-center rounded-3xl">
          <ul className="flex justify-between w-full max-w-4xl rounded-3xl">
            {MenuItems.map((data) => (
              <li
                key={data.id}
                className="flex-1 flex justify-center items-center h-12 text-center"
              >
                <Link
                  to={data.link}
                  className="text-gray-900 font-bold transition duration-500 ease-in-out text-base
                            hover:bg-white hover:text-black hover:shadow-2xl hover:rounded-3xl px-4 py-2"
                >
                  {data.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Search bar and Icons */}
        <div className="flex items-center space-x-6">
          <Search
            placeholder="Search Koi"
            onSearch={onSearch}
            className="hidden md:block w-auto xl:w-60 bg-[#c5bd92]"
          />
          {login ? (
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <div className="flex items-center cursor-pointer text-gray-800">
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

          <ShoppingCartOutlined className="text-white text-2xl cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
