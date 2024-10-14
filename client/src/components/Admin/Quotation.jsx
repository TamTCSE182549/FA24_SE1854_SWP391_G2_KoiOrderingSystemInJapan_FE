import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie"; // Thêm useCookies để lấy token từ cookie
import { jwtDecode } from "jwt-decode";
import { use } from "framer-motion/client";
const Quotation = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);
      } catch (error) {
        console.log(error);
      }
    }
  }, [token]);

  const getBookingIdbyUserId = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/bookings/{userId}"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return <div></div>;
};

export default Quotation;
