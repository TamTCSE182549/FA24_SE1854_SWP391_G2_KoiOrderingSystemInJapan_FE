import React, { useState, useEffect } from "react";
import { DatePicker, Input, Button, Rate, Pagination } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { div } from "framer-motion/client";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
const { RangePicker } = DatePicker;

const App = () => {
  const [hotels, setHotels] = useState([]); // To hold hotel data
  const [loading, setLoading] = useState(true); // Loading state

  const tourList = async (values) => {
    try {
      // Replace this with your actual API or fetch function
      const response = await axios.get(
        "http://localhost:8080/tour/list",
        values
      );
      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    tourList();
  }, []);

  return <></>;
};

export default App;
