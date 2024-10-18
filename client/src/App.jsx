import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero/Hero";
import KoiForSale from "./components/Hero/KoiForSale";
import Footer from "./components/Footer/Footer";
import Farm from "./components/Hero/Farm";
import Login from "./components/LoginAndSignIn/Login";
import SignIn from "./components/LoginAndSignIn/SignIn";
import Profile from "./components/Customer/Profile";
import Booking from "./components/Customer/Booking";
import Payment from "./components/Customer/Payment";
import PaymentSuccess from "./components/Customer/PaymentSuccess";
import MainImg from "./assets/9543121.jpg"; // Import hình ảnh của bạn
import PrivateRoute from "./components/PrivateRouter/PrivateRouter";
import Tour from "./components/Hero/TourList";
import BookingList from "./components/Customer/BookingList";
import AdminRoutes from "./components/Admin/AdminRoutes";

const App = () => {
  return (
    // <AuthProvider>
    <div className="flex flex-col min-h-screen">
      {/* Phần hình nền parallax */}
      <div
        className="bg-fixed bg-center bg-cover w-full h-full flex-grow flex flex-col min-h-screen"
        style={{
          backgroundImage: `url(${MainImg})`,
        }}
      >
        <Navbar />
        <div className="flex-grow text-white ">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/koiforsale" element={<KoiForSale />} />
            <Route path="/farm" element={<Farm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/SignIn" element={<SignIn />} />

            <Route element={<PrivateRoute allowedRoles={["CUSTOMER"]} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookinglist" element={<BookingList />} />
            </Route>

            <Route path="/bookings" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/tour" element={<Tour />} />

            <Route path="/*" element={<AdminRoutes />} />
            <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          </Routes>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
    // </AuthProvider>
  );
};

export default App;
