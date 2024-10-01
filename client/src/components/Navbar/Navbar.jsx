import React from "react";
import Logo from "../../assets/bg_f8f8f8-flat_750x_075_f-pad_750x1000_f8f8f8-removebg-preview.png";
import { IoMdSearch } from "react-icons/io";
import { Outlet, Link } from "react-router-dom";
const Menu = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  {
    id: 2,
    name: "Koi for sale",
    link: "/KoiforSale",
  },
  {
    id: 3,
    name: "Buying Trips",
    link: "/buyingtrips",
  },
  {
    id: 4,
    name: "Variety",
    link: "/variety",
  },
  {
    id: 5,
    name: "Guideline",
    link: "/guideline",
  },
  {
    id: 6,
    name: "Disease",
    link: "/disease",
  },
  {
    id: 7,
    name: "About",
    link: "/about",
  },
  {
    id: 8,
    name: "Contact",
    link: "/contact",
  },
];
const Navbar = ({ toggleLoginPopup }) => {
  return (
    <div className="shadow md bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-black dark:text-white duration-200 relative z-40">
      {/* upper Navbar */}
      <div className="bg-white/10 py-1 flex justify-between mx-auto items-center">
        {/* <div className="container mx-auto flex justify-between items-center "> */}
        <div className="flex">
          <a
            href="/"
            className="font-serif text-2xl sm:text-3xl flex gap-2 items-center text-white "
          >
            <img src={Logo} alt="Logo" className="w-20 px-2 pl-4"></img>
            KOISERVICE
          </a>
        </div>
        <div className="flex justify-center mx-auto items-center">
          <div className=" rounded-xl p-auto mx-auto">
            <ul className="sm:flex hidden items-center">
              {Menu.map((data) => (
                <li key={data.id}>
                  <Link
                    to={data.link}
                    className="inline-block py-2 px-10
                            hover:text-cyan-600 duration-200 text-white
                              hover:shadow-lg hover:translate-y-[-2px] 
                            hover:text-cyan-600 transition-all duration-300
                              hover:rounded-full hover:bg-white hover:text-gray-500 items-center
                              text-lg font-serif"
                  >
                    {data.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Outlet />
          </div>
        </div>
        {/* Search bar and login button */}
        <div className="flex justify-between items-center gap-4">
          <div className="relative group hidden sm:block">
            <input
              type="text"
              placeholder="Search"
              className="w-[200px] sm:w-[300px] hover:border-red-600
                transition-all duration-300 rounded-full border border-gray-950 
                px-2 py-1 focus:outline-none focus:border-1 focus:border-gray-950 text-black dark:text-black"
            />
            <IoMdSearch className="text-gray-950 group-hover:text-cyan-600 absolute top-1/2 -translate-y-1/2 right-3" />
          </div>
          {/* Login button */}
          <div className="p-auto shadow-md mx-auto rounded-xl">
            <button
              onClick={toggleLoginPopup}
              className="inline-block py-2 px-3
                            hover:text-cyan-600 duration-200 text-white
                              hover:shadow-lg hover:translate-y-[-2px] 
                            hover:text-cyan-600 transition-all duration-300
                              hover:rounded-full hover:bg-white hover:text-gray-500 items-center
                              text-lg font-serif"
            >
              Login
            </button>
          </div>
          {/* Darkmode switch */}
        </div>
        {/* </div> */}
      </div>
      {/* lower Navbar */}
    </div>
  );
};

export default Navbar;
