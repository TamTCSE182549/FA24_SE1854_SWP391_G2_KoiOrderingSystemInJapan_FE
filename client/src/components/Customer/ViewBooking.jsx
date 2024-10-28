import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie"; // Thêm useCookies để lấy token từ cookie
import { jwtDecode } from "jwt-decode";
import { Card, Button, Row, Col, Pagination } from "antd"; // Import Ant Design components

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
      if (booking.paymentStatus !== "pending") {
        toast.warn("You only can delete if Payment Status is PENDING");
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

  return (
    <div className="container mt-20">
      <section className="text-center">
        <h4 className="mb-5">
          <strong>Booking List</strong>
        </h4>
        <Row gutter={[16, 16]}>
          {currentBookings.map((booking, index) => (
            <Col key={index} span={15} style={{ margin: "10px auto" }}>
              <Card
                hoverable
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "5px",
                }}

              >
                <div style={{ display: "flex", width: "100%" }}>
                  <img
                    alt="Koi Fish"
                    src="https://asiatourist.vn/wp-content/uploads/2021/04/khu-du-lich-la-phong-da-lat-5.jpg"
                    style={{ width: 150, marginRight: 20 }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 className="mb-5">
                      <strong>Booking Information</strong>
                    </h5>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <p>Time: {formatDateTime(booking.createdDate)}</p>
                        <p>
                          VAT: <strong>{booking.vat}</strong>
                        </p>
                      </Col>
                      <Col span={12}>
                        <p>
                          VAT Amount: <strong>{booking.vatAmount}</strong>
                        </p>
                        <p>
                          Discount Amount:{" "}
                          <strong>{booking.discountAmount}</strong>
                        </p>
                      </Col>
                      <Col span={12}>
                        <p>
                          Total Amount: <strong>{booking.totalAmount}</strong>
                        </p>
                        <p>
                          Payment Method:{" "}
                          <strong>{booking.paymentMethod}</strong>
                        </p>
                      </Col>
                      <Col span={12}>
                        <p>
                          Payment Status:{" "}
                          <strong>{booking.paymentStatus}</strong>
                        </p>
                        <p>
                          Total Amount With VAT:{" "}
                          <strong>{booking.totalAmountWithVAT}</strong>
                        </p>
                      </Col>
                    </Row>
                  </div>
                </div>
                <hr style={{ width: "100%", margin: "20px 0" }} />
                <div
                  className="d-flex justify-content-start"
                  style={{ width: "100%" }}
                >
                  <Button
                    type="primary"
                    className="me-2"
                    onClick={() => handleViewDetailBooking(booking)}
                  >
                    View Detail
                  </Button>
                  <Button
                    type="primary"
                    danger
                    color="danger"
                    className="me-2 bg-red-500"
                    onClick={() => handleDeleteBooking(booking)}
                  >
                    Cancel Booking
                  </Button>
                  {booking.paymentStatus === "pending" &&
                    userRole === "SALES_STAFF" && (
                      <Button
                        type="secondary"
                        className="me-2"
                        onClick={() => handleCreateQuotation(booking)}
                      >
                        Create Quotation
                      </Button>
                    )}
                  {booking.paymentStatus === "processing" && (
                    <Button
                      type="success"
                      onClick={() => handlePayment(booking)}
                    >
                      Pay
                    </Button>
                  )}
                </div>
              </Card>
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
