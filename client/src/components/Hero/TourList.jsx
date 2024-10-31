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

  const handleSubmit = async (e, page = 0) => {
    e.preventDefault();
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

    // Nếu qua tất cả điều kiện, gửi yêu cầu
    try {
      const response = await axios.post(
        "http://localhost:8080/tour/findTourByFarmNameAndKoiName",
        findTourRequest,
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
        setTours(hardcodedTours); // Dữ liệu tạm thời khi phản hồi không hợp lệ
      }

      console.log("Kết quả từ server:", response.data.content);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
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

  let response = "";
  const fetchTourData = async (page = 0) => {
    try {
      // toast.success("Show all tour success");
      response = await axios.get(
        `http://localhost:8080/tour/showAllPageable?page=${page}`
      );

      if (Array.isArray(response.data.content)) {
        setTours(response.data.content);
        setTotalPage(response.data.totalPage);
      } else {
        setTours(hardcodedTours);
      }
      console.log("Tour Data:", response.data.content);
    } catch (error) {
      console.error("Error fetching tour data:", error);
      console.error("Failed to fetch tour data. Displaying fallback data.");
      setTours(hardcodedTours); // Display hardcoded data on API failure
    }
  };

  useEffect(() => {
    fetchTourData(currentPage); // Gọi API mỗi khi `currentPage` thay đổi
  }, [currentPage]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        response = await axios.get(
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
        response = await axios.get("http://localhost:8080/kois/all/active");
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
      setCurrentPage((prevPage) => prevPage + 1); // Tăng trang nếu chưa đến trang cuối
      window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn về đầu trang
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1); // Giảm trang nếu chưa đến trang đầu
      window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn về đầu trang
    }
  };

  return (

    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="bg-white w-full max-w-5xl p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Find Your Tour</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600">Farm</label>
              <Select
                value={farm}
                onChange={(value) => setFarm(value)}
                className="w-full"
                placeholder="Select Farm"
              >
                <Option value="">All Farms</Option>
                {farms.map((farm) => (
                  <Option key={farm.id} value={farm.id}>
                    {farm.farmName}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-gray-600">Koi</label>
              <Select
                value={koi}
                onChange={(value) => setKoi(value)}
                className="w-full"
                placeholder="Select Koi"
              >
                <Option value="">All Kois</Option>
                {kois.map((koi) => (
                  <Option key={koi.id} value={koi.id}>
                    {koi.koiName}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-medium">Price Range (USD)</label>
              <InputNumber
                placeholder="Min Price"
                min="0"
                value={minPrice}
                onChange={(value) => setMinPrice(value)}
                className="w-full"
              />
              <span className="mx-1">-</span>
              <InputNumber
                placeholder="Max Price"
                value={maxPrice}
                onChange={(value) => setMaxPrice(value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-gray-600">Select Date Range</label>
              <RangePicker
                onChange={(dates) => {
                  setStartDate(dates ? dates[0].startOf('day') : null);
                  setEndDate(dates ? dates[1].endOf('day') : null);
                }}
                className="w-full"
                disabledDate={(current) => {
                  // Ngăn chọn các ngày cách ngày hiện tại ít hơn 5 ngày
                  return (
                    current && current < moment().add(5, "days").startOf("day")
                  );
                }}
              />
            </div>
          </div>

          <Button type="primary" htmlType="submit" className="w-full mt-4">
            Search
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full max-w-5xl">
        {tours.map((tour) => (
          <Card
            key={tour.id}
            hoverable
            cover={
              <img
                alt={tour.tourName}
                src={tour.tourImg || "https://via.placeholder.com/400x200"}
                className="object-cover h-48 w-full"
              />
            }
            className="shadow-lg rounded-lg"
          >
            <Card.Meta
              title={<h3 className="text-xl font-semibold">{tour.tourName}</h3>}
              description={
                <>
                  <p className="text-gray-700 text-base mb-4">{tour.description}</p>
                  <p className="text-sm text-gray-500">
                    From{" "}
                    <strong className="text-red-500">
                      {format(new Date(tour.startTime), "dd/MM/yyyy")}
                    </strong>
                    {" "}To{" "}
                    <strong className="text-red-500">
                      {format(new Date(tour.endTime), "dd/MM/yyyy")}
                    </strong>
                  </p>
                  <p className="text-blue-500 text-lg font-semibold mt-3">{tour.unitPrice} USD</p>
                </>
              }
            />
            <Button
              type="primary"
              className="w-full mt-4"
              onClick={() => handleBooking(tour)}
            >
              View Detail
            </Button>
          </Card>
        ))}
      </div>

      <Pagination
        current={currentPage + 1}
        total={totalPage * 10}
        pageSize={10}
        onChange={(page) => setCurrentPage(page - 1)}
        className="mt-8"
      />
      <ToastContainer/>
    </div>
  );
};

export default Tour;
