import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero/Hero";
import MainImg from "./assets/R.jpg";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import KoiForSale from "./components/Hero/KoiForSale";
import Footer from "./components/Footer/Footer";
import Farm from "./components/Hero/Farm";
import TimeLine from "./components/Delivery/TimeLine";
import AdminDashboard from "./components/Admin/AdminDashboard";

const bgImage = {
  backgroundImage: `url(${MainImg})`,
  height: "100vh",
  width: "100%",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};
const App = () => {
  const [loginPopup, setLoginPopup] = React.useState(false);
  const toggleLoginPopup = () => {
    setLoginPopup((prev) => !prev);
  };

  return (
    <>
      <main className="">
        <Navbar toggleLoginPopup={toggleLoginPopup} />
        <div className="min-h-screen flex flex-col flex-grow">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/KoiForSale" element={<KoiForSale />} />
            <Route path="/farm" element={<Farm />} />
            <Route path="/about" element={<TimeLine />} />

            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </div>
        <div>
          <Footer />
        </div>
      </main>
      <LoginPopup loginPopup={loginPopup} toggleLoginPopup={toggleLoginPopup} />
    </>
  );
};

export default App;
