import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero/Hero";
import MainImg from "./assets/R.jpg";
import KoiForSale from "./components/Hero/KoiForSale";
import Footer from "./components/Footer/Footer";
import Farm from "./components/Hero/Farm";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Login from "./components/LoginAndSignIn/Login";
import SignIn from "./components/LoginAndSignIn/SignIn";
import Profile from "./components/Customer/Profile";
import Booking from "./components/Customer/Booking";

const bgImage = {
  backgroundImage: `url(${MainImg})`,
  height: "100vh",
  width: "100%",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Content Area */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/koiforsale" element={<KoiForSale />} />
          <Route path="/farm" element={<Farm />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Bookings" element={<Booking />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
