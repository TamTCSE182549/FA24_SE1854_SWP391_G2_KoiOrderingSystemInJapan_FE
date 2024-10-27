import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Thay đổi ở đây
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingDetail = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Khai báo useNavigate
    const { bookingId, selectedFarmId } = location.state || {};
    
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails({ ...bookingDetails, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8080/bookings/update/${bookingId}`, bookingDetails, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Booking Update successful!", {
                autoClose: 2000});
        } catch (err) {
            setError('Failed to update booking');
        }
    };

    const handleDeposit = async () => {
        try {
            // Cập nhật trạng thái booking lên processing
            await axios.put(`http://localhost:8080/bookings/update/status/${bookingId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Booking status updated to processing!", {
                autoClose: 2000,
            });

            // Chuyển đến trang tạo deposit
            navigate(`/create-deposit/${bookingId}`, { state: { bookingId }}); // Điều hướng đến trang tạo deposit
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
                <p className="text-gray-800 text-lg"><strong>Farm ID:</strong> {selectedFarmId}</p>
                <h3 className="text-lg font-semibold mb-4 mt-8 text-gray-800">Koi Details</h3>
            <ul className="space-y-4">
                {bookingDetails.koiDetails.map((koiDetail) => (
                    <li key={koiDetail.id} className="p-4 border border-gray-300 rounded-lg flex justify-between items-center text-black">
                        <div className="flex-grow">
                            <p><strong>Koi ID:</strong> {koiDetail.id}</p>
                            <p><strong>Quantity:</strong> {koiDetail.quantity}</p>
                            <p><strong>Unit Price:</strong> {koiDetail.unitPrice}</p>
                            <p><strong>Total Amount:</strong> {koiDetail.totalAmount}</p>
                        </div>
                    </li>
                ))}
            </ul>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="bg-white p-6 rounded-lg shadow-md">
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
                <button type="submit" className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">Update</button>
                <button type="button" onClick={handleDeposit} className="mt-4 ml-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Create Deposit</button>
            </form>

        </div>
    );
};

export default BookingDetail;
