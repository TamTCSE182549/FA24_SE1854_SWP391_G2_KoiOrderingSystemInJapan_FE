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
import KoiDetail from "./components/KoiDetail";
import FarmDetail from "./components/Hero/FarmDetail";
import TourDetail from "./components/Hero/TourDetail";


import ViewBooking from "./components/Customer/ViewBooking";


import Delivery from "./components/Customer/Delivery";
import ResetPassword from "./components/LoginAndSignIn/ResetPassword";
import ForgotPassword from "./components/LoginAndSignIn/ForgotPassword";

import BookingKoi from './components/SaleStaff/BookingKoi';
import CreateCheckin from './components/SaleStaff/CreateCheckin';


import BookingKoiDetail from "./components/Hero/BookingKoiDetail";
import CreateBooking from "./components/Hero/CreateBooking";

//for manager and staff
import Quotation from "./components/Admin/Quotation";
import CreateQuotation from "./components/Admin/CreateQuotation";
import UpdateQuotation from "./components/Admin/UpdateQuotation";

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
        <div className="flex-grow text-white">
          <Routes>
            <Route path="/update-quotation/:quotationId" element={<UpdateQuotation />} />
            <Route path="/createQuotation/:bookingId" element={<CreateQuotation />} />
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/" element={<Hero />} />
            <Route path="/koiforsale" element={<KoiForSale />} />
            <Route path="/farm" element={<Farm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/delivery/:bookingId" element={<Delivery />} />
            <Route path="/profile" element={<Profile />} />
            <Route element={<PrivateRoute allowedRoles={["CUSTOMER"]} />}>
              <Route path="/bookinglist" element={<BookingList />} />
            </Route>
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/bookings" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/tour" element={<Tour />} />

            <Route path="/koi/:id" element={<KoiDetail />} />

            <Route path="/farmdetail" element={<FarmDetail />} />
            <Route path="/tourdetail" element={<TourDetail />} />
            <Route path="/*" element={<AdminRoutes />} />
            <Route path="/ViewBooking" element={<ViewBooking />} />
            <Route path="/bookingkoidetail" element={<BookingKoiDetail />} />
            <Route path="/createbooking" element={<CreateBooking />} />

            <Route path="/farmdetail/:id" element={<FarmDetail />} />
            <Route path="/tourdetail/:id" element={<TourDetail />} />
            <Route path="/*" element={<AdminRoutes />} />
            <Route path="/ViewBooking" element={<ViewBooking />} />

            <Route
              element={<PrivateRoute allowedRoles={["MANAGER"]} />}
            ></Route>
            <Route path="/forgotpassword" element={<ForgotPassword />} />

            <Route path="/paymentsuccess" element={<PaymentSuccess />} />
            <Route path="/booking-koi" element={<BookingKoi />} />
            <Route path="/create-checkin/:bookingId" element={<CreateCheckin />} />

          </Routes>
        </div>
        <div className="">
          <Footer />
        </div>
      </div>
    </div>
    // </AuthProvider>
  );
};

export default App;
