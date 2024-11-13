import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState({});
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (isConfirmed) return;

    if (!token) {
      message.error("Authentication token is missing.");
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_Amount = searchParams.get("vnp_Amount");
    const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
    const vnp_PayDate = searchParams.get("vnp_PayDate");

    setPaymentDetails({
      vnp_ResponseCode,
      vnp_Amount,
      vnp_OrderInfo,
      vnp_PayDate,
    });

    const confirmPayment = async () => {
      try {
        const response = await axios.put(
          "http://localhost:8080/bookings/payment/confirm",
          {
            vnp_ResponseCode,
            vnp_Amount,
            vnp_OrderInfo,
            vnp_PayDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setIsConfirmed(true);
          // message.success("Payment confirmed successfully.");
        } else {
          message.error("Failed to confirm payment.");
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
        message.error("Failed to confirm payment.");
      }
    };

    confirmPayment();
  }, [location.search, token, isConfirmed]);

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-20">
      <Card className="w-full max-w-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">Payment Done!</h2>
        <p className="text-gray-500 mb-6">
          Thank you for your payment. Your transaction was completed
          successfully.
        </p>

        <Button
          type="primary"
          onClick={handleGoBack}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Go to Home
        </Button>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
