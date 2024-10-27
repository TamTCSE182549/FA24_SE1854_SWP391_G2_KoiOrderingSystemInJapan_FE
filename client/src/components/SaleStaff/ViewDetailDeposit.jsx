import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'; 


const ViewDetailDeposit = () => {
  const { bookingId } = useParams();
  const [deposit, setDeposit] = useState(null);
  const [BookingDetails, setBookingDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const token = cookies.token;
  const navigate = useNavigate();
  useEffect(() => {
    // Hàm để lấy dữ liệu deposit
    const fetchDepositData = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/deposit/${bookingId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Deposit Response Data:", response.data); // In ra dữ liệu deposit nhận được
          
          // Kiểm tra xem response.data có phải là mảng và có ít nhất một phần tử không
          if (Array.isArray(response.data) && response.data.length > 0) {
            // Lấy phần tử đầu tiên
            setDeposit(response.data[0]);
            console.log("Deposit Data:", response.data[0]); // In ra dữ liệu deposit đầu tiên
          } else {
            console.warn("No deposit data found.");
            setDeposit(null); // Hoặc có thể thiết lập một giá trị mặc định
          }
        } catch (error) {
          console.error("Error fetching deposit data:", error);
          toast.error("Failed to fetch deposit data");
        }
      };
      
    // Hàm để lấy dữ liệu booking
    const fetchBookingData = async () => {
      try {
                const response = await axios.get(`http://localhost:8080/bookings/ViewDetail/${bookingId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Booking Response Data:", response.data); 
                setBookingDetails(response.data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        toast.error("Failed to fetch booking data");
      }
    };

    fetchDepositData();
    fetchBookingData();
  }, [bookingId]);

  if (!deposit || !BookingDetails) {
    return <div>Loading...</div>; // Hoặc có thể hiển thị spinner/loading
  }

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow-md rounded-lg mt-40 text-black">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4 text-black">Deposit Details</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Deposit Information</h3>
        <p><strong>Deposit Amount:</strong> {deposit.depositAmount}</p>
        <p><strong>Remain Amount:</strong> {deposit.remainAmount}</p>
        <p><strong>Shipping Fee:</strong> {deposit.shippingFee}</p>
        <p><strong>Deposit Date:</strong> {deposit.depositDate}</p>
        <p><strong>Expected Delivery Date:</strong> {deposit.deliveryExpectedDate}</p>
        <p><strong>Shipping Address:</strong> {deposit.shippingAddress}</p>
        <p><strong>Deposit Percentage:</strong> {deposit.depositPercentage}</p>
        <p><strong>Deposit Status:</strong> {deposit.depositStatus}</p>
        <p><strong>Booking ID:</strong> {deposit.bookingId}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-black">Booking Information</h2>
      <div className="mb-4">
        <p><strong>Booking ID:</strong> {BookingDetails.id}</p>
        <p><strong>Customer ID:</strong> {BookingDetails.customerID}</p>
        <p><strong>Name:</strong> {BookingDetails.nameCus}</p>
        <p><strong>Total Amount:</strong> {BookingDetails.totalAmount}</p>
        <p><strong>VAT:</strong> {BookingDetails.vat}</p>
        <p><strong>VAT Amount:</strong> {BookingDetails.vatAmount}</p>
        <p><strong>Discount Amount:</strong> {BookingDetails.discountAmount}</p>
        <p><strong>Total Amount with VAT:</strong> {BookingDetails.totalAmountWithVAT}</p>
        <p><strong>Booking Type:</strong> {BookingDetails.bookingType}</p>
        <p><strong>Payment Method:</strong> {BookingDetails.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {BookingDetails.paymentStatus}</p>
      </div>

      <h3 className="font-semibold">Koi Details</h3>
      <ul>
        {BookingDetails.koiDetails.map((koi) => (
          <li key={koi.id}>
            <p><strong>Koi ID:</strong> {koi.id}</p>
            <p><strong>Quantity:</strong> {koi.quantity}</p>
            <p><strong>Total Amount:</strong> {koi.totalAmount}</p>
            <p><strong>Unit Price:</strong> {koi.unitPrice}</p>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => navigate('/booking-for-koi-list')} // Sử dụng navigate ở đây
        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 mt-4"
      >
        View Booking For Koi List
      </button>
    </div>
  );
};

export default ViewDetailDeposit;
