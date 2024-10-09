import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { head, header } from "framer-motion/client";

const Delivery = () => {
  const [token, setToken] = useState("");
  const deliveryList = async () => {
    const storedToken = localStorage.getItem("token");
    console.log(storedToken);
    try {
      const response = await axios.get("http://localhost:8080/api/delivery", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    deliveryList();
  }, []);

  return <div></div>;
};
export default Delivery;
