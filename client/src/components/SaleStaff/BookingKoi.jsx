import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, message } from "antd";
import { useCookies } from "react-cookie";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

const { Title } = Typography;

const BookingKoi = () => {
  const { bookingId } = useParams();
  console.log("Current bookingId:", bookingId); // Log để kiểm tra bookingId

  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [kois, setKois] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedKoiId, setSelectedKoiId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [vat, setVat] = useState(10);
  const [discountAmount, setDiscountAmount] = useState("");
  const [selectedKoiOption, setSelectedKoiOption] = useState(null);
  const navigate = useNavigate();
  const [koiOptions, setKoiOptions] = useState([]);
  const [tourFarms, setTourFarms] = useState([]);
  const [farmKois, setFarmKois] = useState([]);
  const [checkinList, setCheckinList] = useState([]);
  const [selectedCheckinId, setSelectedCheckinId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [cookies] = useCookies();
  const token = cookies.token;
  useEffect(() => {
    const fetchTourFarms = async () => {
      try {
        // 1. Lấy booking tour detail để có tourID
        const bookingTourResponse = await axios.get(
          `http://localhost:8080/BookingTourDetail/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Booking tour response:", bookingTourResponse.data); // Debug log

        // Kiểm tra response là array và có phần tử
        if (
          !bookingTourResponse.data ||
          !Array.isArray(bookingTourResponse.data) ||
          bookingTourResponse.data.length === 0
        ) {
          toast.error("Booking tour detail not found");
          return;
        }

        const tourId = bookingTourResponse.data[0].tourID; // Lấy tourID từ phần tử đầu tiên của array
        console.log("Tour ID:", tourId); // Debug log

        // 2. Lấy tour detail để có danh sách farm
        const tourDetailResponse = await axios.get(
          `http://localhost:8080/TourDetail/tour/${tourId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 3. Map danh sách farm
        const farmList = tourDetailResponse.data
          .filter((detail) => detail && detail.farmName)
          .map((detail) => ({
            id: detail.farmId,
            farmName: detail.farmName,
          }));

        console.log("Farm list:", farmList); // Debug log

        if (farmList.length === 0) {
          toast.warning("No farms available from this tour");
          return;
        }

        setFarms(farmList);
      } catch (error) {
        console.error("Error fetching tour farms:", error);
        toast.error("Failed to fetch farm information");
      }
    };

    if (bookingId) {
      fetchTourFarms();
    }
  }, [bookingId, token]);

  const handleFarmChange = async (e) => {
    const farmId = e.target.value;

    if (!farmId || farmId === "") {
      setSelectedFarmId(null);
      setKois([]);
      setKoiOptions([]);
      return;
    }

    const numericFarmId = parseInt(farmId, 10);

    if (isNaN(numericFarmId)) {
      console.error("Invalid farmId:", farmId);
      toast.error("Invalid farm selection");
      return;
    }

    setSelectedFarmId(numericFarmId);

    try {
      const response = await axios.get(
        `http://localhost:8080/koi-farm/get/${numericFarmId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const koiList = response.data.koiResponses || [];
      setKois(koiList);

      const options = koiList.map((koi) => ({
        value: koi.id,
        label: `${koi.koiName} - ${koi.color} - ${koi.origin}`,
        price: koi.price,
      }));
      setKoiOptions(options);
    } catch (error) {
      console.error("Error fetching Koi:", error);
      toast.error("Failed to fetch koi list");
      setKois([]);
      setKoiOptions([]);
    }
  };

  const handleKoiChange = (selectedOption) => {
    setSelectedKoiOption(selectedOption);
    if (selectedOption) {
      const newKoiId = selectedOption.value.toString(); // Chuyển về string để đồng nhất kiểu dữ liệu
      console.log("Selected Koi ID:", newKoiId); // Debug log
      setSelectedKoiId(newKoiId);
      setUnitPrice(selectedOption.price);
    } else {
      setSelectedKoiId("");
      setUnitPrice("");
    }
  };

  const handleAddKoi = () => {
    if (!selectedKoiId || !quantity || !unitPrice) {
      toast.error("Please select a koi and enter quantity and price");
      return;
    }

    // Kiểm tra số lượng và đơn giá là số dương
    const quantityNum = parseInt(quantity);
    const unitPriceNum = parseFloat(unitPrice);

    if (quantityNum <= 0) {
      toast.error("Quantity must be greater than 0");
      setQuantity(""); // Reset quantity
      return;
    }

    if (unitPriceNum <= 0) {
      toast.error("Unit price must be greater than 0");
      setUnitPrice(""); // Reset unit price
      return;
    }

    // Kiểm tra cá có tồn tại trong farm không
    const selectedKoi = kois.find(
      (koi) => koi.id.toString() === selectedKoiId.toString()
    );
    if (!selectedKoi) {
      toast.error("Selected koi not found in farm");
      return;
    }

    // Kiểm tra số lượng có vượt quá s lượng trong farm không
    const existingKoiIndex = bookingDetails.findIndex(
      (detail) => detail.koiId === selectedKoiId
    );
    const currentBookedQuantity =
      existingKoiIndex !== -1 ? bookingDetails[existingKoiIndex].quantity : 0;
    const newTotalQuantity = currentBookedQuantity + quantityNum;

    if (newTotalQuantity > selectedKoi.quantity) {
      toast.error(
        `Not enough koi in stock. Available: ${
          selectedKoi.quantity - currentBookedQuantity
        }`
      );
      return;
    }

    if (existingKoiIndex !== -1) {
      // Cập nhật số lượng cho cá đã tồn tại
      setBookingDetails((prevDetails) => {
        const updatedDetails = [...prevDetails];
        updatedDetails[existingKoiIndex] = {
          ...updatedDetails[existingKoiIndex],
          quantity: newTotalQuantity,
          unitPrice: parseFloat(unitPrice),
        };
        return updatedDetails;
      });

      toast.success(
        `Updated quantity of ${selectedKoi.koiName} to ${newTotalQuantity}`
      );
    } else {
      // Thêm cá mới
      const newBookingDetail = {
        farmId: selectedFarmId,
        koiId: selectedKoiId,
        koiName: selectedKoi.koiName,
        quantity: quantityNum,
        unitPrice: parseFloat(unitPrice),
      };

      setBookingDetails((prev) => [...prev, newBookingDetail]);
      toast.success(`Added ${quantity} ${selectedKoi.koiName} to booking`);
    }

    // Reset form
    setSelectedKoiOption(null);
    setSelectedKoiId("");
    setQuantity("");
    setUnitPrice("");
  };
  const handleRemoveKoi = (koiId) => {
    setBookingDetails((prevDetails) =>
      prevDetails.filter((detail) => detail.koiId !== koiId)
    );
  };
  const resetForm = () => {
    setSelectedFarmId(null);
    setKois([]);
    setBookingDetails([]);
    setPaymentMethod("");
    setSelectedKoiId("");
    setSelectedKoiOption(null);
    setQuantity("");
    setUnitPrice("");
    setVat("");
    setDiscountAmount("");
  };

  useEffect(() => {
    const fetchCheckinList = async () => {
      try {
        // Log trước khi gọi API
        console.log("Fetching checkins for bookingId:", bookingId);

        const response = await axios.get(
          `http://localhost:8080/checkins/status/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Log response
        console.log("Checkin API response:", response.data);

        setCheckinList(response.data);
      } catch (error) {
        console.error("Error details:", error.response || error);
        toast.error("Failed to fetch checkin list");
      }
    };

    // Chỉ gọi API khi có bookingId và nó là một số hợp lệ
    if (bookingId && !isNaN(bookingId)) {
      fetchCheckinList();
    } else {
      console.error("Invalid bookingId:", bookingId);
    }
  }, [bookingId, token]);

  const calculateTotal = (details) => {
    return details.reduce((total, detail) => {
      return total + detail.quantity * detail.unitPrice;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bookingDetails.length === 0) {
      toast.error("Please add at least one koi to booking");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // Thêm validation cho Discount Amount
    const subtotal = calculateTotal(bookingDetails);
    if (parseFloat(discountAmount) > subtotal) {
      toast.error("Discount amount cannot exceed subtotal amount");
      return;
    }

    try {
      const requestData = {
        chekinId: parseInt(selectedCheckinId),
        paymentMethod: paymentMethod,
        details: bookingDetails.map((detail) => ({
          farmId: detail.farmId,
          koiId: parseInt(detail.koiId),
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
        })),
        vat: parseFloat(vat || 0) / 100,
        discountAmount: parseFloat(discountAmount || 0),
      };

      console.log("Submitting data:", requestData);

      const response = await axios.post(
        `http://localhost:8080/bookings/koi/create/${bookingId}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Booking response:", response.data);
      toast.success("Booking created successfully");
      resetForm();
      navigate("/staff/booking-for-koi-list");
    } catch (error) {
      console.error("Booking error:", error.message);
      toast.error(error.response?.data?.message || "Booking Failed");
    }
  };

  const handleCustomerSelect = (e) => {
    const checkinId = e.target.value;
    console.log("Selected checkin ID:", checkinId);
    setSelectedCheckinId(checkinId);

    // Tìm thông tin khách hàng từ checkinList
    const selectedCheckin = checkinList.find(
      (checkin) => checkin.id === parseInt(checkinId)
    );
    console.log("Selected customer info:", selectedCheckin);

    if (selectedCheckin) {
      setSelectedCustomer(selectedCheckin);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-12 pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Koi Booking System
          </h1>
          <p className="mt-2 text-gray-600">
            Create your premium koi booking with our easy-to-use booking system
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Customer Selection - Moved to top */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Customer Selection
                </h3>
                <div>
                  <label
                    htmlFor="checkin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Customer from Checkin List
                  </label>
                  <select
                    id="checkin"
                    value={selectedCheckinId}
                    onChange={handleCustomerSelect}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all bg-white text-gray-900"
                  >
                    <option value="">Choose a customer</option>
                    {checkinList.map((checkin) => (
                      <option
                        key={checkin.id}
                        value={checkin.id}
                        className="text-gray-900"
                      >
                        {`${checkin.firstName} ${checkin.lastName}`}
                      </option>
                    ))}
                  </select>

                  {/* Hiển thị thông tin khách hàng đã chọn */}
                  {selectedCustomer && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected customer: {selectedCustomer.firstName}{" "}
                      {selectedCustomer.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Farm Selection Section */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Farm Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="farm"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select Farm Location
                    </label>
                    <select
                      id="farm"
                      value={selectedFarmId || ""}
                      onChange={handleFarmChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all bg-white text-gray-900"
                    >
                      <option value="">Choose a farm</option>
                      {farms.map((farm) => (
                        <option
                          key={farm.id}
                          value={farm.id}
                          className="text-gray-900"
                        >
                          {farm.farmName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="koi"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select Koi Type
                    </label>
                    <Select
                      id="koi"
                      value={selectedKoiOption}
                      onChange={handleKoiChange}
                      options={koiOptions}
                      isSearchable={true}
                      isClearable={true}
                      placeholder="Search and select a koi..."
                      className="text-gray-900"
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          padding: "4px",
                          borderWidth: "2px",
                          borderColor: state.isFocused ? "#10B981" : "#E5E7EB",
                          borderRadius: "0.5rem",
                          boxShadow: state.isFocused
                            ? "0 0 0 1px #10B981"
                            : "none",
                          "&:hover": {
                            borderColor: "#10B981",
                          },
                        }),
                        option: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: state.isSelected
                            ? "#10B981"
                            : state.isFocused
                            ? "#E5E7EB"
                            : "white",
                          color: state.isSelected ? "white" : "#111827",
                          padding: "8px 12px",
                          "&:active": {
                            backgroundColor: "#059669",
                          },
                        }),
                        input: (baseStyles) => ({
                          ...baseStyles,
                          color: "#111827",
                        }),
                        singleValue: (baseStyles) => ({
                          ...baseStyles,
                          color: "#111827",
                        }),
                        menu: (baseStyles) => ({
                          ...baseStyles,
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          marginTop: "4px",
                        }),
                        placeholder: (baseStyles) => ({
                          ...baseStyles,
                          color: "#6B7280",
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Pricing Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="unitPrice"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Unit Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">
                          VND
                        </span>
                        <input
                          id="unitPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={unitPrice}
                          onChange={(e) => {
                            setUnitPrice(e.target.value);
                          }}
                          className="w-full pl-16 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-gray-900"
                          placeholder="Enter unit price"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Quantity
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-gray-900"
                        placeholder="Enter quantity"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddKoi}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Add to Booking</span>
                  </button>
                </div>
              </div>

              {/* Koi List Section */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Selected Koi List
                </h3>

                {bookingDetails.length > 0 ? (
                  <div className="space-y-4">
                    {/* Thêm max-height và overflow-auto */}
                    <div className="max-h-[400px] overflow-auto pr-2">
                      {bookingDetails.map((detail, index) => (
                        <div
                          key={detail.koiId}
                          className={`bg-white rounded-lg shadow p-4 relative ${
                            index !== bookingDetails.length - 1 ? "mb-4" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                {detail.koiName}
                              </h4>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-600">
                                    Quantity
                                  </p>
                                  <p className="text-base font-medium text-gray-900">
                                    {detail.quantity} Kois
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-600">
                                    Unit Price
                                  </p>
                                  <p className="text-base font-medium text-gray-900">
                                    {detail.unitPrice.toLocaleString()} VND
                                  </p>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-600">
                                    Subtotal:
                                  </span>
                                  <span className="text-lg font-bold text-emerald-600">
                                    {(detail.quantity * detail.unitPrice).toLocaleString()} VND
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Nút xóa */}
                            <button
                              type="button"
                              onClick={() => handleRemoveKoi(detail.koiId)}
                              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tổng cộng */}
                    <div className="mt-4 p-4 bg-white rounded-lg shadow">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-emerald-600">
                          {calculateTotal(bookingDetails).toLocaleString()} VND
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No koi selected yet. Please select koi from above.
                  </div>
                )}
              </div>

              {/* Additional Details Section */}
              <div className="bg-gray-50 p-6 rounded-xl md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="vat"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      VAT (%)
                    </label>
                    <input
                      id="vat"
                      type="number"
                      value={vat}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setVat(10);
                          return;
                        }

                        const numValue = parseFloat(value);
                        if (numValue < 0 || numValue > 100) {
                          toast.error("VAT must be between 0 and 100");
                          return;
                        }
                        setVat(value);
                      }}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-gray-900"
                      placeholder="Enter VAT percentage (0-100)"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="discountAmount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Discount Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">
                        VND
                      </span>
                      <input
                        id="discountAmount"
                        type="number"
                        value={discountAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            setDiscountAmount("");
                            return;
                          }

                          const numValue = parseFloat(value);
                          if (numValue < 0) {
                            toast.error("Discount amount cannot be negative");
                            return;
                          }
                          setDiscountAmount(value);
                        }}
                        className="w-full pl-16 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-gray-900"
                        placeholder="Enter discount amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all bg-white text-gray-900"
                    >
                      <option value="" className="text-gray-900">
                        Select method
                      </option>
                      <option value="CASH" className="text-gray-900">
                        Cash
                      </option>
                      <option value="VISA" className="text-gray-900">
                        Visa
                      </option>
                      <option value="TRANSFER" className="text-gray-900">
                        Transfer
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create Booking
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookingKoi;
