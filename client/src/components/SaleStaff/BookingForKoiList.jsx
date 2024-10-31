import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border border-blue-200',
  shipped: 'bg-green-100 text-green-800 border border-green-200',
  delivery: 'bg-purple-100 text-purple-800 border border-purple-200',
  cancelled: 'bg-red-100 text-red-800 border border-red-200',
  complete: 'bg-gray-100 text-gray-800 border border-gray-200',
};

const BookingForKoiList = () => {
  const [bookings, setBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const token = cookies.token;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/bookings/BookingForKoi`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedBookings = response.data.sort((a, b) => b.id - a.id);
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to fetch bookings");
        setErrorMessage("Failed to fetch bookings");
      }
    };
  
    fetchBookings();
  }, [token]);
  
  const handleViewDetail = (bookingId) => {
    navigate('/booking-detail', { state: { bookingId } });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-40">
      <div className="max-w-full px-6 py-8">
        <ToastContainer />
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Koi Booking Management</h1>
          <p className="mt-2 text-lg text-gray-600">Manage and track all your koi bookings in one place</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{bookings.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full pl-12 pr-4 py-3 text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-8 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-8 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-8 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-8 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-4 bg-gray-50 text-right text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-lg font-medium text-gray-900">#{booking.id}</span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-lg text-gray-900">{booking.nameCus}</span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-lg font-medium text-green-600">
                        {new Intl.NumberFormat('vi-VN', { 
                          style: 'currency', 
                          currency: 'VND',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(booking.totalAmountWithVAT)}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${statusStyles[booking.paymentStatus]}`}>
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'currentColor' }}></span>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleViewDetail(booking.id)}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForKoiList;
