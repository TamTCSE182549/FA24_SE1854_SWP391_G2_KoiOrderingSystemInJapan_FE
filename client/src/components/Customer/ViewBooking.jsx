import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie"; // Thêm useCookies để lấy token từ cookie
import { jwtDecode } from "jwt-decode";
import { Button, Row, Col, Pagination, Tag, Tooltip } from "antd"; // Import Ant Design components

const BookingInformation = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [bookingList, setBookingList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 3;
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role); // Assuming the role is stored under 'role'
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const bookingListResponse = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/bookings/listBookingTourResponse",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setBookingList(response.data);
      }
    } catch (error) {
      console.error("Error fetching Booking data:", error);
      toast.error("Failed to fetch Booking data.");
    }
  };

  const handlePayment = (booking) => {
    if (!token) {
      toast.warning("You are not logged in. Please login.");
      navigate(`/login`);
    } else {
      navigate(`/payment/${booking.id}`);
    }
  };

  useEffect(() => {
    bookingListResponse();
  }, []);

  if (!bookingList.length) {
    return <div>Loading...</div>;
  }

  const handleViewDetailBooking = (booking) => {
    if (!token) {
      toast.warn("You not login to Booking");
      navigate(`/login`);
    } else {
      navigate("/bookingTourDetail", { state: { booking } });
    }
  };

  const handleDeleteBooking = async (booking) => {
    try {
      if (booking.paymentStatus === "complete") {
        toast.warn("You only can delete if Payment Status is not COMPLETE");
        return;
      }
      await axios.put(
        `http://localhost:8080/bookings/delete/${booking.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Delete Success");
      bookingListResponse();
    } catch (error) {
      toast.error("Delete Booking Fail");
    }
  };

  // Calculate the bookings to display on the current page
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookingList.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "processing":
        return "blue";
      case "delivery":
        return "purple";
      case "cancelled":
        return "red";
      case "complete":
        return "green";
      case "shipped":
        return "cyan";
      default:
        return "default"; // Màu mặc định nếu không có trạng thái phù hợp
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "CASH":
        return "green";
      case "VISA":
        return "blue";
      case "TRANSFER":
        return "gold";
      default:
        return "default"; // Màu mặc định nếu không có phương thức phù hợp
    }
  };

  return (
    <div className="container mt-20 text-black">
      <section className="text-center">
        <Row gutter={[16, 16]}>
          {currentBookings.map((booking, index) => (
            <Col key={index} span={12} style={{ margin: "10px auto" }}>
              <div
                style={{
                  display: "flex",
                  padding: "5px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                }}
              >
                {/* Left Column: Image */}
                <div style={{ marginRight: 20 }}>
                  <img
                    alt="Koi Fish"
                    src="https://asiatourist.vn/wp-content/uploads/2021/04/khu-du-lich-la-phong-da-lat-5.jpg"
                    style={{ width: 150, borderRadius: "8px" }}
                  />
                  <div className="mt-4">
                    {currentBookings.some(
                      (booking) => booking.paymentStatus === "pending"
                    ) && (
                      <Tag color="yellow" className="font-bold text-sm">
                        Note: Wait for Contact
                      </Tag>
                    )}
                  </div>
                </div>

                {/* Middle Column: Information */}
                <div style={{ flex: 1, marginRight: 20 }}>
                  <h5 className="mb-2">
                    <strong>Booking Information</strong>
                  </h5>
                  <Row gutter={[10, 8]}>
                    <Col span={12} className="mt-2">
                      <p style={{ textAlign: "left" }}>
                        VAT: <strong>{booking.vat}</strong>
                      </p>
                      <p style={{ textAlign: "left" }}>
                        VAT Amount: <strong>{booking.vatAmount}</strong>
                      </p>
                      <p style={{ textAlign: "left" }}>
                        Discount Amount:{" "}
                        <strong>{booking.discountAmount}</strong>
                      </p>
                    </Col>
                    <Col span={12}>
                      <div className="flex items-center mt-2">
                        <p className="text-left text-gray-700 mr-2">Time:</p>
                        <Tooltip title="Booking Created Date">
                          <Tag
                            color="blue"
                            className="text-white bg-blue-500 hover:bg-blue-300 transition duration-200 ease-in-out"
                          >
                            {formatDateTime(booking.createdDate)}
                          </Tag>
                        </Tooltip>
                      </div>
                      <p style={{ textAlign: "left" }}>
                        Payment Status:{" "}
                        <Tag
                          color={getPaymentStatusColor(booking.paymentStatus)}
                        >
                          <strong>{booking.paymentStatus}</strong>
                        </Tag>
                      </p>
                      <p style={{ textAlign: "left" }}>
                        Payment Method:{" "}
                        <Tag
                          color={getPaymentMethodColor(booking.paymentMethod)}
                        >
                          <strong>{booking.paymentMethod}</strong>
                        </Tag>
                      </p>
                    </Col>
                  </Row>
                </div>

                {/* Right Column: Additional Information and Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <div style={{ marginBottom: "10px", textAlign: "left" }}>
                    <p style={{ textAlign: "left" }}>
                      Total Amount:{" "}
                      <strong className="text-red-500">
                        {booking.totalAmount}
                      </strong>
                    </p>
                    <p style={{ textAlign: "left" }}>
                      Total Amount With VAT:{" "}
                      <strong className="text-red-500">
                        {booking.totalAmountWithVAT}
                      </strong>
                    </p>
                  </div>
                  <Button
                    type="primary"
                    className="me-2"
                    onClick={() => handleViewDetailBooking(booking)}
                    style={{ width: "100%" }}
                  >
                    View Detail
                  </Button>
                  {booking.paymentStatus !== "complete" && (
                    <Button
                      type="primary"
                      danger
                      color="danger"
                      className="me-2 bg-red-500"
                      onClick={() => handleDeleteBooking(booking)}
                      style={{ width: "100%" }}
                    >
                      Cancel Booking
                    </Button>
                  )}
                  {booking.paymentStatus === "pending" &&
                    userRole === "SALES_STAFF" && (
                      <Button
                        type="secondary"
                        className="me-2"
                        onClick={() => handleCreateQuotation(booking)}
                        style={{ width: "100%" }}
                      >
                        Create Quotation
                      </Button>
                    )}
                  {booking.paymentStatus === "processing" && (
                    <Button
                      type="primary"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handlePayment(booking)}
                      style={{ width: "100%" }}
                    >
                      Pay
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <Pagination
          current={currentPage}
          pageSize={bookingsPerPage}
          total={bookingList.length}
          onChange={onPageChange}
          style={{ marginTop: "20px" }}
        />
      </section>
      <ToastContainer />
    </div>
  );
};

export default BookingInformation;
