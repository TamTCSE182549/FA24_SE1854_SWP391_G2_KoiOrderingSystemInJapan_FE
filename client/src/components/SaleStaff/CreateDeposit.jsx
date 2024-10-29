import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";

const CreateDeposit = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [shippingFee, setShippingFee] = useState("");
  const [deliveryExpectedDate, setDeliveryExpectedDate] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [depositPercentage, setDepositPercentage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cookies] = useCookies();
  const token = cookies.token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Add this to check if handleSubmit is triggered
    console.log("Booking ID: ", bookingId);
    console.log("Token: ", token);
    try {
      const response = await axios.post(
        `http://localhost:8080/deposit/${bookingId}`,
        {
          shippingFee: parseFloat(shippingFee),
          deliveryExpectedDate: deliveryExpectedDate,
          shippingAddress: shippingAddress,
          depositPercentage: parseFloat(depositPercentage),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Deposit successful!", {
        autoClose: 2000,
      });
      console.log("Response: ", response); // Add this to check the response from the API

      navigate(`/view-detail-deposit/${bookingId}`);
    } catch (error) {
      console.error("Error: ", error); // Add this to check for errors
      setErrorMessage("Failed to create deposit");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg mt-40">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4  text-black">
        Create Deposit
      </h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Shipping Fee:</label>
          <input
            type="number"
            value={shippingFee}
            onChange={(e) => setShippingFee(e.target.value)}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md  text-black"
            placeholder="Enter shipping fee"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Expected Delivery Date:</label>
          <input
            type="date"
            value={deliveryExpectedDate}
            onChange={(e) => setDeliveryExpectedDate(e.target.value)}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md  text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Shipping Address:</label>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md  text-black"
            placeholder="Enter shipping address"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Deposit Percentage:</label>
          <input
            type="number"
            value={depositPercentage}
            onChange={(e) => setDepositPercentage(e.target.value)}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md  text-black"
            placeholder="Enter deposit percentage"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Create Deposit
        </button>
      </form>
    </div>
  );
};

export default CreateDeposit;
