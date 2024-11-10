import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import {
  Pagination,
  Button,
  Select,
  InputNumber,
  DatePicker,
  Card,
} from "antd";
import moment from "moment";
import { format } from "date-fns";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Tour = () => {
  const [tours, setTours] = useState([]); // State to store tour data
  const [farms, setFarms] = useState([]);
  const [kois, setKois] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại (bắt đầu từ 0)
  const [totalPage, setTotalPage] = useState(1); // Tổng số trang (giả sử mặc định là 1)
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [farm, setFarm] = useState("");
  const [koi, setKoi] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra nếu có thông báo toast từ state
    if (location.state && location.state.toastMessage) {
      toast.success(location.state.toastMessage);
    }
  }, [location]);

  useEffect(() => {
    // Tạo một hàm để gọi handleSubmit khi component mount
    const initialFetch = async () => {
      const findTourRequest = {
        farmId: null,
        koiId: null,
        minPrice: null,
        maxPrice: null,
        startDate: null,
        endDate: null,
      };

      try {
        const response = await axios.post(
          `http://localhost:8080/tour/findTourByFarmNameAndKoiName?page=${currentPage}&size=6`,
          findTourRequest, // Send findTourRequest as the request body
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        

        if (Array.isArray(response.data.content)) {
          setTours(response.data.content);
          setTotalPage(response.data.totalPage);
        } else {
          setTours([]);
          toast.error("No tours found");
        }
      } catch (error) {
        console.error("Error searching tours:", error);
        toast.error("Error searching tours");
      }
    };

    initialFetch();
  }, [currentPage]); // Chỉ gọi lại khi currentPage thay đổi

  const handleSubmit = async (e, page = 0) => {
    e?.preventDefault(); // Thêm optional chaining vì có thể không có event
    const findTourRequest = {
      farmId: farm || null,
      koiId: koi || null,
      minPrice: minPrice > 0 ? minPrice : null,
      maxPrice: maxPrice > 0 ? maxPrice : null,
      startDate: startDate || null,
      endDate: endDate || null,
    };

    const isDateValid = (startDate && endDate) || (!startDate && !endDate);

    if (!isDateValid) {
      toast.warn("Please choose both Start Date and End Date.");
      return;
    }

    if (minPrice > 0 && (maxPrice == null || maxPrice <= minPrice)) {
      toast.warn("Max Price must be larger than Min Price");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/tour/findTourByFarmNameAndKoiName?page=${page}&size=6`,
        findTourRequest, // Send findTourRequest as the request body
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      

      if (Array.isArray(response.data.content)) {
        setTours(response.data.content);
        setTotalPage(response.data.totalPage);
        setCurrentPage(page);
      } else {
        setTours([]);
        toast.error("No tours found");
      }
    } catch (error) {
      console.error("Error searching tours:", error);
      toast.error("Error searching tours");
    }
  };

  let role;
  if (token) {
    const decodedToken = jwtDecode(token);
    role = decodedToken.role;
  }

  const hardcodedTours = [
    // {
    //   id: 1,
    //   tourName: "Amazing Vung Tau Beach Tour",
    //   unitPrice: 150,
    //   maxParticipants: 30,
    //   description: "Enjoy the beautiful beaches of Vung Tau with this tour.",
    //   startTime: "2024-10-20T09:00:00",
    //   endTime: "2024-10-21T18:00:00",
    //   facilities: { privatePool: true, villas: true, swimmingPool: true },
    // },
    // {
    //   id: 2,
    //   tourName: "Luxury Mekong Delta Cruise",
    //   unitPrice: 300,
    //   maxParticipants: 20,
    //   description: "Experience the tranquility of the Mekong Delta.",
    //   startTime: "2024-11-01T08:00:00",
    //   endTime: "2024-11-03T16:00:00",
    //   facilities: { privatePool: false, villas: true, swimmingPool: false },
    // },
    // {
    //   id: 3,
    //   tourName: "Adventure to Fansipan",
    //   unitPrice: 200,
    //   maxParticipants: 15,
    //   description:
    //     "Conquer the roof of Indochina with this thrilling adventure.",
    //   startTime: "2024-12-10T07:00:00",
    //   endTime: "2024-12-12T17:00:00",
    //   facilities: { privatePool: true, villas: false, swimmingPool: true },
    // },
    // {
    //   id: 4,
    //   tourName: "Adventure to Fansipan",
    //   unitPrice: 200,
    //   maxParticipants: 15,
    //   description:
    //     "Conquer the roof of Indochina with this thrilling adventure.",
    //   startTime: "2024-12-10T07:00:00",
    //   endTime: "2024-12-12T17:00:00",
    //   facilities: { privatePool: true, villas: false, swimmingPool: true },
    // },
  ];

  const handleBooking = (tour) => {
    // Điều hướng sang trang booking và truyền tour object qua state
    if (!token) {
      toast.warn("You not login to Booking");
      navigate(`/login`);
    } else {
      navigate(`/tourdetail`, { state: { tour } });
      // navigate("/bookings", { state: { tour } });
    }
  };

  // Lấy ngày hiện tại
  const today = new Date();

  // Tính toán ngày bắt đầu hợp lệ (5 ngày sau ngày hiện tại)
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 7);
  const minStartDate = futureDate.toISOString().split("T")[0]; // Định dạng YYYY-MM-DD

  // Đảm bảo End Date chỉ sau Start Date
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, reset endDate
    if (endDate && e.target.value > endDate) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/koi-farm/list-farm-active"
        );
        if (Array.isArray(response.data)) {
          console.log(response.data);
          setFarms(response.data); // Lưu danh sách farm vào state
        } else {
          console.error("Failed to fetch farms");
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    fetchFarms();
  }, []);

  useEffect(() => {
    const fetchKois = async () => {
      try {
        const response = await axios.get("http://localhost:8080/kois/all/active");
        if (Array.isArray(response.data)) {
          console.log(response.data);
          setKois(response.data); // Lưu danh sách farm vào state
        } else {
          console.error("Failed to fetch farms");
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    fetchKois();
  }, []);

  const handleDeleteBooking = (tourId) => {};

  const handleNextPage = () => {
    if (currentPage < totalPage - 1) {
      handleSubmit(null, currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      handleSubmit(null, currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white min-h-screen flex flex-col items-center py-10 px-4 mt-20">
      {/* Enhanced Search Form */}
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Discover Your Perfect Tour
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Find your ideal koi farm experience with our curated selection of tours
          </p>
        </div>

        {/* Search Form Card */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Main Search Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Farm Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Farm Location
                </label>
                <Select
                  value={farm}
                  onChange={(value) => setFarm(value)}
                  className="w-full !rounded-xl hover:border-blue-500 focus:border-blue-500"
                  placeholder="Select Farm"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => 
                    option?.children?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Option value="">All Farms</Option>
                  {farms.map((farm) => (
                    <Option key={farm.id} value={farm.id}>
                      {farm.farmName}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Koi Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                  </svg>
                  Koi Type
                </label>
                <Select
                  value={koi}
                  onChange={(value) => setKoi(value)}
                  className="w-full !rounded-xl hover:border-blue-500 focus:border-blue-500"
                  placeholder="Select Koi"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => 
                    option?.children?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Option value="">All Kois</Option>
                  {kois.map((koi) => (
                    <Option key={koi.id} value={koi.id}>
                      {koi.koiName}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <InputNumber
                    placeholder="Min"
                    onChange={(value) => {
                      // Chỉ cho phép số và dấu chấm thập phân
                      if (value && /^[0-9]*\.?[0-9]*$/.test(value.toString())) {
                        setMinPrice(value);
                      }
                    }}
                    className="w-full !rounded-xl"
                    size="large"
                    prefix="$"
                    controls={false}
                    onKeyDown={(e) => {
                      // Ngăn chặn nhập ký tự đặc biệt
                      const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;
                      if (specialChars.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <span className="text-gray-400">-</span>
                  <InputNumber
                    placeholder="Max"
                    onChange={(value) => {
                      // Chỉ cho phép số và dấu chấm thập phân
                      if (value && /^[0-9]*\.?[0-9]*$/.test(value.toString())) {
                        setMaxPrice(value);
                      }
                    }}
                    className="w-full !rounded-xl"
                    size="large"
                    prefix="$"
                    controls={false}
                    onKeyDown={(e) => {
                      // Ngăn chặn nhập ký tự đặc biệt
                      const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;
                      if (specialChars.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Tour Dates
                </label>
                <RangePicker
                  onChange={(dates) => {
                    setStartDate(dates ? dates[0].startOf('day') : null);
                    setEndDate(dates ? dates[1].endOf('day') : null);
                  }}
                  className="w-full !rounded-xl"
                  size="large"
                  disabledDate={(current) => current && current < moment().add(5, "days").startOf("day")}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="primary"
                htmlType="submit"
                className="h-12 px-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Tours
                </div>
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Tour Message */}
      <div className="w-full max-w-6xl text-center mt-8 mb-4">
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ✨ Contact us for customized tour bookings ✨
          </p>
        </div>
      </div>

      {/* Tour Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full max-w-6xl">
        {tours.map((tour) => (
          <div key={tour.id} className="group relative">
            <div className="relative bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  alt={tour.tourName}
                  src={tour.tourImg || "https://via.placeholder.com/400x200"}
                  className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-110"
                />
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
                
                {/* Price Tag */}
                <div className="absolute top-4 right-4 px-4 py-1 rounded-full bg-blue-600/90 backdrop-blur-sm">
                  <span className="text-white font-semibold">${tour.unitPrice}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  {tour.tourName}
                </h3>
                
                <p className="mt-3 text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                  {tour.description}
                </p>

                {/* Date Display */}
                <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500">
                  <span className="bg-blue-100 p-1.5 rounded-full">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="font-medium">
                    {format(new Date(tour.startTime), "dd MMM")} - {format(new Date(tour.endTime), "dd MMM yyyy")}
                  </span>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleBooking(tour)}
                  className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:shadow-lg active:scale-95"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 mb-8">
        <Pagination
          current={currentPage + 1}
          total={totalPage * 10}
          pageSize={10}
          onChange={(page) => setCurrentPage(page - 1)}
          className="[&_.ant-pagination-item-active]:bg-blue-600 [&_.ant-pagination-item-active]:border-blue-600 [&_.ant-pagination-item]:hover:border-blue-600 [&_.ant-pagination-item]:hover:text-blue-600"
        />
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default Tour;
