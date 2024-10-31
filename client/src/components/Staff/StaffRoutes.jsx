import React from "react";
import { Route, Routes } from "react-router-dom";
import StaffDashboard from "./StaffDashboard"; // Import your staff dashboard or main component
import PrivateRoute from "../PrivateRouter/PrivateRouter"; // Adjust the path as necessary

const StaffRoutes = () => {
  return (
    <Routes>
      {/* Use PrivateRoute to protect staff routes */}
      <Route
        element={
          <PrivateRoute
            allowedRoles={[
              "SALES_STAFF",
              "DELIVERING_STAFF",
              "CONSULTING_STAFF",
            ]}
          />
        }
      >
        {/* Define the main route for staff with sub-routes if needed */}
        <Route path="/*" element={<StaffDashboard />} />{" "}
        {/* Add * for nested routes */}
      </Route>
    </Routes>
  );
};

export default StaffRoutes;
