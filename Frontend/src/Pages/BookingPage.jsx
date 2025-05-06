import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../Utils/api'

const RoomBooking = () => {
  const { roomId } = useParams()
  const [rooms, setRooms] = useState([])
  const [location, setLocation] = useState('')
  const [roomPrice, setRoomPrice] = useState(0)
  const [roomType, setRoomType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = localStorage.getItem('token')
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomList = await axios.get(`${BASE_URL}/room/getAll`);
        const filterRoom = roomList.data.data.filter((room) => room._id == roomId)
        setRooms(filterRoom)

        if (filterRoom.length > 0) {
          setLocation(filterRoom[0].hotelId.name)
          setRoomPrice(filterRoom[0].price || 0)
          setRoomType(filterRoom[0].type || '')

          setFormData(prev => ({
            ...prev,
            roomId: roomId,
            type: filterRoom[0].type || ''
          }))
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch room details');
      }
    };
    fetchRooms();
  }, [roomId]);

  const [formData, setFormData] = useState({
    roomId: roomId,
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: '',
    totalAmount: '',
    userName: '',
    userPhone: '',
    type: ''
  });

  const calculateDays = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Calculate total amount when dates change
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const days = calculateDays(formData.checkInDate, formData.checkOutDate);
      const total = days * roomPrice;
      setFormData(prev => ({
        ...prev,
        totalAmount: total
      }));
    }
  }, [formData.checkInDate, formData.checkOutDate, roomPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    const { checkInDate, checkOutDate, numberOfGuests, userName, userPhone } = formData;

    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(checkInDate) < today) {
      setError('Check-in date cannot be in the past');
      return false;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError('Check-out date must be after check-in date');
      return false;
    }

    if (!numberOfGuests || numberOfGuests < 1) {
      setError('Please enter at least 1 guest');
      return false;
    }

    if (!userName.trim()) {
      setError('Please enter your name');
      return false;
    }

    if (!userPhone || userPhone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/booking/add`, formData, config);
      console.log(response.data);
      setSuccess('Booking confirmed successfully!');
    } catch (error) {
      console.error('Booking error:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500">
      {/* SearchNavBar component */}
      {/* <div>
        <SearchNavBar roomId={roomId} />
      </div> */}

      {/* Booking form container */}
      <div className="px-4 py-4 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-10 transform transition-all hover:shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent">
            Book Your Stay
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="userName" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Full Name</label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="hotelName" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Hotel</label>
                <input
                  type="text"
                  id="hotelName"
                  name="hotelName"
                  value={location}
                  readOnly
                  className="w-full rounded-lg px-4 py-3 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200 bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Room Type</label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={roomType}
                  readOnly
                  className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200 bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label htmlFor="numberOfGuests" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Number of Guests</label>
                <input
                  type="number"
                  id="numberOfGuests"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  min="1"
                  className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="checkInDate" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Check-in Date</label>
                <input
                  type="date"
                  id="checkInDate"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="checkOutDate" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Check-out Date</label>
                <input
                  type="date"
                  id="checkOutDate"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleChange}
                  min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="userPhone" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Phone Number</label>
              <input
                type="tel"
                id="userPhone"
                name="userPhone"
                value={formData.userPhone}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                <label htmlFor="totalAmount" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Total Amount ($)</label>
                <input
                  type="number"
                  id="totalAmount"
                  name="totalAmount"
                  value={formData.totalAmount}
                  readOnly
                  className="w-full rounded-lg px-4 py-3 bg-gray-100 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200 cursor-not-allowed"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.checkInDate && formData.checkOutDate
                    ? `${calculateDays(formData.checkInDate, formData.checkOutDate)} nights at $${roomPrice}/night`
                    : 'Select dates to calculate total'}
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 text-white rounded-lg font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-amber-600 hover:to-amber-600 transform hover:scale-105'} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-all shadow-md`}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RoomBooking
