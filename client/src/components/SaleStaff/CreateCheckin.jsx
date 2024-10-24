import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
const CreateCheckin = () => {
    const { bookingId } = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [checkinDate, setCheckinDate] = useState('');
    const [airline, setAirline] = useState('');
    const [airport, setAirport] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cookies] = useCookies();
    const token = cookies.token;

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const checkinRequest = {
            firstName,
            lastName,
            checkinDate,
            airline,
            airport,
        };
        console.log("Check-in Request Data:", checkinRequest);

        console.log("Booking ID:", bookingId);
        try {
            const response = await axios.post(`http://localhost:8080/checkins/${bookingId}`, checkinRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Check-in created successfully!');
        } catch (err) {
            console.error(err); // In ra thông tin lỗi
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-40">
            <h2 className="text-2xl font-semibold text-center text-black">Create Check-in</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" // Thay đổi class thành text-black
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" // Thay đổi class thành text-black
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                    <input
                        type="date"
                        value={checkinDate}
                        onChange={(e) => setCheckinDate(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" // Thay đổi class thành text-black
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Airline</label>
                    <input
                        type="text"
                        value={airline}
                        onChange={(e) => setAirline(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" // Thay đổi class thành text-black
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Airport</label>
                    <input
                        type="text"
                        value={airport}
                        onChange={(e) => setAirport(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" // Thay đổi class thành text-black
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
                >
                    Create Check-in
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
            </form>
        </div>
    );
    
};

export default CreateCheckin;
