import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId } = location.state || {};
    
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cookies] = useCookies();
    const token = cookies.token;

    const fetchBookingDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/bookings/ViewDetail/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookingDetails(response.data);
        } catch (err) {
            setError('Failed to fetch booking details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId, token]);

    const handleInputChange = (e, koiDetailId = null) => {
        const { name, value } = e.target;
        
        if (koiDetailId) {
            setBookingDetails(prev => {
                const updatedKoiDetails = prev.koiDetails.map(koi => {
                    if (koi.id === koiDetailId) {
                        return { ...koi, [name]: value };
                    }
                    return koi;
                });
                return { ...prev, koiDetails: updatedKoiDetails };
            });
        } else {
            setBookingDetails(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    
    

    const handleUpdateKoiDetail = async (bookingKoiDetailId) => {
        const updatedKoiDetail = bookingDetails.koiDetails.find(koi => koi.id === bookingKoiDetailId);
        
        const payload = [{
            id: updatedKoiDetail.id,
            koiId: updatedKoiDetail.koiId,
            quantity: updatedKoiDetail.quantity,
            unitPrice: updatedKoiDetail.unitPrice,
        }];

        try {
            await axios.put(`http://localhost:8080/BookingKoiDetail/update/${bookingId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            await fetchBookingDetails();
            
            toast.success("Koi Detail updated successfully!", {
                autoClose: 2000
            });
        } catch (err) {
            setError('Failed to update Koi Detail');
            toast.error("Failed to update Koi Detail", {
                autoClose: 2000
            });
        }
    };
    

    const handleDeleteKoiDetail = async (bookingKoiDetailId) => {
        if (window.confirm("Are you sure you want to delete this Koi Detail?")) {
            try {
                await axios.delete(`http://localhost:8080/BookingKoiDetail/${bookingKoiDetailId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                setBookingDetails(prev => {
                    const updatedKoiDetails = prev.koiDetails.filter(koi => koi.id !== bookingKoiDetailId);
                    const totalAmount = updatedKoiDetails.reduce((total, koi) => total + koi.totalAmount, 0);
                    
                    if (updatedKoiDetails.length === 0) {
                        navigate(`/booking-koi/${bookingId}`); // Điều hướng về trang booking-koi với bookingId
                    }
    
                    return {
                        ...prev,
                        koiDetails: updatedKoiDetails,
                        totalAmount,
                    };
                });
                
                toast.success("Koi Detail deleted successfully!", {
                    autoClose: 2000,
                });
            } catch (err) {
                setError('Failed to delete Koi Detail');
            }
        }
    };
    
    
    const handleConfirm = async () => {
        try {
            await axios.put(
                `http://localhost:8080/bookings/update/status/${bookingId}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            toast.success("Booking confirmed successfully!", {
                autoClose: 2000,
                onClose: () => {
                    navigate('/booking-for-koi-list');
                }
            });
            
        } catch (err) {
            setError('Failed to confirm booking');
            toast.error("Failed to confirm booking", {
                autoClose: 2000
            });
        }
    };

    const handleUpdateBooking = async (e) => {
        e.preventDefault();
        
        try {
            const payload = {
                vat: bookingDetails.vat,
                paymentMethod: bookingDetails.paymentMethod,
                discountAmount: bookingDetails.discountAmount,
                totalAmount: bookingDetails.totalAmount
            };

            await axios.put(`http://localhost:8080/bookings/update/${bookingId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await fetchBookingDetails();
            toast.success("Booking updated successfully!", {
                autoClose: 2000
            });
        } catch (err) {
            setError('Failed to update booking');
            toast.error("Failed to update booking", {
                autoClose: 2000
            });
        }
    };

    if (loading) return <p className="text-black">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto py-8 px-4 mt-20 max-w-6xl bg-[#f8faff]">
            <ToastContainer />
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-gray-800">Koi Booking System</h1>
                <p className="text-gray-600 mt-2">Manage your premium koi booking details</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header Section */}
                <div className="bg-[#2563eb] text-white px-6 py-4">
                    <h2 className="text-xl font-semibold">Booking Details #{bookingId}</h2>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    {/* Customer Info & Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-lg border border-gray-100 p-5">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Customer Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-600">Customer ID</label>
                                    <p className="font-medium text-gray-800">{bookingDetails?.customerID}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Customer Name</label>
                                    <p className="font-medium text-gray-800">{bookingDetails?.nameCus}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-100 p-5">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Booking Summary</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-600">Total Amount (with VAT)</label>
                                    <p className="font-medium text-gray-800">${bookingDetails?.totalAmountWithVAT}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Status</label>
                                    <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {bookingDetails?.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Koi Details Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Koi Details</h3>
                        <div className="space-y-4">
                            {bookingDetails.koiDetails.map((koiDetail) => (
                                <div key={koiDetail.id} className="bg-white border border-gray-100 rounded-lg p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Quantity</label>
                                            <input 
                                                type="number" 
                                                name="quantity" 
                                                value={koiDetail.quantity} 
                                                onChange={(e) => handleInputChange(e, koiDetail.id)} 
                                                className="w-full border border-gray-200 rounded-md p-2 bg-[#f8faff] text-black focus:ring-blue-500 focus:border-blue-500" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Unit Price</label>
                                            <input 
                                                type="number" 
                                                name="unitPrice" 
                                                value={koiDetail.unitPrice} 
                                                onChange={(e) => handleInputChange(e, koiDetail.id)} 
                                                className="w-full border border-gray-200 rounded-md p-2 bg-[#f8faff] text-black focus:ring-blue-500 focus:border-blue-500" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Total Amount</label>
                                            <input 
                                                type="number" 
                                                value={koiDetail.quantity * koiDetail.unitPrice} 
                                                readOnly 
                                                className="w-full border border-gray-200 rounded-md p-2 bg-gray-100 text-black" 
                                            />
                                        </div>
                                        <div className="flex items-end justify-end space-x-2">
                                            <button 
                                                onClick={() => handleUpdateKoiDetail(koiDetail.id)} 
                                                className="px-4 py-2 bg-[#2563eb] text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Update
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteKoiDetail(koiDetail.id)} 
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking Update Form */}
                    <div className="bg-white border border-gray-100 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-6 text-gray-700">Additional Details</h3>
                        <form onSubmit={handleUpdateBooking} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">VAT (%)</label>
                                <input 
                                    type="number" 
                                    name="vat" 
                                    value={bookingDetails?.vat || ''} 
                                    onChange={(e) => handleInputChange(e)} 
                                    className="w-full border border-gray-200 rounded-md p-2 bg-[#f8faff] text-black focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Payment Method</label>
                                <select 
                                    name="paymentMethod" 
                                    value={bookingDetails?.paymentMethod || ''} 
                                    onChange={(e) => handleInputChange(e)} 
                                    className="w-full border border-gray-200 rounded-md p-2 bg-[#f8faff] text-black focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="" className="text-black">Select method</option>
                                    <option value="CASH" className="text-black">Cash</option>
                                    <option value="VISA" className="text-black">Visa</option>
                                    <option value="TRANSFER" className="text-black">Transfer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Discount Amount</label>
                                <input 
                                    type="number" 
                                    name="discountAmount" 
                                    value={bookingDetails?.discountAmount || ''} 
                                    onChange={(e) => handleInputChange(e)} 
                                    className="w-full border border-gray-200 rounded-md p-2 bg-[#f8faff] text-black focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Total Amount With VAT</label>
                                <input 
                                    type="number" 
                                    value={bookingDetails?.totalAmountWithVAT} 
                                    readOnly 
                                    className="w-full border border-gray-200 rounded-md p-2 bg-gray-100 text-black" 
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Update Booking
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleConfirm} 
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>
                                    <span>Confirm</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;
