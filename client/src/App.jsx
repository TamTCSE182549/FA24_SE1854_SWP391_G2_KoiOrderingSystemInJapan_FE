import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero/Hero";
import MainImg from "./assets/R.jpg";
import KoiForSale from "./components/Hero/KoiForSale";
import Footer from "./components/Footer/Footer";
import Farm from "./components/Hero/Farm";
import TimeLine from "./components/Delivery/TimeLine";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Login from "./components/LoginAndSignIn/Login";
import SignIn from "./components/LoginAndSignIn/SignIn";
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
    <>
      <main className="">
        <Navbar />
        <div className="min-h-screen flex flex-col flex-grow">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/KoiForSale" element={<KoiForSale />} />
            <Route path="/farm" element={<Farm />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </div>
        <div>
          <Footer />
        </div>
      </main>
    </>
  );
};

export default App;
