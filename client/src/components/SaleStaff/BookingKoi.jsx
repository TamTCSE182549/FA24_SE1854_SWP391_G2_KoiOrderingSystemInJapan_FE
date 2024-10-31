import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, message } from "antd";
import { useCookies } from "react-cookie";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

const { Title } = Typography;

const BookingKoi = () => {

    const { bookingId } = useParams(); 
    const [farms, setFarms] = useState([]);
    const [selectedFarmId, setSelectedFarmId] = useState(null);
    const [kois, setKois] = useState([]);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [selectedKoiId, setSelectedKoiId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [vat, setVat] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [selectedKoiOption, setSelectedKoiOption] = useState(null);
    const navigate = useNavigate();
    const [koiOptions, setKoiOptions] = useState([]);

  const [cookies] = useCookies();
  const token = cookies.token;
  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/koi-farm/list-farm-active",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  const handleFarmChange = async (farmId) => {
    setSelectedFarmId(farmId);
    try {
      const response = await axios.get(
        `http://localhost:8080/koi-farm/get/${farmId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const koiList = response.data.koiResponses;
      setKois(koiList);

      // Tạo koiOptions từ danh sách koi
      const options = koiList.map(koi => ({
        value: koi.id,
        label: `${koi.koiName} - ${koi.color} - ${koi.origin}`,
        price: koi.price
      }));
      setKoiOptions(options);
      
    } catch (error) {
      console.error("Error fetching Koi:", error);
      toast.error("Failed to fetch koi list");
    }
  };

  const handleKoiChange = (selectedOption) => {
    setSelectedKoiOption(selectedOption);
    if (selectedOption) {
      setSelectedKoiId(selectedOption.value);
      setUnitPrice(selectedOption.price);
    } else {
      setSelectedKoiId("");
      setUnitPrice("");
    }
  };

  const handleAddKoi = () => {
    const numericQuantity = parseInt(quantity, 10);
    const numericUnitPrice = parseFloat(unitPrice);

    if (selectedKoiId && numericQuantity > 0 && numericUnitPrice > 0) {
      const selectedKoi = kois.find((koi) => koi.id === Number(selectedKoiId));

      if (!selectedKoi) {
        message.error("Koi not found!");
        return;
      }

      const existingDetail = bookingDetails.find(
        (detail) => detail.koiId === selectedKoiId
      );

      if (existingDetail) {
        setBookingDetails((prevDetails) =>
          prevDetails.map((detail) =>
            detail.koiId === selectedKoiId
              ? {
                  ...detail,
                  quantity: numericQuantity,
                  unitPrice: numericUnitPrice,
                }
              : detail
          )
        );
      } else {
        setBookingDetails((prevDetails) => [
          ...prevDetails,
          {
            koiId: selectedKoiId,
            koiName: selectedKoi.koiName,
            quantity: numericQuantity,
            unitPrice: numericUnitPrice,
          },
        ]);
      }

      // Reset form sau khi thêm Koi
      setSelectedKoiId("");
      setSelectedKoiOption(null);
      setQuantity("");
      setUnitPrice("");
    } else {
      message.error("Please select a Koi, enter quantity and unit price.");
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFarmId) {
      toast.error("Please select a farm.");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    if (bookingDetails.length === 0) {
      toast.error("Please add at least one Koi to the booking list.");
      return;
    }

    const bookingKoiRequest = {
      farmId: selectedFarmId,
      paymentMethod,
      vat: parseFloat(vat) / 100,
      discountAmount,
      details: bookingDetails.map((detail) => ({
        koiId: detail.koiId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
      })),
    };

    try {
      await axios.post(
        `http://localhost:8080/bookings/koi/create/${bookingId}`,
        bookingKoiRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Booking successful!", {
        autoClose: 1000,
        onClose: () => {
          navigate("/staff/booking-for-koi-list");
        },
      });
      
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking Failed");
    }
  };

   return (
        <div className="min-h-screen bg-emerald-50 py-12 pt-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Koi Booking System</h1>
                    <p className="mt-2 text-gray-600">
                        Create your premium koi booking with our easy-to-use booking system
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-emerald-600 p-6">
                        <h2 className="text-xl text-white font-semibold">
                            New Booking Details
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        {/* Main Form Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Farm Selection Section */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Farm Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="farm" className="block text-sm font-medium text-gray-700 mb-1">
                                            Select Farm Location
                                        </label>
                                        <select
                                            id="farm"
                                            value={selectedFarmId}
                                            onChange={(e) => handleFarmChange(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all bg-white text-gray-900"
                                        >
                                            <option value="" className="text-gray-900">Choose a farm</option>
                                            {farms.map(farm => (
                                                <option key={farm.id} value={farm.id} className="text-gray-900">{farm.farmName}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="koi" className="block text-sm font-medium text-gray-700 mb-1">
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
                                                    padding: '4px',
                                                    borderWidth: '2px',
                                                    borderColor: state.isFocused ? '#10B981' : '#E5E7EB',
                                                    borderRadius: '0.5rem',
                                                    boxShadow: state.isFocused ? '0 0 0 1px #10B981' : 'none',
                                                    '&:hover': {
                                                        borderColor: '#10B981'
                                                    }
                                                }),
                                                option: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    backgroundColor: state.isSelected 
                                                        ? '#10B981' 
                                                        : state.isFocused 
                                                            ? '#E5E7EB' 
                                                            : 'white',
                                                    color: state.isSelected ? 'white' : '#111827',
                                                    padding: '8px 12px',
                                                    '&:active': {
                                                        backgroundColor: '#059669'
                                                    }
                                                }),
                                                input: (baseStyles) => ({
                                                    ...baseStyles,
                                                    color: '#111827'
                                                }),
                                                singleValue: (baseStyles) => ({
                                                    ...baseStyles,
                                                    color: '#111827'
                                                }),
                                                menu: (baseStyles) => ({
                                                    ...baseStyles,
                                                    backgroundColor: 'white',
                                                    borderRadius: '0.5rem',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                                    marginTop: '4px'
                                                }),
                                                placeholder: (baseStyles) => ({
                                                    ...baseStyles,
                                                    color: '#6B7280'
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Details</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                                Unit Price
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                                <input
                                                    id="unitPrice"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={unitPrice}
                                                    onChange={(e) => setUnitPrice(e.target.value)}
                                                    required={bookingDetails.length === 0}
                                                    className="w-full pl-8 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-gray-900"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                                Quantity
                                            </label>
                                            <input
                                                id="quantity"
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                required={bookingDetails.length === 0}
                                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="button" 
                                        onClick={handleAddKoi} 
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>Add to Booking</span>
                                    </button>
                                </div>
                            </div>

                            {/* Booking Details List - Moved here */}
                            {bookingDetails.length > 0 && (
                                <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Booking Summary</h3>
                                    <div className="space-y-3">
                                        {bookingDetails.map((detail, index) => (
                                            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <h4 className="text-lg font-medium text-gray-900">{detail.koiName}</h4>
                                                        <div className="flex items-center text-sm text-gray-500 space-x-2">
                                                            <span>{detail.quantity} units</span>
                                                            <span>•</span>
                                                            <span>${detail.unitPrice.toLocaleString()} each</span>
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            Total: ${(detail.quantity * detail.unitPrice).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveKoi(detail.koiId)}
                                                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Details Section */}
                            <div className="bg-gray-50 p-6 rounded-xl md:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="vat" className="block text-sm font-medium text-gray-700 mb-1">
                                            VAT (%)
                                        </label>
                                        <input
                                            id="vat"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={vat}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (!isNaN(value) && value >= 0 && value <= 100) {
                                                    setVat(value);
                                                }
                                            }}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-gray-900"
                                            placeholder="Enter VAT percentage (0-100)"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700 mb-1">
                                            Discount Amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                                            <input
                                                id="discountAmount"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={discountAmount}
                                                onChange={(e) => setDiscountAmount(e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                                            Payment Method
                                        </label>
                                        <select
                                            id="paymentMethod"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all bg-white text-gray-900"
                                        >
                                            <option value="" className="text-gray-900">Select method</option>
                                            <option value="CASH" className="text-gray-900">Cash</option>
                                            <option value="VISA" className="text-gray-900">Visa</option>
                                            <option value="TRANSFER" className="text-gray-900">Transfer</option>
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
