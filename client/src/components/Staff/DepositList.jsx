import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Input, Space, Card, Typography, Breadcrumb } from 'antd';
import { SearchOutlined, EyeOutlined, HomeOutlined, WalletOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title, Text } = Typography;

const DepositList = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [cookies] = useCookies();
    const navigate = useNavigate();
    const token = cookies.token;

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            const response = await axios.get('http://localhost:8080/deposit/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDeposits(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching deposits:', error);
            toast.error('Failed to fetch deposits');
            setLoading(false);
        }
    };

    const handleViewDetail = (bookingId) => {
        navigate(`/view-detail-deposit/${bookingId}`);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'complete':
                return 'success';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'Booking ID',
            dataIndex: 'bookingId',
            key: 'bookingId',
            sorter: (a, b) => a.bookingId - b.bookingId,
            render: (id) => (
                <Text strong className="text-blue-600">#{id}</Text>
            ),
        },
        {
            title: 'Deposit Amount',
            dataIndex: 'depositAmount',
            key: 'depositAmount',
            render: (amount) => (
                <div className="font-medium">
                    <span className="text-green-600">$</span>
                    <span>{amount.toFixed(2)}</span>
                </div>
            ),
            sorter: (a, b) => a.depositAmount - b.depositAmount,
        },
        {
            title: 'Remain Amount',
            dataIndex: 'remainAmount',
            key: 'remainAmount',
            render: (amount) => (
                <div className="font-medium">
                    <span className="text-orange-600">$</span>
                    <span>{amount.toFixed(2)}</span>
                </div>
            ),
            sorter: (a, b) => a.remainAmount - b.remainAmount,
        },
        {
            title: 'Deposit Date',
            dataIndex: 'depositDate',
            key: 'depositDate',
            render: (date) => (
                <Text className="text-gray-600">
                    {new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </Text>
            ),
            sorter: (a, b) => new Date(a.depositDate) - new Date(b.depositDate),
        },
        {
            title: 'Expected Delivery',
            dataIndex: 'deliveryExpectedDate',
            key: 'deliveryExpectedDate',
            render: (date) => (
                <Text className="text-gray-600">
                    {new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'depositStatus',
            key: 'depositStatus',
            render: (status) => (
                <Tag color={getStatusColor(status)} className="px-4 py-1 rounded-full text-sm font-medium">
                    {status?.toUpperCase() || 'N/A'}
                </Tag>
            ),
            filters: [
                { text: 'Complete', value: 'complete' },
                { text: 'Pending', value: 'pending' },
            ],
            onFilter: (value, record) => record.depositStatus?.toLowerCase() === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(record.bookingId)}
                    className="bg-blue-500 hover:bg-blue-600 border-none shadow-sm"
                >
                    View Detail
                </Button>
            ),
        },
    ];

    const filteredDeposits = deposits.filter(deposit => 
        deposit.bookingId.toString().includes(searchText) ||
        deposit.depositStatus?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 pt-40">
            <ToastContainer />
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-8">
                    <Title level={2} className="mb-2">Deposit Management</Title>
                    <Text type="secondary">Manage and track all your deposits in one place</Text>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <Text type="secondary">Total Deposits</Text>
                    <Title level={3} className="m-0">{deposits.length}</Title>
                </div>

                <Card className="shadow-lg rounded-lg border-0">
                    <div className="flex justify-between items-center mb-8 border-b pb-6">
                        <div>
                            <Title level={4} className="mb-1">Deposit List</Title>
                            <Text type="secondary">View and manage deposit details</Text>
                        </div>
                        <Space size="large">
                            <Input
                                placeholder="Search deposits..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                className="min-w-[300px] rounded-lg"
                                size="large"
                            />
                        </Space>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredDeposits}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} deposits`,
                            className: "pb-4"
                        }}
                        className="shadow-sm"
                        scroll={{ x: 1200 }}
                        rowClassName="hover:bg-gray-50 transition-colors"
                    />
                </Card>
            </div>
        </div>
    );
};

export default DepositList;
