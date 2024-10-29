import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

const CreateCheckin = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [commonInfo, setCommonInfo] = useState({
        airline: '',
        airport: '',
        checkinDate: ''
    });
    const [participants, setParticipants] = useState([]);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cookies] = useCookies();
    const token = cookies.token;

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/BookingTourDetail/${bookingId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBookingDetails(response.data[0]);
                // Khởi tạo mảng participants dựa vào số lượng participant
                const participantCount = response.data[0].participant;
                setParticipants(Array(participantCount).fill().map(() => ({
                    firstName: '',
                    lastName: ''
                })));
            } catch (err) {
                setError('Failed to fetch booking details');
            }
        };
        fetchBookingDetails();
    }, [bookingId]);

    const handleCommonInfoChange = (e) => {
        setCommonInfo({
            ...commonInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleParticipantChange = (index, field, value) => {
        const newParticipants = [...participants];
        newParticipants[index] = {
            ...newParticipants[index],
            [field]: value
        };
        setParticipants(newParticipants);
    };

    const handleSubmit = async () => {
        try {
            // Tạo một mảng promises để xử lý tất cả các request
            const checkinPromises = participants.map(participant => {
                const checkinData = {
                    firstName: participant.firstName,
                    lastName: participant.lastName,
                    airline: commonInfo.airline,
                    airport: commonInfo.airport,
                    checkinDate: commonInfo.checkinDate
                };
                
                return axios.post(
                    `http://localhost:8080/checkins/${bookingId}`, 
                    checkinData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            });

            // Chờ tất cả các request hoàn thành
            await Promise.all(checkinPromises);
            
            setSuccess('All check-ins created successfully!');
            setTimeout(() => {
                navigate('/CheckinService');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while creating check-ins');
        }
    };

    return (
        <div className="container mx-auto p-6 mt-40">
            <h2 className="text-2xl font-semibold text-center text-black mb-6">Create Check-in</h2>
            
            <div className="grid grid-cols-2 gap-8">
                {/* Phần thông tin chung - bên trái */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-medium mb-4 text-black">Common Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-black">Airline</label>
                            <input
                                type="text"
                                name="airline"
                                value={commonInfo.airline}
                                onChange={handleCommonInfoChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black">Airport</label>
                            <input
                                type="text"
                                name="airport"
                                value={commonInfo.airport}
                                onChange={handleCommonInfoChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black">Check-in Date</label>
                            <input
                                type="date"
                                name="checkinDate"
                                value={commonInfo.checkinDate}
                                onChange={handleCommonInfoChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Phần thông tin người tham gia */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-medium mb-4 text-black">Participant Information</h3>
                    <div className="space-y-4">
                        {participants.map((participant, index) => (
                            <div key={index}>
                                <div className="mb-2">
                                    <h4 className="text-md font-medium text-black mb-2">Participant {index + 1}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">First Name</label>
                                            <input
                                                type="text"
                                                value={participant.firstName}
                                                onChange={(e) => handleParticipantChange(index, 'firstName', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md p-2 text-black"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                value={participant.lastName}
                                                onChange={(e) => handleParticipantChange(index, 'lastName', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md p-2 text-black"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                {index < participants.length - 1 && <hr className="my-4 border-gray-200" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nút submit ở dưới cùng */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                >
                    Create Check-in
                </button>
            </div>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {success && <p className="text-green-500 text-center mt-4">{success}</p>}
        </div>
    );
};

export default CreateCheckin;
