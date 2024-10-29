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

  // State for editable fields
  const [shippingFee, setShippingFee] = useState(0);
  const [deliveryExpectedDate, setDeliveryExpectedDate] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [depositPercentage, setDepositPercentage] = useState(0);

  useEffect(() => {
    const fetchDepositData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/deposit/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setDeposit(response.data);
          setShippingFee(response.data.shippingFee);
          setDeliveryExpectedDate(response.data.deliveryExpectedDate);
          setShippingAddress(response.data.shippingAddress);
          setDepositPercentage(response.data.depositPercentage);
        } else {
          setDeposit(null);
        }
      } catch (error) {
        console.error("Error fetching deposit data:", error);
        toast.error("Failed to fetch deposit data");
      }
    };

    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/bookings/ViewDetail/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookingDetails(response.data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        toast.error("Failed to fetch booking data");
      }
    };

    fetchDepositData();
    fetchBookingData();
  }, [bookingId]);

  const handleUpdateDeposit = async () => {
    try {
      const updatedDeposit = {
        ...deposit,
        shippingFee,
        deliveryExpectedDate,
        shippingAddress,
        depositPercentage,
      };

      const response = await axios.put(`http://localhost:8080/deposit/${bookingId}`, updatedDeposit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDeposit(response.data);
      toast.success("Deposit updated successfully");
    } catch (error) {
      console.error("Error updating deposit:", error);
      toast.error("Failed to update deposit");
    }
  };

  if (!deposit || !BookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow-md rounded-lg mt-40 text-black">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4 text-black">Deposit Details</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Deposit Information</h3>
        <p><strong>Deposit Amount:</strong> {deposit.depositAmount}</p>
        <p><strong>Remain Amount:</strong> {deposit.remainAmount}</p>
        {/* Editable fields */}
        <div className="mb-2">
          <label className="block">
            <strong>Shipping Fee:</strong>
            <input 
              type="number" 
              value={shippingFee} 
              onChange={(e) => setShippingFee(e.target.value)} 
              className="border border-gray-300 rounded p-1 ml-2 w-full"
            />
          </label>
        </div>
        <div className="mb-2">
          <label className="block">
            <strong>Delivery Expected Date:</strong>
            <input 
              type="date" 
              value={deliveryExpectedDate} 
              onChange={(e) => setDeliveryExpectedDate(e.target.value)} 
              className="border border-gray-300 rounded p-1 ml-2 w-full"
            />
          </label>
        </div>
        <div className="mb-2">
          <label className="block">
            <strong>Shipping Address:</strong>
            <input 
              type="text" 
              value={shippingAddress} 
              onChange={(e) => setShippingAddress(e.target.value)} 
              className="border border-gray-300 rounded p-1 ml-2 w-full"
            />
          </label>
        </div>
        <div className="mb-2">
          <label className="block">
            <strong>Deposit Percentage:</strong>
            <input 
              type="number" 
              value={depositPercentage} 
              onChange={(e) => setDepositPercentage(e.target.value)} 
              className="border border-gray-300 rounded p-1 ml-2 w-full"
            />
          </label>
        </div>
        <button 
          onClick={handleUpdateDeposit}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mt-4"
        >
          Update Deposit
        </button>
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
        onClick={() => navigate('/booking-for-koi-list')} 
        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 mt-4"
      >
        View Booking For Koi List
      </button>
    </div>
  );
};

export default ViewDetailDeposit;
