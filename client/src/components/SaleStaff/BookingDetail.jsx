import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Thêm hàm helper để xác định màu sắc cho status
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'delivery':
      return 'bg-purple-100 text-purple-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'complete':
      return 'bg-green-100 text-green-800';
    case 'shipping':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Thêm hàm helper để kiểm tra trạng thái có cho phép edit không
const isEditableStatus = (status) => {
  return !['shipping', 'complete', 'cancelled'].includes(status?.toLowerCase());
};

const BookingDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId } = location.state || {};
    
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [depositDetail, setDepositDetail] = useState(null);
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

    const fetchDepositDetails = async () => {
        try {
            console.log("Fetching deposit details for bookingId:", bookingId);
            const response = await axios.get(`http://localhost:8080/deposit/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            
            if (response.data) {
                // Nếu response.data là array
                if (Array.isArray(response.data)) {
                    if (response.data.length > 0) {
                        console.log("Setting deposit detail from array:", response.data[0]);
                        setDepositDetail(response.data[0]);
                    } else {
                        console.log("No deposit found in array");
                        setDepositDetail(null);
                    }
                } 
                // Nếu response.data là object
                else {
                    console.log("Setting deposit detail from object:", response.data);
                    setDepositDetail(response.data);
                }
            } else {
                console.log("No deposit data received");
                setDepositDetail(null);
            }
        } catch (err) {
            console.error("Error fetching deposit details:", err);
            setDepositDetail(null);
        }
    };

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetails();
            fetchDepositDetails();
        }
    }, [bookingId, token]);

    useEffect(() => {
        console.log("Current depositDetail:", depositDetail);
    }, [depositDetail]);

    const handleInputChange = (e, bookingKoiDetailId = null) => {
        const { name, value } = e.target;
        
        // Validation cho VAT
        if (name === 'vat') {
            let vatValue = parseFloat(value);
            if (vatValue < 0) {
                // Chuyển s âm thành dương
                vatValue = Math.abs(vatValue);
                toast.error("VAT percentage cannot be negative", {
                    autoClose: 2000
                });
            } else if (vatValue > 100) {
                // Giới hạn ở 100
                vatValue = 100;
                toast.warning("VAT has been set to maximum (100%)", {
                    autoClose: 2000
                });
            }
            // Cập nhật state với giá trị đã được xử lý
            setBookingDetails(prev => ({
                ...prev,
                [name]: vatValue / 100
            }));
            return;
        }

        // Validation cho Discount Amount
        if (name === 'discountAmount') {
            let discountValue = parseFloat(value);
            if (discountValue < 0) {
                // Chuyển số âm thành dương
                discountValue = Math.abs(discountValue);
                toast.warning("Discount amount has been converted to positive value", {
                    autoClose: 2000
                });
            } else if (discountValue > bookingDetails.totalAmount) {
                // Giới hạn ở tổng tiền
                discountValue = bookingDetails.totalAmount;
                toast.warning("Discount amount has been set to maximum (total amount)", {
                    autoClose: 2000
                });
            }
            // Cập nhật state với giá trị đã được xử lý
            setBookingDetails(prev => ({
                ...prev,
                [name]: discountValue
            }));
            return;
        }
        
        if (bookingKoiDetailId) {
            setBookingDetails(prev => {
                const updatedKoiDetails = prev.koiDetails.map(koi => {
                    if (koi.bookingKoiDetailId === bookingKoiDetailId) {
                        const numericValue = name === 'quantity' || name === 'unitPrice' 
                            ? parseFloat(value) || 0
                            : value;
                        return { ...koi, [name]: numericValue };
                    }
                    return koi;
                });
                
                console.log('Updated Koi Details:', updatedKoiDetails);
                
                return { ...prev, koiDetails: updatedKoiDetails };
            });
            return;
        } else {
            setBookingDetails(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    
    

    const handleUpdateKoiDetail = async (bookingKoiDetailId) => {
        // Tìm koi detail cần update bằng bookingKoiDetailId
        const updatedKoiDetail = bookingDetails.koiDetails.find(
            koi => koi.bookingKoiDetailId === bookingKoiDetailId
        );
        
        console.log('Updating koi detail:', updatedKoiDetail); // Debug log

        if (!updatedKoiDetail) {
            console.error('Could not find koi detail with id:', bookingKoiDetailId);
            return;
        }

        if (parseInt(updatedKoiDetail.quantity) === 0) {
            toast.warning("If you want to remove this Koi, please use the Delete button instead.", {
                autoClose: 3000
            });
            return;
        }

        if (updatedKoiDetail.quantity < 0) {
            toast.error("Quantity cannot be negative", {
                autoClose: 2000
            });
            return;
        }

        if (!updatedKoiDetail.unitPrice || updatedKoiDetail.unitPrice <= 0) {
            toast.error("Unit price must be greater than 0", {
                autoClose: 2000
            });
            return;
        }

        const payload = [{
            id: updatedKoiDetail.bookingKoiDetailId, // Sử dụng bookingKoiDetailId thay vì id
            koiId: updatedKoiDetail.koiId,
            quantity: parseInt(updatedKoiDetail.quantity),
            unitPrice: parseFloat(updatedKoiDetail.unitPrice),
        }];

        console.log('Sending payload:', payload); // Debug log

        try {
            const response = await axios.put(
                `http://localhost:8080/BookingKoiDetail/update/${bookingId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Update response:', response); // Debug log

            // Refresh booking details
            await fetchBookingDetails();
            
            toast.success("Koi Detail updated successfully!", {
                autoClose: 2000
            });
        } catch (err) {
            console.error('Error updating koi detail:', err); // Debug log
            toast.error(err.response?.data?.message || "Failed to update Koi Detail", {
                autoClose: 2000
            });
        }
    };
    

    const handleDeleteKoiDetail = async (bookingKoiDetailId) => {
        if (window.confirm("Are you sure you want to delete this Koi Detail?")) {
            try {
                // Xóa Koi detail
                await axios.delete(`http://localhost:8080/BookingKoiDetail/${bookingKoiDetailId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Kiểm tra nếu là Koi detail cuối cùng
                if (bookingDetails.koiDetails.length === 1) {
                    // Gọi API để cập nhật trạng thái booking thành Cancel
                    await axios.put(`http://localhost:8080/bookings/delete/koi/${bookingId}`, null, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    toast.success("Booking has been cancelled as all Koi details were removed", {
                        autoClose: 3000,
                    });
                    
                    // Điều hướng về trang booking-for-koi-list
                    navigate('/staff/booking-for-koi-list');
                    return;
                }

                // Nếu không phải Koi detail cuối cùng, cập nhật state như bình thường
                setBookingDetails(prev => {
                    const updatedKoiDetails = prev.koiDetails.filter(koi => koi.id !== bookingKoiDetailId);
                    const totalAmount = updatedKoiDetails.reduce((total, koi) => total + koi.totalAmount, 0);

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
                console.error('Error deleting koi detail:', err);
                toast.error("Failed to delete Koi Detail", {
                    autoClose: 2000,
                });
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
            
            setBookingDetails(prev => ({
                ...prev,
                paymentStatus: 'PROCESSING'
            }));
            
            toast.success("Booking confirmed successfully!", {
                autoClose: 2000
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

    const handleCreateDeposit = () => {
        navigate(`/create-deposit/${bookingId}`);
    };

    const handleViewDeposit = () => {
        navigate(`/view-detail-deposit/${bookingId}`);
    };

    const inputClasses = `w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      !isEditableStatus(bookingDetails?.paymentStatus) 
        ? 'bg-gray-100 cursor-not-allowed text-gray-700'
        : 'bg-white text-gray-900'
    }`;
    const readOnlyClasses = "w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed";

    if (loading) return <p className="text-black">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto py-6 px-4 max-w-7xl pt-40">
            <ToastContainer />
            
            <div className="mb-8">
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <span onClick={() => navigate('/staff/booking-for-koi-list')} className="cursor-pointer hover:text-blue-600">
                        Bookings
                    </span>
                    <span>→</span>
                    <span className="text-gray-900">Booking #{bookingDetails?.id}</span>
                </div>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Booking Details
                        <span className="ml-2 text-blue-600">#{bookingDetails?.id}</span>
                    </h1>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(bookingDetails?.paymentStatus)}`}>
                        {bookingDetails?.paymentStatus?.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-500">Customer Name</label>
                            <p className="text-gray-900 font-medium mt-1">{bookingDetails?.nameCus}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Customer ID</label>
                            <p className="text-gray-900 font-medium mt-1">#{bookingDetails?.customerID}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Booking Date</label>
                            <p className="text-gray-900 font-medium mt-1">{new Date(bookingDetails?.bookingDate).toLocaleString()}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Created By</label>
                            <p className="text-gray-900 font-medium mt-1">{bookingDetails?.createdBy}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm text-gray-500">Total Amount</label>
                            <p className="text-gray-900 font-medium mt-1">${bookingDetails?.totalAmount}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">VAT Amount</label>
                            <p className="text-gray-900 font-medium mt-1">${bookingDetails?.vatAmount}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Discount</label>
                            <p className="text-gray-900 font-medium mt-1">${bookingDetails?.discountAmount}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Final Amount</label>
                            <p className="text-green-600 font-semibold mt-1">${bookingDetails?.totalAmountWithVAT}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Koi Details</h3>
                <div className="space-y-4">
                    {bookingDetails.koiDetails.map((koiDetail) => (
                        <div key={koiDetail.bookingKoiDetailId} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="md:col-span-3">
                                <h4 className="text-lg font-semibold text-gray-900">{koiDetail.koiName}</h4>
                                <p className="text-sm text-gray-500">Origin: {koiDetail.origin}</p>
                                <p className="text-sm text-gray-500">Description: {koiDetail.description}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Quantity</label>
                                <input 
                                    type="number" 
                                    name="quantity" 
                                    value={koiDetail.quantity || ''} 
                                    onChange={(e) => handleInputChange(e, koiDetail.bookingKoiDetailId)} 
                                    className={inputClasses}
                                    min="1"
                                    required
                                    disabled={!isEditableStatus(bookingDetails?.paymentStatus)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Unit Price ($)</label>
                                <input 
                                    type="number" 
                                    name="unitPrice" 
                                    value={koiDetail.unitPrice || ''} 
                                    onChange={(e) => handleInputChange(e, koiDetail.bookingKoiDetailId)} 
                                    className={inputClasses}
                                    min="0.01"
                                    step="0.01"
                                    required
                                    disabled={!isEditableStatus(bookingDetails?.paymentStatus)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Total</label>
                                <input 
                                    type="number" 
                                    value={koiDetail.quantity * koiDetail.unitPrice || 0} 
                                    readOnly 
                                    className={readOnlyClasses}
                                />
                            </div>
                            <div className="md:col-span-2 flex items-end justify-end gap-2">
                                {isEditableStatus(bookingDetails?.paymentStatus) && (
                                    <button 
                                        onClick={() => handleUpdateKoiDetail(koiDetail.bookingKoiDetailId)} 
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Update
                                    </button>
                                )}
                                {isEditableStatus(bookingDetails?.paymentStatus) && (
                                    <button 
                                        onClick={() => handleDeleteKoiDetail(koiDetail.bookingKoiDetailId)} 
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Additional Details</h3>
                <form onSubmit={handleUpdateBooking} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">VAT (%)</label>
                        <input 
                            type="number" 
                            name="vat" 
                            value={bookingDetails?.vat * 100 || ''} 
                            onChange={(e) => handleInputChange(e)} 
                            className={inputClasses}
                            disabled={!isEditableStatus(bookingDetails?.paymentStatus)}
                            min="0"
                            max="100"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">Payment Method</label>
                        <select 
                            name="paymentMethod" 
                            value={bookingDetails?.paymentMethod || ''} 
                            onChange={(e) => handleInputChange(e)} 
                            className={inputClasses}
                            disabled={!isEditableStatus(bookingDetails?.paymentStatus)}
                        >
                            <option value="" className="text-gray-700">Select method</option>
                            <option value="CASH" className="text-gray-700">Cash</option>
                            <option value="VISA" className="text-gray-700">Visa</option>
                            <option value="TRANSFER" className="text-gray-700">Transfer</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">Discount Amount ($)</label>
                        <input 
                            type="number" 
                            name="discountAmount" 
                            value={bookingDetails?.discountAmount || ''} 
                            onChange={(e) => handleInputChange(e)} 
                            className={inputClasses}
                            disabled={!isEditableStatus(bookingDetails?.paymentStatus)}
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">Total Amount With VAT</label>
                        <input 
                            type="number" 
                            value={bookingDetails?.totalAmountWithVAT} 
                            readOnly 
                            className={readOnlyClasses}
                        />
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                        {isEditableStatus(bookingDetails?.paymentStatus) && (
                            <>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Update Booking
                                </button>
                                
                                {bookingDetails?.paymentStatus?.toLowerCase() === 'pending' && (
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
                                )}
                            </>
                        )}

                        {bookingDetails?.paymentStatus?.toLowerCase() === 'processing' && (
                            <div className="flex space-x-4">
                                <button 
                                    type="button" 
                                    onClick={depositDetail ? handleViewDeposit : handleCreateDeposit} 
                                    className={`px-6 py-2 ${depositDetail ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-md transition-colors flex items-center space-x-2`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        {depositDetail ? (
                                            <>
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </>
                                        ) : (
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        )}
                                    </svg>
                                    <span>{depositDetail ? 'View Deposit' : 'Create Deposit'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {bookingDetails?.paymentStatus?.toLowerCase() === 'shipping' && depositDetail && (
                <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Deposit Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm text-gray-500">Deposit Amount</label>
                            <p className="text-gray-900 font-medium mt-1">
                                ${depositDetail.depositAmount.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Remain Amount</label>
                            <p className="text-gray-900 font-medium mt-1">
                                ${depositDetail.remainAmount.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Deposit Percentage</label>
                            <p className="text-gray-900 font-medium mt-1">
                                {(depositDetail.depositPercentage * 100).toFixed(0)}%
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Shipping Fee</label>
                            <p className="text-gray-900 font-medium mt-1">
                                ${depositDetail.shippingFee.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Expected Delivery Date</label>
                            <p className="text-gray-900 font-medium mt-1">
                                {new Date(depositDetail.deliveryExpectedDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Status</label>
                            <p className={`mt-1 px-3 py-1 rounded-full text-sm font-medium inline-block ${
                                depositDetail.depositStatus?.toLowerCase() === 'complete'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {depositDetail.depositStatus?.toUpperCase() || 'PROCESSING'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetail;

