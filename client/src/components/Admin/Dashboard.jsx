// Dashboard.js
import React from "react";

const Dashboard = () => {
  return (

    <div className="border border-gray-300 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-white">Overview</h3>
      <div className="grid grid-cols-3 gap-6">
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
    </div>
  );
};

export default Dashboard;
