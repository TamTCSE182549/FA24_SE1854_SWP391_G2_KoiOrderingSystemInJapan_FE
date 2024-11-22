import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useCookies } from "react-cookie"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

const airlineOptions = [
    { value: "Vietnam Airlines", label: "Vietnam Airlines" },
    { value: "Vietjet Air", label: "Vietjet Air" },
    { value: "Jetstar Pacific", label: "Jetstar Pacific" },
    { value: "Bamboo Airways", label: "Bamboo Airways" },
];

const airportOptions = [
    { value: "Noi Bai International Airport (Hanoi)", label: "Noi Bai International Airport (Hanoi)" },
    { value: "Tan Son Nhat International Airport (Ho Chi Minh City)", label: "Tan Son Nhat International Airport (Ho Chi Minh City)" },
    { value: "Da Nang International Airport", label: "Da Nang International Airport" },
    { value: "Cam Ranh International Airport (Khanh Hoa)", label: "Cam Ranh International Airport (Khanh Hoa)" },
    { value: "Phu Bai International Airport (Thua Thien Hue)", label: "Phu Bai International Airport (Thua Thien Hue)" },
    { value: "Lien Khuong International Airport (Da Lat)", label: "Lien Khuong International Airport (Da Lat)" },
    { value: "Cat Bi International Airport (Hai Phong)", label: "Cat Bi International Airport (Hai Phong)" },
];

const paymentOptions = [
    // { value: "CASH", label: "💵 Cash" },
    { value: "VISA", label: "💳 Visa" },
    { value: "TRANSFER", label: "🏦 Transfer" },
];

function BookingTourCustom() {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        farmId: [],
        participant: 0,
        paymentMethod: 'Select Payment Method',
        description: '',
        airline: '',
        airport: ''
    });
    const [farms, setFarms] = useState([]);
    const [cookies] = useCookies(["token"]);
    const token = cookies.token;
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [newParticipants, setNewParticipants] = useState([{ firstName: '', lastName: '', email: '', phoneNumber: '', passport: '' }]);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/koi-farm/list-farm-active', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFarms(response.data);
            } catch (error) {
                console.error('Error fetching farms:', error);
            }
        };

        fetchFarms();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFarmChange = (selectedOptions) => {
        const selectedFarms = selectedOptions.map(option => option.label);
        setFormData({
            ...formData,
            farmId: selectedOptions.map(option => option.value),
            description: selectedFarms.join(', ')
        });
    };

    const handleAirlineChange = (selectedOption) => {
        setFormData({
            ...formData,
            airline: selectedOption.value
        });
    };

    const handleAirportChange = (selectedOption) => {
        setFormData({
            ...formData,
            airport: selectedOption.value
        });
    };

    const validateName = (name) => {
        return name.trim().length > 0;
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^09\d{8}$/;
        return phoneRegex.test(phone);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@gmail\.com$/;
        return emailRegex.test(email);
    };

    const validatePassport = (passport) => {
        const passportRegex = /^B\d{7}$/;
        return passportRegex.test(passport);
    };

    const containsSpecialChars = (str) => {
        const regex = /^[a-zA-Z\s-]+$/;
        return !regex.test(str);
    };

    const isDuplicatePassport = (passport, index) => {
        return newParticipants.some(
            (participant, idx) => 
                idx !== index && 
                participant.passport && 
                participant.passport.toLowerCase() === passport.toLowerCase()
        );
    };

    const validateParticipant = (participant) => {
        const errors = {};
        if (!validateName(participant.firstName)) {
            errors.firstName = "First name is required.";
        }
        if (!validateName(participant.lastName)) {
            errors.lastName = "Last name is required.";
        }
        if (participant.email && !validateEmail(participant.email)) {
            errors.email = "Email must be a valid Gmail address.";
        }
        if (!validatePhone(participant.phoneNumber)) {
            errors.phoneNumber = "Phone number must start with 09 and have 10 digits.";
        }
        if (!validatePassport(participant.passport)) {
            errors.passport = "Passport number must start with 'B' followed by 7 digits.";
        }
        return errors;
    };

    const addNewParticipantForm = () => {
        const errors = validateParticipant(newParticipants[newParticipants.length - 1]);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            toast.error("Please fix the errors before adding a participant.");
            return;
        }
        setNewParticipants([...newParticipants, { firstName: '', lastName: '', email: '', phoneNumber: '', passport: '' }]);
        setValidationErrors({});
    };

    const handleNewParticipantChange = (index, field, value) => {
        const updatedParticipants = [...newParticipants];
        updatedParticipants[index][field] = value;
        setNewParticipants(updatedParticipants);
        setValidationErrors({});
    };

    const removeParticipantForm = (index) => {
        const updatedParticipants = newParticipants.filter((_, i) => i !== index);
        setNewParticipants(updatedParticipants);
    };

    const viewParticipants = () => {
        setIsViewModalVisible(true);
    };

    const handleViewModalCancel = () => {
        setIsViewModalVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate Select Airline
        if (!formData.airline) {
            toast.error("Please select an airline");
            return;
        }

        // Validate Select Airport
        if (!formData.airport) {
            toast.error("Please select an airport");
            return;
        }

        // Validate Select Farms
        if (formData.farmId.length === 0) {
            toast.error("Please select at least one farm");
            return;
        }

        // Validate Payment Method
        if (formData.paymentMethod === 'Select Payment Method' || !formData.paymentMethod) {
            toast.error("Please select a payment method");
            return;
        }

        // Validate participants
        if (newParticipants.length === 0) {
            toast.error("Please add at least one participant");
            return;
        }

        // Existing participant validations
        for (const participant of newParticipants) {
            if (!validateName(participant.firstName) || !validateName(participant.lastName)) {
                toast.error("First name and last name are required for all participants");
                return;
            }

            if (!participant.phoneNumber || !validatePhone(participant.phoneNumber)) {
                toast.error("Phone number is required and must be in format 09xxxxxxxx");
                return;
            }

            if (!participant.passport || !validatePassport(participant.passport)) {
                toast.error("Passport is required and must be in format B2700000 (B followed by 7 digits)");
                return;
            }

            if (participant.email && !validateEmail(participant.email)) {
                toast.error("Email must be in format xxx@gmail.com");
                return;
            }

            if (containsSpecialChars(participant.firstName) || containsSpecialChars(participant.lastName)) {
                toast.warning("Names can only contain letters and spaces");
                return;
            }
        }

        // Check for duplicate passports
        const hasDuplicates = newParticipants.some((participant, index) => 
            isDuplicatePassport(participant.passport, index)
        );

        if (hasDuplicates) {
            toast.error("Please fix duplicate passport numbers before continuing");
            return;
        }

        // Validate dates
        if (!formData.startDate || !formData.endDate) {
            toast.error("Start date and end date are required");
            return;
        }

        // Validate end date is after start date
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            toast.error("End date must be after start date");
            return;
        }

        try {
            const startDateTime = `${formData.startDate}T00:00:00`;
            const endDateTime = `${formData.endDate}T23:59:59`;

            console.log('Data to be sent:', {
                startDate: startDateTime,
                endDate: endDateTime,
                farmId: formData.farmId,
                participant: newParticipants.length,
                paymentMethod: formData.paymentMethod,
                description: formData.description
            });

            const response = await axios.post('http://localhost:8080/bookings/CreateForTour/customer', {
                startDate: startDateTime,
                endDate: endDateTime,
                farmId: formData.farmId,
                participant: newParticipants.length,
                paymentMethod: formData.paymentMethod,
                description: formData.description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Booking successful:', response.data);
            
            const bookingId = response.data.id;
            for (const participant of newParticipants) {
                const checkinData = {
                    firstName: participant.firstName,
                    lastName: participant.lastName,
                    email: participant.email,
                    phoneNumber: participant.phoneNumber,
                    passport: participant.passport,
                    checkinDate: formData.startDate,
                    airline: formData.airline,
                    airport: formData.airport
                };

                await axios.post(`http://localhost:8080/checkins/${bookingId}`, checkinData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            toast.success('Booking successful!');
            setTimeout(() => {
                navigate('/tour');
            }, 2000);

        } catch (error) {
            console.error('Error creating booking or check-in:', error);
            toast.error('Error creating booking or check-in. Please try again.');
        }
    };

    const today = new Date().toISOString().split("T")[0];

    const handleAddModalOk = () => {
        const errors = validateParticipant(newParticipants[newParticipants.length - 1]);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            toast.error("Please fix the errors before adding a participant.");
            return;
        }
        setIsAddModalVisible(false);
    };

    const handleAddModalCancel = () => {
        setIsAddModalVisible(false);
    };

    return (
        <div className="min-h-screen bg-[#f0f4ff] py-12 pt-40">
            <ToastContainer />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-[#4A90E2]">Booking Tour Custom Page</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            onChange={handleChange}
                            required
                            min={today}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            onChange={handleChange}
                            required
                            min={formData.startDate}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="airline">Select Airline</label>
                        <Select
                            name="airline"
                            onChange={handleAirlineChange}
                            options={airlineOptions}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="airport">Select Airport</label>
                        <Select
                            name="airport"
                            onChange={handleAirportChange}
                            options={airportOptions}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="participant">Participants</label>
                        <input
                            type="number"
                            name="participant"
                            value={newParticipants.length}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                        <div className="flex justify-between mt-2">
                            <button
                                type="button"
                                onClick={() => setIsAddModalVisible(true)}
                                className="text-blue-600 hover:underline"
                            >
                                + Add Participant
                            </button>
                            <button
                                type="button"
                                onClick={viewParticipants}
                                className="text-green-600 hover:underline"
                            >
                                View Participants
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="farms">Select Farms</label>
                        <Select
                            name="farms"
                            onChange={handleFarmChange}
                            options={farms.map(farm => ({ value: farm.id, label: farm.farmName }))}
                            isMulti
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="description">Description (Selected Farms)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Payment Method</label>
                        <Select
                            options={paymentOptions}
                            onChange={(selectedOption) => setFormData({ ...formData, paymentMethod: selectedOption.value })}
                            className="w-full"
                            placeholder="Select payment method"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    color: 'black',
                                }),
                                option: (provided) => ({
                                    ...provided,
                                    color: 'black',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: 'black',
                                }),
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#4A90E2] text-white font-bold py-2 rounded-md hover:bg-[#357ABD] transition duration-200"
                    >
                        Book Tour
                    </button>
                </form>

                <Modal
                    title="Add New Participant"
                    visible={isAddModalVisible}
                    onOk={handleAddModalOk}
                    onCancel={handleAddModalCancel}
                    okText="Add"
                    cancelText="Cancel"
                >
                    <div className="p-4">
                        {newParticipants.map((participant, index) => (
                            <div key={index} className="mb-6 p-4 border rounded-lg">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="First Name *"
                                            className="border rounded-lg p-2 text-black w-full"
                                            value={participant.firstName}
                                            required
                                            onChange={(e) =>
                                                handleNewParticipantChange(index, "firstName", e.target.value)
                                            }
                                        />
                                        {validationErrors.firstName && <p className="text-red-500">{validationErrors.firstName}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Last Name *"
                                            className="border rounded-lg p-2 text-black w-full"
                                            value={participant.lastName}
                                            required
                                            onChange={(e) =>
                                                handleNewParticipantChange(index, "lastName", e.target.value)
                                            }
                                        />
                                        {validationErrors.lastName && <p className="text-red-500">{validationErrors.lastName}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email (optional)"
                                            className="border rounded-lg p-2 text-black w-full"
                                            value={participant.email}
                                            onChange={(e) =>
                                                handleNewParticipantChange(index, "email", e.target.value)
                                            }
                                        />
                                        {validationErrors.email && <p className="text-red-500">{validationErrors.email}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number (09xxxxxxxx) *"
                                            className="border rounded-lg p-2 text-black w-full"
                                            value={participant.phoneNumber}
                                            required
                                            onChange={(e) =>
                                                handleNewParticipantChange(index, "phoneNumber", e.target.value)
                                            }
                                        />
                                        {validationErrors.phoneNumber && <p className="text-red-500">{validationErrors.phoneNumber}</p>}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        placeholder="Passport Number (Bxxxxxxx) *"
                                        className="border rounded-lg p-2 text-black w-full"
                                        value={participant.passport}
                                        required
                                        onChange={(e) =>
                                            handleNewParticipantChange(index, "passport", e.target.value)
                                        }
                                    />
                                    {validationErrors.passport && <p className="text-red-500">{validationErrors.passport}</p>}
                                </div>
                                {newParticipants.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeParticipantForm(index)}
                                        className="mt-4 text-red-500 hover:text-red-700"
                                    >
                                        Remove Participant
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addNewParticipantForm}
                            className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            + Add Another Participant
                        </button>
                        <div className="mt-4 text-sm text-gray-500">
                            * Required fields
                        </div>
                    </div>
                </Modal>

                <Modal
                    title="View Participants"
                    visible={isViewModalVisible}
                    onCancel={handleViewModalCancel}
                    footer={null}
                >
                    <div className="p-4">
                        {newParticipants.length === 0 ? (
                            <div className="text-center text-gray-500">
                                No participants added yet
                            </div>
                        ) : (
                            newParticipants.map((participant, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-medium">
                                            Participant {index + 1}
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => removeParticipantForm(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500">First Name</label>
                                            <p className="font-medium">{participant.firstName}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Last Name</label>
                                            <p className="font-medium">{participant.lastName}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Email</label>
                                            <p className="font-medium">{participant.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Phone</label>
                                            <p className="font-medium">{participant.phoneNumber}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-gray-500">Passport</label>
                                            <p className="font-medium">{participant.passport}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default BookingTourCustom;
