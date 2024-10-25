import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";

const CreateQuotation = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("Quotation being in Process...");
    const [decodedToken, setDecodedToken] = useState(null);
    const [cookies] = useCookies(["token"]);
    const token = cookies.token;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setDecodedToken(decoded); // Lưu token đã giải mã vào state
            console.log("Decoded Token:", decoded);
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        } else {
          console.log("No token found");
        }
      }, [token]);

    const handleCreateQuotation = async (e) => {
        e.preventDefault();
        setLoading(true);
        const quotationData = { 
            bookingId: parseInt(bookingId, 10),
            amount: parseFloat(amount),
            description
        };
        console.log("Sending data:", quotationData);
        
        try {
            const response = await axios.post("http://localhost:8080/quotations/create", 
                quotationData,
                {
                    headers: {
                      Authorization: `Bearer ${token}`, // Ensure the token is correctly passed
                      "Content-Type": "application/json",
                    },
                  });
            if (response.status === 201) {
                toast.success('Quotation created successfully!');
                navigate(-1);
            }
        } catch (err) {
            console.error("Error details:", err.response.data);
            toast.error('Error creating quotation: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray overflow-hidden">
            <div className="bg-[#FEEE91] shadow-lg rounded-lg p-8 max-w-2xl w-full">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Create a New Quotation</h2>
                <form onSubmit={handleCreateQuotation} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-gray-700 font-semibold">Booking ID:</label>
                        <input 
                            type="text" 
                            value={bookingId} 
                            readOnly 
                            className="w-full p-2 border rounded bg-white text-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700 font-semibold">Amount:</label>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-gray-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700 font-semibold">Description:</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-gray-800"
                            rows="3"
                            required
                        ></textarea>
                    </div>
                    <div className="flex space-x-4">
                        <button 
                            type="submit" 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateQuotation;
