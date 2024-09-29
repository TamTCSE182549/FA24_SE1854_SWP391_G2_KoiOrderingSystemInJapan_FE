import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero/Hero";
import MainImg from "./assets/R.jpg";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import KoiForSale from "./components/Hero/KoiForSale";
import Footer from "./components/Footer/Footer";
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
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/KoiForSale" element={<KoiForSale />} />
        </Routes>
        <Footer />
      </main>
      <LoginPopup loginPopup={loginPopup} toggleLoginPopup={toggleLoginPopup} />
    </>
  );
};

export default App;
