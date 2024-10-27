// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Typography, message } from "antd";
// import { useCookies } from "react-cookie";

// const { Title } = Typography;

// const BookingKoi = () => {
//     const [farms, setFarms] = useState([]);
//     const [selectedFarmId, setSelectedFarmId] = useState(null);
//     const [kois, setKois] = useState([]);
//     const [bookingDetails, setBookingDetails] = useState([]);
//     const [paymentMethod, setPaymentMethod] = useState('');
//     const [editingBookingId, setEditingBookingId] = useState(null);
//     const [bookings, setBookings] = useState([]);
//     const [selectedKoiId, setSelectedKoiId] = useState(null);
//     const [unitPrice, setUnitPrice] = useState('');

//     const [cookies] = useCookies();
//     const token = cookies.token;

//     useEffect(() => {
//         fetchFarms();
//         fetchBookings();
//     }, []);

//     const fetchFarms = async () => {
//         try {
//             const response = await axios.get('http://localhost:8080/koi-farm/list-farm-active', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setFarms(response.data);
//         } catch (error) {
//             console.error('Error fetching farms:', error);
//         }
//     };

//     const fetchBookings = async () => {
//         try {
//             const response = await axios.get('http://localhost:8080/bookings/BookingForKoi', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setBookings(response.data);
//         } catch (error) {
//             console.error('Error fetching bookings:', error);
//         }
//     };

//     const handleFarmChange = async (farmId) => {
//         setSelectedFarmId(farmId);
//         try {
//             const response = await axios.get(`http://localhost:8080/koi-farm/get/${farmId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log(response.data);
//             setKois(response.data.koiResponses);
//         } catch (error) {
//             console.error('Error fetching Koi:', error);
//         }
//     };
    

    
//     const handleKoiChange = (koiId, quantity, unitPrice) => {
//         const numericQuantity = parseInt(quantity, 10);
//         const numericUnitPrice = parseFloat(unitPrice);
    
//         console.log('Koi changed:', { koiId, numericQuantity, numericUnitPrice });
    
//         setSelectedKoiId(koiId);
//         setBookingDetails((prevDetails) => {
//             const existingDetail = prevDetails.find(detail => detail.koiId === koiId);
//             if (existingDetail) {
//                 return prevDetails.map(detail =>
//                     detail.koiId === koiId
//                         ? { ...detail, quantity: numericQuantity, unitPrice: numericUnitPrice }
//                         : detail
//                 );
//             } else {
//                 return [...prevDetails, { koiId, quantity: numericQuantity, unitPrice: numericUnitPrice }];
//             }
//         });
//     };
    
    

//     const handleSubmit = async (e) => {
//         e.preventDefault(); 
//         const bookingKoiRequest = {
//             farmId: selectedFarmId,
//             paymentMethod,
//             details: bookingDetails.map(detail => ({
//                 koiId: detail.koiId,
//                 quantity: detail.quantity,
//                 unitPrice: detail.unitPrice,
//             })),
//         };
    
//         try {
//             const response = await axios.post(`http://localhost:8080/bookings/koi/create/${2}`, bookingKoiRequest, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log('Booking created successfully:', response.data);
//             fetchBookings();
//             resetForm();
//         } catch (error) {
//             console.error('Error creating booking:', error);
//         }
//     };
    

//     const handleEditBooking = (booking) => {
//         setEditingBookingId(booking.id);
//         setSelectedFarmId(booking.farmId);
//         setPaymentMethod(booking.paymentMethod);
//         setBookingDetails(booking.details);
//     };

//     const handleUpdateBooking = async (e) => {
//         e.preventDefault();
//         const bookingKoiRequest = {
//             farmId: selectedFarmId,
//             paymentMethod,
//             details: bookingDetails,
//         };

//         try {
//             const response = await axios.put(`http://localhost:8080/bookings/koi/${editingBookingId}`, bookingKoiRequest, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log('Booking updated successfully:', response.data);
//             setBookings((prevBookings) =>
//                 prevBookings.map((booking) =>
//                     booking.id === editingBookingId
//                         ? { ...booking, ...bookingKoiRequest }
//                         : booking
//                 )
//             );
//             setEditingBookingId(null);
//         } catch (error) {
//             console.error('Error updating booking:', error);
//         }
//     };

//     const handleDeleteBooking = async (Id) => {
//         try {
//             const response = await axios.delete(`http://localhost:8080/BookingKoiDetail/${Id}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
            
//             if (response.status === 200) {
//                 message.success("Booking deleted successfully");
//                 fetchBookings();
//             } else {
//                 throw new Error('Failed to delete Koi booking');
//             }
//         } catch (error) {
//             message.error("Error deleting booking: " + error.message);
//         }
//     };

//     return (
//         <div className="container mx-auto py-10 px-4 mt-40">
//             <Title level={2} className="text-3xl font-bold text-black text-center mb-6">Create Koi Booking</Title>
//             <form onSubmit={editingBookingId ? handleUpdateBooking : handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
//                 <div className="mb-4">
//                     <label htmlFor="farm" className="block text-lg font-semibold text-black mb-2">Choose Farm:</label>
//                     <select
//                         id="farm"
//                         value={selectedFarmId}
//                         onChange={(e) => handleFarmChange(e.target.value)}
//                         required
//                         className="w-full p-2 border border-gray-300 rounded-lg text-black"
//                     >
//                         <option value="">Select a farm</option>
//                         {farms.map(farm => (
//                             <option key={farm.id} value={farm.id} className="text-black">{farm.farmName}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="koi" className="block text-lg font-semibold text-black mb-2">Choose Koi:</label>
//                     <select
//                         id="koi"
//                         value={selectedKoiId}
//                         onChange={(e) => setSelectedKoiId(e.target.value)}
//                         required
//                         className="w-full p-2 border border-gray-300 rounded-lg text-black"
//                     >
//                         <option value="">Select a Koi</option>
//                         {kois.map(koi => (
//                             <option key={koi.id} value={koi.id} className="text-black">{koi.koiName}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="mb-4">
//     <label htmlFor="unitPrice" className="block text-lg font-semibold text-black mb-2">Unit Price:</label>
//     <input
//         id="unitPrice"
//         type="number"
//         min="0"
//         step="0.01" // Cho phép nhập số thập phân
//         onChange={(e) => setUnitPrice(e.target.value)}
//         required
//         className="w-full p-2 border border-gray-300 rounded-lg text-black"
//     />
// </div>

//                 <div className="mb-4">
//     <label htmlFor="quantity" className="block text-lg font-semibold text-black mb-2">Quantity:</label>
//     <input
//         id="quantity"
//         type="number"
//         min="1"
//         step="1" // Chỉ cho phép nhập số nguyên
//         onChange={(e) => handleKoiChange(selectedKoiId, e.target.value, unitPrice)}
//         required
//         className="w-full p-2 border border-gray-300 rounded-lg text-black"
//     />
// </div>




//                 <div className="mb-4">
//                     <label htmlFor="paymentMethod" className="block text-lg font-semibold text-black mb-2">Payment Method:</label>
//                     <select
//                         id="paymentMethod"
//                         value={paymentMethod}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                         required
//                         className="w-full p-2 border border-gray-300 rounded-lg text-black"
//                     >
//                         <option value="">Select a payment method</option>
//                         <option value="CASH">Cash</option>
//                         <option value="VISA">VISA</option>
//                         <option value="TRANSFER">TRANSFER</option>
//                     </select>
//                 </div>

//                 <div className="flex justify-center">
//                     <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
//                         {editingBookingId ? "Update Booking" : "Create Booking"}
//                     </button>
//                 </div>
//             </form>

//             <div className="mt-10">
//     <Title level={3} className="text-2xl font-bold text-black text-center mb-4">Existing Bookings</Title>
//     <ul className="list-disc list-inside">
//         {bookings.map(booking => (
//             <li key={booking.id} className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 text-black">
//                 <h4 className="text-lg font-semibold">Farm: {booking.farmName}</h4>
//                 <p className="text-md">Payment Method: {booking.paymentMethod}</p>
//                 <p className="text-md">Details: {JSON.stringify(booking.details, null, 2)}</p> {/* Hiển thị thông tin chi tiết có định dạng */}
//                 <div className="flex justify-end">
//                     <button onClick={() => handleEditBooking(booking)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
//                     <button onClick={() => handleDeleteBooking(booking.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">Delete</button>
//                 </div>
//             </li>
//         ))}
//     </ul>
// </div>

//         </div>
//     );
// };

// export default BookingKoi;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, message } from "antd";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const { Title } = Typography;

const BookingKoi = () => {
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
        console.log('Selected Koi ID:', koiId); // Kiểm tra ID Koi được chọn
    };

    const handleAddKoi = () => {
        const numericQuantity = parseInt(quantity, 10);
        const numericUnitPrice = parseFloat(unitPrice);
    
        if (selectedKoiId && numericQuantity > 0 && numericUnitPrice > 0) {
            const selectedKoi = kois.find(koi => koi.id === Number(selectedKoiId));
;
    
            console.log('Selected Koi ID:', selectedKoiId); // Kiểm tra ID Koi được chọn
            console.log('Kois:', kois); // Kiểm tra danh sách Koi
            console.log('Selected Koi:', selectedKoi); // Kiểm tra Koi được chọn
    
            if (!selectedKoi) {
                message.error('Koi not found!');
                return;
            }
    
            const existingDetail = bookingDetails.find(detail => detail.koiId === selectedKoiId);
    
            if (existingDetail) {
                // Nếu Koi đã tồn tại trong danh sách, cập nhật số lượng và giá
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
    
        // Kiểm tra xem đã chọn farm hay chưa
        if (!selectedFarmId) {
            console.warn('Please select a farm.');
            return; // Dừng hàm nếu chưa chọn farm
        }
    
        // Kiểm tra phương thức thanh toán
        if (!paymentMethod) {
            console.warn('Please select a payment method.');
            return; // Dừng hàm nếu chưa chọn phương thức thanh toán
        }
    
        // Kiểm tra xem danh sách bookingDetails có trống không
        if (bookingDetails.length === 0) {
            console.warn('Please add at least one Koi to the booking list.');
            return; // Dừng hàm nếu không có Koi nào được thêm vào
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
            const response = await axios.post(`http://localhost:8080/bookings/koi/create/${2}`, bookingKoiRequest, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Booking successful!", {
                autoClose: 1000,
                onClose: () => {
                    // Chuyển hướng sau khi toast hiển thị xong
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
                    required={bookingDetails.length === 0} // Không đánh dấu bắt buộc nếu đã có Koi trong danh sách
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
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="mb-4">
                    <button type="button" onClick={handleAddKoi} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Add Koi</button>
                </div>
                 {/* VAT */}
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

                {/* Discount Amount */}
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
