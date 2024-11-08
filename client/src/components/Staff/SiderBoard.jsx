import React, { useState } from "react";
import { Layout } from "antd";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/bg_f8f8f8-flat_750x_075_f-pad_750x1000_f8f8f8-removebg-preview.png";

const { Sider } = Layout;

const SiderBoard = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/staff/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      title: "Quotations",
      path: "/staff/quotation",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "Booking List",
      path: "/staff/booking-list-for-staff",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Check-in Service",
      path: "/staff/checkin-service",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "Koi Bookings",
      path: "/staff/booking-for-koi-list",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
      ),
    },
    {
      title: "Deposit List",
      path: "/staff/deposit-list",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  return (
    <Sider
      width={280}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="fixed left-0 top-0 h-screen z-10 transition-all duration-300"
      style={{
        backgroundColor: '#1E293B',
        marginTop: '96px', // Adjust based on your navbar height
      }}
    >
      {/* Sidebar Header */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <>
              <img src={Logo} alt="Koi Legend" className="h-8 w-auto" />
              <span className="text-white font-semibold text-lg">Staff Portal</span>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 md:min-w-full border-blueGray-300" />

      {/* Navigation */}
      <div className="px-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition-all duration-200
                ${isActive 
                  ? 'bg-blue-500/10 text-blue-500' 
                  : 'text-gray-300 hover:bg-blue-500/5 hover:text-blue-500'
                }
              `}
            >
              {/* Icon */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg
                ${isActive ? 'text-blue-500' : 'text-gray-400'}
              `}>
                {item.icon}
              </div>
              
              {/* Text */}
              {!collapsed && (
                <span className={`
                  flex-1 font-medium text-sm whitespace-nowrap
                  ${isActive ? 'text-blue-500' : 'text-gray-300'}
                `}>
                  {item.title}
                </span>
              )}

              {/* Active Indicator */}
              {isActive && !collapsed && (
                <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <div className="flex items-center gap-4">
          {!collapsed && (
            <>
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full border-2 border-blue-500"
                  src="https://via.placeholder.com/40"
                  alt="Staff Avatar"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-300 truncate">
                  Staff Name
                </p>
                <p className="text-xs text-gray-500 truncate">
                  staff@koilegend.com
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default SiderBoard;
