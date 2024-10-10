import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero/Hero";
import KoiForSale from "./components/Hero/KoiForSale";
import Footer from "./components/Footer/Footer";
import Farm from "./components/Hero/Farm";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Login from "./components/LoginAndSignIn/Login";
import SignIn from "./components/LoginAndSignIn/SignIn";
import Profile from "./components/Customer/Profile";
import Booking from "./components/Customer/Booking";
import Payment from "./components/Customer/Payment";
import PaymentSuccess from "./components/Customer/PaymentSuccess";
// import { AuthProvider } from "./components/LoginAndSignIn/AuthContext";
import MainImg from "./assets/koi2.jpg"; // Import hình ảnh của bạn
import PrivateRoute from "./components/PrivateRouter/PrivateRouter";

const App = () => {
  return (
    // <AuthProvider>
    <div className="flex flex-col min-h-screen">
      {/* Phần hình nền parallax */}
      <div
        className="bg-fixed bg-center bg-cover h-screen"
        style={{
          backgroundImage: `url(${MainImg})`,
        }}
      >
        {/* Navbar */}
        <Navbar />
        {/* Content Area */}
        <div className="flex-grow text-white py-20">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/koiforsale" element={<KoiForSale />} />
            <Route path="/farm" element={<Farm />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/SignIn" element={<SignIn />} />

            <Route element={<PrivateRoute allowedRoles={["CUSTOMER"]} />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/Bookings" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />

            <Route element={<PrivateRoute allowedRoles={["MANAGER"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="/paymentsuccess" element={<PaymentSuccess />} />
            <Route path="*" element={<Delivery />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
    // </AuthProvider>
  );
};

export default App;
