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

    useEffect(() => {
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

        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId, token]);

    const handleInputChange = (e, koiDetailId) => {
        const { name, value } = e.target;
        setBookingDetails(prev => {
            const updatedKoiDetails = prev.koiDetails.map(koi => {
                if (koi.id === koiDetailId) {
                    return { ...koi, [name]: value }; // Cập nhật trường tương ứng
                }
                return koi;
            });
            return { ...prev, koiDetails: updatedKoiDetails };
        });
    };
    
    

    const handleUpdateKoiDetail = async (bookingKoiDetailId) => {
        const updatedKoiDetail = bookingDetails.koiDetails.find(koi => koi.id === bookingKoiDetailId);
        
        const payload = [{
            id: updatedKoiDetail.id,
            koiId: updatedKoiDetail.koiId, // Nếu cần thiết
            quantity: updatedKoiDetail.quantity,
            unitPrice: updatedKoiDetail.unitPrice,
        }]; // Đặt trong mảng nếu API mong đợi mảng
    
        try {
            await axios.put(`http://localhost:8080/BookingKoiDetail/update/${bookingId}`, payload, { // Đừng quên xóa id ở URL nếu cần
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookingDetails(prev => {
                const updatedKoiDetails = prev.koiDetails.map(koi => 
                    koi.id === bookingKoiDetailId ? updatedKoiDetail : koi
                );
                const newTotalAmount = updatedKoiDetails.reduce(
                    (total, koi) => total + koi.quantity * koi.unitPrice, 0
                );
                return {
                    ...prev,
                    koiDetails: updatedKoiDetails,
                    totalAmount: newTotalAmount
                };
            });
            
            toast.success("Koi Detail updated successfully!", {
                autoClose: 2000
            });
        
        } catch (err) {
            setError('Failed to update Koi Detail');
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
    
    
    const handleDeposit = async () => {
        try {
            await axios.put(`http://localhost:8080/bookings/update/status/${bookingId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Booking status updated to processing!", {
                autoClose: 2000,
            });
            navigate(`/create-deposit/${bookingId}`, { state: { bookingId } });
        } catch (err) {
            setError('Failed to update booking status');
        }
    };

    if (loading) return <p className="text-black">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto py-10 px-4 mt-40">
            <ToastContainer />
            <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Booking Detail</h2>
            <div className="bg-gray-200 p-4 rounded-lg mb-6">
                <p className="text-gray-800 text-lg"><strong>Booking ID:</strong> {bookingId}</p>
                <h3 className="text-lg font-semibold mb-4 mt-8 text-gray-800">Koi Details</h3>
                <ul className="space-y-4">
                {bookingDetails.koiDetails.map((koiDetail) => (
    <li key={koiDetail.id} className="p-4 border border-gray-300 rounded-lg flex justify-between items-center text-black">
        <div className="flex-grow">
            <p><strong>Koi Detail ID:</strong> {koiDetail.id}</p>
            <label className="block mb-2">
                <span className="text-gray-700">Quantity:</span>
                <input 
                    type="number" 
                    name="quantity" 
                    value={koiDetail.quantity} 
                    onChange={(e) => handleInputChange(e, koiDetail.id)} 
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                />
            </label>
            <label className="block mb-2">
                <span className="text-gray-700">Unit Price:</span>
                <input 
                    type="number" 
                    name="unitPrice" 
                    value={koiDetail.unitPrice} 
                    onChange={(e) => handleInputChange(e, koiDetail.id)} 
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                />
            </label>
            <p><strong>Total Amount:</strong> {koiDetail.totalAmount}</p>
        </div>
        <div className="flex space-x-2">
            <button onClick={() => handleUpdateKoiDetail(koiDetail.id)} className="bg-yellow-600 text-white py-1 px-2 rounded hover:bg-yellow-700 transition">Update</button>
            <button onClick={() => handleDeleteKoiDetail(koiDetail.id)} className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition">Delete</button>
        </div>
    </li>
))}


                </ul>
            </div>
            {/* Phần update booking không thay đổi */}
            <form onSubmit={(e) => { e.preventDefault(); /* handleUpdate logic here */ }} className="bg-white p-6 rounded-lg shadow-md">
                {/* Các input không thay đổi */}
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Update Booking Information</h3>
                <label className="block mb-4">
                    <span className="text-gray-700">Customer ID:</span>
                    <input 
                        type="text" 
                        name="customerID" 
                        value={bookingDetails?.customerID} 
                        readOnly 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-600 bg-gray-200" 
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">Customer Name:</span>
                    <input 
                        type="text" 
                        name="nameCus" 
                        value={bookingDetails?.nameCus} 
                        readOnly 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-600 bg-gray-200" 
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">Total Amount:</span>
                    <input 
                        type="number" 
                        name="totalAmount" 
                        value={bookingDetails?.totalAmount} 
                        readOnly 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-600 bg-gray-200" 
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">VAT:</span>
                    <input 
                        type="number" 
                        name="vat" 
                        value={bookingDetails?.vat} 
                        onChange={handleInputChange} 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">Payment Method:</span>
                    <input 
                        type="text" 
                        name="paymentMethod" 
                        value={bookingDetails?.paymentMethod} 
                        onChange={handleInputChange} 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">Discount Amount:</span>
                    <input 
                        type="number" 
                        name="discountAmount" 
                        value={bookingDetails?.discountAmount} 
                        onChange={handleInputChange} 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                    />
                </label>
                <button type="submit" className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">Update Booking</button>
                <button type="button" onClick={handleDeposit} className="mt-4 ml-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Create Deposit</button>
            </form>
        </div>
    );
};

export default BookingDetail;
