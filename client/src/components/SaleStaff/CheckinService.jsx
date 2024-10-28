import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const CheckinService = () => {
    const [checkins, setCheckins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCheckins();
    }, []);

    const fetchCheckins = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/checkins/all', {
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });
            setCheckins(response.data);
        } catch (err) {
            message.error('Failed to fetch check-ins');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (checkinId) => {
        if (!checkinId) {
            message.error('Invalid checkin ID');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/checkins/status/${checkinId}`,
                {},  // Empty object as body
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            
            const updatedCheckin = response.data;
            
            setCheckins(prevCheckins => 
                prevCheckins.map(checkin => 
                    checkin.id === checkinId ? updatedCheckin : checkin
                )
            );
            
            message.success('Check-in status updated successfully');
        } catch (err) {
            console.error('Error updating check-in status:', err.response?.data || err.message);
            message.error('Failed to update check-in status: ' + (err.response?.data?.message || err.message));
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: 'Airline',
            dataIndex: 'airline',
            key: 'airline',
        },
        {
            title: 'Airport',
            dataIndex: 'airport',
            key: 'airport',
        },
        {
            title: 'Check-in Date',
            dataIndex: 'checkinDate',
            key: 'checkinDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Booking ID',
            dataIndex: 'bookingId',
            key: 'bookingId',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Updated By',
            dataIndex: 'updateBy',
            key: 'updateBy',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    onClick={() => updateStatus(record.id)}
                    disabled={record.status === 'CHECKED'}
                >
                    Mark as Checked
                </Button>
            ),
        },
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-40">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-black">Check-in Management</h2>
                <Button 
                    type="primary"
                    onClick={() => navigate('/booking-list-for-staff')}
                >
                    View Bookings
                </Button>
            </div>
            <Table 
                dataSource={checkins}
                columns={columns}
                rowKey="id"
                loading={loading}
            />
        </div>
    );
};

export default CheckinService;
