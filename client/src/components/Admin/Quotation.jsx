import React, { useState, useEffect } from "react";
import { Table, Button, Input, Tag, Space, notification, Pagination } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quotation = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const fetchQuotations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/quotations/all");
      const sortedQuotations = response.data.sort((a, b) => b.id - a.id);
    setQuotations(sortedQuotations);
    console.log("Quotation Data:", sortedQuotations);
      console.log("Quotation Data:", response.data.content);
    } catch (error) {
      console.error("Error when getting Quotation List:", error);
      notification.error({
            message: "Error",
            description: "You don't have any quotation.",
          });
    } 
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // Hàm xử lý khi nhấn nút xem chi tiết
  const handleViewDetails = (id) => {
    navigate(`/quotation/${id}`);
  };

  // Hàm xử lý khi thay đổi trạng thái
  const handleUpdateStatus = async (quotationId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:8080/quotations/updateStatus/${quotationId}`,null, {
        params: {
          approveStatus: newStatus,
        },
      });
  
      if (response.status === 200) {
        notification.success({
          message: "Status Updated",
          description: "The quotation status has been updated successfully.",
        });
  
        // Find and update the specific quotation in the state
        setQuotations((prevQuotations) =>
          prevQuotations.map((quotation) =>
            quotation.id === id ? { ...quotation, isApprove: newStatus } : quotation
          )
        );
      }
    } catch (error) {
      console.error("Error updating quotation status:", error);
      notification.error({
        message: "Error",
        description: "Failed to update the quotation status.",
      });
    }
  };

  
  return (
    <div style={{ padding: "5px" }}>
    
    <div className="flex flex-col min-h-screen backdrop-filter backdrop-blur-3xl container mx-auto mb-10 mt-40">
      <div className="flex-grow">
        <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 gap-6">
        <div style={{ marginTop: "20px" }}>
        <Space style={{ marginBottom: "20px" }}>
        <Button type="primary" onClick={fetchQuotations}>
          Reload Quotations List
        </Button>
      </Space>
        {loading ? (
          <p>Loading...</p>
        ) : quotations.length > 0 ? (
          quotations.map((quotation) => (
            <div
              key={quotation.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#fff",
                color: "#000",
              }}
            >
              <p><strong>ID:</strong> {quotation.id}</p>
              <p><strong>Booking ID:</strong> {quotation.bookingId}</p>
              <p><strong>Amount:</strong> {quotation.amount}</p>
              <p>
                <strong>Status:</strong> 
                <Tag color={quotation.isApprove ? "green" : "red"}>
                  {quotation.isApprove ? "Approved" : "Not Approved"}
                </Tag>
              </p>
              <Space>
                <Button type="primary" onClick={() => handleViewDetails(quotation.id)}>
                  View Detail
                </Button>
                <Button
                  style={{
                  backgroundColor: "#FEEC37",
                }}
                  type="default"
                  onClick={() => handleUpdateStatus(quotation.id, "PROCESS")}
                >
                  Process
                </Button>
                <Button
                style={{
                  backgroundColor: "#6EC207",
                }}
                  type="default"
                  onClick={() => handleUpdateStatus(quotation.id, "FINISH")}
                >
                  Finish
                </Button>
                <Button
                style={{
                  backgroundColor: "#D91656",
                }}
                  type="default"
                  onClick={() => handleUpdateStatus(quotation.id, "REJECTED")}
                >
                  Reject
                </Button>
              </Space>
            </div>
          ))
        ) : (
          <p>No quotations found.</p>
        )}
      </div>
        </div>
        
      </div>
    </div>
      
    </div>
  );
};

export default Quotation;
