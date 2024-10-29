
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, message } from "antd";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;

const BookingKoi = () => {
    const { bookingId } = useParams(); 
    const [farms, setFarms] = useState([]);
    const [selectedFarmId, setSelectedFarmId] = useState(null);
    const [kois, setKois] = useState([]);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [editingBookingId, setEditingBookingId] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [selectedKoiId, setSelectedKoiId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [vat, setVat] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const navigate = useNavigate();


    const [cookies] = useCookies();
    const token = cookies.token;
    useEffect(() => {
        fetchFarms();
    }, []);

    const fetchFarms = async () => {
        try {
            const response = await axios.get('http://localhost:8080/koi-farm/list-farm-active', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFarms(response.data);
        } catch (error) {
            console.error('Error fetching farms:', error);
        }
    };

    

    const handleFarmChange = async (farmId) => {
        setSelectedFarmId(farmId);
        try {
            const response = await axios.get(`http://localhost:8080/koi-farm/get/${farmId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setKois(response.data.koiResponses);
        } catch (error) {
            console.error('Error fetching Koi:', error);
        }
    };

    const handleKoiChange = (event) => {
        const koiId = event.target.value;
        setSelectedKoiId(koiId);
        console.log('Selected Koi ID:', koiId); 
    };

    const handleAddKoi = () => {
        const numericQuantity = parseInt(quantity, 10);
        const numericUnitPrice = parseFloat(unitPrice);
    
        if (selectedKoiId && numericQuantity > 0 && numericUnitPrice > 0) {
            const selectedKoi = kois.find(koi => koi.id === Number(selectedKoiId));
;
    
            console.log('Selected Koi ID:', selectedKoiId); 
            console.log('Kois:', kois); 
            console.log('Selected Koi:', selectedKoi); 
    
            if (!selectedKoi) {
                message.error('Koi not found!');
                return;
            }
    
            const existingDetail = bookingDetails.find(detail => detail.koiId === selectedKoiId);
    
            if (existingDetail) {
                setBookingDetails(prevDetails =>
                    prevDetails.map(detail =>
                        detail.koiId === selectedKoiId
                            ? { ...detail, quantity: numericQuantity, unitPrice: numericUnitPrice }
                            : detail
                    )
                );
            } else {
                // Thêm Koi mới vào danh sách
                setBookingDetails(prevDetails => [
                    ...prevDetails,
                    { koiId: selectedKoiId, koiName: selectedKoi.koiName, quantity: numericQuantity, unitPrice: numericUnitPrice }
                ]);
            }
            
            // Reset form sau khi thêm Koi
            setSelectedKoiId('');
            setQuantity('');
            setUnitPrice('');
        } else {
            message.error('Please select a Koi, enter quantity and unit price.');
        }
    };
    const handleRemoveKoi = (koiId) => {
        setBookingDetails(prevDetails => prevDetails.filter(detail => detail.koiId !== koiId));
    };
    const resetForm = () => {
        setSelectedFarmId(null);
        setKois([]);
        setBookingDetails([]);
        setPaymentMethod('');
        setSelectedKoiId('');
        setQuantity('');
        setUnitPrice('');
        setQuantity('');
        setUnitPrice('');
        setVat("");
        setDiscountAmount("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        
        if (!selectedFarmId) {
            console.warn('Please select a farm.');
            return; 
        }
    
        
        if (!paymentMethod) {
            console.warn('Please select a payment method.');
            return; 
        }
    
        
        if (bookingDetails.length === 0) {
            console.warn('Please add at least one Koi to the booking list.');
            return; 
        }
    
        const bookingKoiRequest = {
            farmId: selectedFarmId,
            paymentMethod,
            vat,
            discountAmount,
            details: bookingDetails.map(detail => ({
                koiId: detail.koiId,
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
            })),
        };
        console.log("Booking Request:", bookingKoiRequest);
        try {
            const response = await axios.post(`http://localhost:8080/bookings/koi/create/${bookingId}`, bookingKoiRequest, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Booking successful!", {
                autoClose: 1000,
                onClose: () => {
                    navigate('/booking-detail', {
                        state: {
                            bookingId: response.data.id,
                            selectedFarmId: selectedFarmId
                        }
                    });
                }
            });
            console.log('Booking created successfully:', response.data);
            resetForm(); 
        } catch (error) {
            toast.error("Booking Failed");
            console.error('Error creating booking:', error);
        }
    };
    
    

    return (
        <div className="container mx-auto py-10 px-4 mt-40">
            <Title level={2} className="text-3xl font-bold text-black text-center mb-6">Create Koi Booking</Title>
            <form onSubmit={editingBookingId ? handleUpdateBooking : handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                <div className="mb-4">
                    <label htmlFor="farm" className="block text-lg font-semibold text-black mb-2">Choose Farm:</label>
                    <select
                        id="farm"
                        value={selectedFarmId}
                        onChange={(e) => handleFarmChange(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    >
                        <option value="">Select a farm</option>
                        {farms.map(farm => (
                            <option key={farm.id} value={farm.id} className="text-black">{farm.farmName}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="koi" className="block text-lg font-semibold text-black mb-2">Choose Koi:</label>
                    <select
                    id="koi"
                    value={selectedKoiId}
                    onChange={handleKoiChange}
                    required={bookingDetails.length === 0} 
                    className="w-full p-2 border border-gray-300 rounded-lg text-black"
                >
                    <option value="">Select a Koi</option>
                    {kois.map(koi => (
                        <option key={koi.id} value={koi.id} className="text-black">{koi.koiName}</option>
                    ))}
                </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="unitPrice" className="block text-lg font-semibold text-black mb-2">Unit Price:</label>
                    <input
                        id="unitPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        required={bookingDetails.length === 0}
                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-lg font-semibold text-black mb-2">Quantity:</label>
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        step="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required={bookingDetails.length === 0}
                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                </div>

                    {/* Hiển thị danh sách Koi đã thêm */}
                    {bookingDetails.length > 0 && (
    <div className="mb-4">
        <Title level={4} className="text-xl font-bold text-black mb-2">Booking Koi Details</Title>
        <ul className="list-disc list-inside">
            {bookingDetails.map((detail, index) => (
                <li key={index} className="text-black">
                    {`Koi Name: ${detail.koiName}, Quantity: ${detail.quantity}, Unit Price: ${detail.unitPrice}`}
                    <button
                        type="button"
                        onClick={() => handleRemoveKoi(detail.koiId)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded ml-4"
                    >
                        Xóa
                    </button>
                </li>
            ))}
        </ul>
    </div>
)}
                <div className="mb-4">
                    <button type="button" onClick={handleAddKoi} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Add Koi</button>
                </div>

                 <div className="mb-4">
                    <label htmlFor="vat" className="block text-lg font-semibold text-black mb-2">VAT:</label>
                    <input
                        id="vat"
                        type="number"
                        min="0"
                        step="0.01"
                        value={vat}
                        onChange={(e) => setVat(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                </div>


                <div className="mb-4">
                    <label htmlFor="discountAmount" className="block text-lg font-semibold text-black mb-2">Discount Amount:</label>
                    <input
                        id="discountAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="paymentMethod" className="block text-lg font-semibold text-black mb-2">Payment Method:</label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    >
                        <option value="">Select a payment method</option>
                        <option value="CASH">Cash</option>
                        <option value="VISA">VISA</option>
                        <option value="TRANSFER">TRANSFER</option>
                    </select>
                </div>

                

                <div className="flex justify-center">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        {editingBookingId ? 'Update Booking' : 'Create Booking'}
                    </button>
                    <ToastContainer />
                </div>
            </form>
        </div>
    );
};

export default BookingKoi;
