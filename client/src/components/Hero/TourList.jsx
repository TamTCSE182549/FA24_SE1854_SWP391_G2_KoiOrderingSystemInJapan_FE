import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
// import {Select} from 'react-select';
import { jwtDecode } from "jwt-decode"; // Để decode JWT
// import { q } from "framer-motion/client";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";

const Tour = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const [tours, setTours] = useState([]); // State to store tour data
  const [farms, setFarms] = useState([]);
  const [kois, setKois] = useState([]);
  const [filters, setFilters] = useState({
    privatePool: false,
    villas: false,
    swimmingPool: false,
    beachfront: false,
    parking: false,
  });
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
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("all");
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

    // Điều kiện hợp lệ cho giá và ngày tháng
    const isPriceValid = minPrice == 0 || (minPrice > 0 && maxPrice > minPrice);
    const isDateValid = (startDate && endDate) || (!startDate && !endDate);

    // Kiểm tra điều kiện
    if (!isPriceValid) {
      toast.warn("Please input MAX UNIT PRICE larger than MIN UNIT PRICE");
      return;
    }

    if (!isDateValid) {
      toast.warn("Please choose both START DATE and END DATE.");
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

  // Hàm xử lý khi người dùng chọn một giá trị
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    // Reset lại ô tìm kiếm khi chọn "All"
    if (event.target.value === "all") {
      setSearchKeyword("");
      fetchTourData(0); // Gọi lại dữ liệu khi chọn "All"
    } else {
      return;
    }
  };

  const handleSearch = () => {
    if (selectedValue === "all") {
      // Khi chọn "all", tải lại dữ liệu
      fetchTourData(0); // Reset lại trang về 0 và gọi API
    } else if (searchKeyword.trim() === "") {
      // Nếu ô tìm kiếm trống khi chọn các tùy chọn khác
      toast.warn("Please choose another option to use search function");
    } else {
      // Gọi API tìm kiếm với từ khóa searchKeyword
      fetchTourData(0, searchKeyword); // Reset lại trang về 0 và gọi API với từ khóa
    }

    // if(farm != "" && koi != "" && minPrice != "" && maxPrice != "" && startDate != "" && endDate != ""){
    //   if(minPrice < maxPrice) {

    //   }
    // }
  };

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
  const fetchTourData = async (page = 0, keyword = "") => {
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
    fetchTourData(currentPage, searchKeyword); // Gọi API mỗi khi `currentPage` thay đổi
  }, [currentPage, selectedValue]);

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

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const handleDeleteBooking = (tourId) => {};

  const filteredTours = tours.filter((tour) => {
    if (filters.privatePool && !tour.facilities.privatePool) return false;
    if (filters.villas && !tour.facilities.villas) return false;
    if (filters.swimmingPool && !tour.facilities.swimmingPool) return false;
    return true; // Return all tours that match the filters
  });

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
    <div className="mt-40 ml-20 mr-20 mb-20">
      <div className="flex-grow">
        <div className="container mx-auto">
          <div className="">
            {/* Tour List */}
            <div className="ml-4 backdrop-blur-2xl p-10">
              {/* ------------------------------ */}
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 mb-20 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Farm</label>
                    <select
                      value={farm}
                      onChange={(e) => setFarm(e.target.value)}
                      // onChange={handleChangeTour}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                    >
                      <option value="">Choose Farm</option>
                      {farms.map((farm) => (
                        <option key={farm.id} value={farm.id}>
                          {farm.farmName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700">Koi</label>
                    <select
                      value={koi}
                      onChange={(e) => setKoi(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                    >
                      <option value="">Koi Name</option>
                      {kois.map((koi) => (
                        <option key={koi.id} value={koi.id}>
                          {koi.koiName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700">
                      Unit Price Domain (USD)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min Unit Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-black"
                      />
                      <input
                        type="number"
                        placeholder="Max Unit Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700">
                      Start Date - End Date
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        min={minStartDate} // Giới hạn ngày bắt đầu
                        className="w-full p-2 border border-gray-300 rounded text-black"
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        min={startDate} // Giới hạn ngày kết thúc phải sau ngày bắt đầu
                        className="w-full p-2 border border-gray-300 rounded text-black"
                        disabled={!startDate} // Vô hiệu hóa nếu chưa chọn start date
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
                >
                  Search
                </button>
              </form>
              {/* ------------------- */}
              {/* <div className="flex items-center mb-4">
                <h1 className="text-2xl font-bold text-blac mr-4">Tour List</h1>
                <input
                  type="search"
                  placeholder="Search..."
                  aria-label="Search"
                  className="border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 text-black"
                  value={searchKeyword} // Liên kết với state searchKeyword
                  onChange={(e) => setSearchKeyword(e.target.value)} // Cập nhật state khi nhập từ khóa
                  disabled={selectedValue === "all"} // Disable ô tìm kiếm khi chọn "All"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600"
                  onClick={handleSearch}
                >
                  Search
                </button>
                <div>
                  <select
                    className="text-black ml-20"
                    value={selectedValue}
                    onChange={handleChange}
                  >
                    <option value="all">All</option>
                    <option value="tour name">Find by Tour Name</option>
                    <option value="koi name">Find by Koi Name</option>
                  </select>
                </div>
              </div> */}

              <div className="flex flex-wrap -mx-4">
                {tours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-slate-300 shadow-lg rounded-lg overflow-hidden flex flex-col justify-between w-full sm:w-1/2 md:w-1/3 mb-10"
                  >
                    <img
                      src={
                        tour.tourImg
                          ? tour.tourImg
                          : `https://via.placeholder.com/400x200?text=No+image`
                      }
                      alt={tour.tourName}
                      className="w-full h-64 object-cover shadow-2xl"
                    />
                    <div className="p-4 flex-grow">
                      <h3 className="text-xl font-bold mb-2 text-black">
                        {tour.tourName}
                      </h3>
                      <p className="text-gray-700 mb-2">{tour.description}</p>
                      <p className="text-sm text-gray-500">
                        Price: {tour.unitPrice} USD
                      </p>
                      <p className="text-sm text-gray-500">
                        Max Participants: {tour.maxParticipants}
                      </p>
                      <p className="text-sm text-gray-500">
                        Remaining: {tour.remaining}
                      </p>
                      <p className="text-sm text-gray-500">
                        Start Time: {new Date(tour.startTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        End Time: {new Date(tour.endTime).toLocaleString()}
                      </p>
                    </div>

                    {(role === "CUSTOMER" || !token) && (
                      <div className="p-4 flex">
                        <button
                          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                          onClick={() => handleBooking(tour)}
                        >
                          View Detail
                        </button>
                        {tour.paymentStatus === "pending" && (
                          <button
                            className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-900"
                            onClick={() => handleDeleteBooking(tour.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                    {role === "MANAGER" && (
                      <div className="flex p-4 gap-2">
                        <button
                          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
                          onClick={() => handleBooking(tour)}
                        >
                          Update Tour
                        </button>
                        <button
                          className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                          onClick={() => handleBooking(tour)}
                        >
                          Delete Tour
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Pagination Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  className={`px-4 py-2 bg-gray-300 rounded-lg ${
                    currentPage === 0
                      ? "cursor-not-allowed"
                      : "hover:bg-blue-400"
                  }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
                <button
                  className={`px-4 py-2 bg-gray-300 rounded-lg ${
                    currentPage === totalPage - 1
                      ? "cursor-not-allowed"
                      : "hover:bg-blue-400"
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPage - 1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Tour;
