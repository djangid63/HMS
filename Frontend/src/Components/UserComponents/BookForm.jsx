import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../Utils/api';
import { useNavigate } from 'react-router-dom';

const BookForm = ({ price, roomId, hotelId, capacity }) => {
  const navigate = useNavigate();

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // if (!user) {
    //   setError('You must be logged in to make a booking.');
    //   navigate('/login');
    //   return;
    // }

    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates.');
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    if (numberOfGuests > capacity) {
      setError(`Number of guests cannot exceed the room capacity of ${capacity}.`);
      return;
    }

    // setTotalDays(() => {
    //   const start = new Date(checkInDate);
    //   const end = new Date(checkOutDate);
    //   const diffTime = Math.abs(end - start);
    //   console.log(diffTime);
    //   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // });
    // setTotalDays()

    const bookingData = {
      // userId: user._id || '',
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      userPhone: 85214632,
      userName: 'DJ',
      totalAmount: price * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)),
    };

    try {
      const response = await axios.post(`${BASE_URL}/booking/add`, bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
      });
      setSuccess('Booking successful! You will be redirected shortly.');
      // Optionally, redirect to a confirmation page or user's bookings page
      setTimeout(() => {
        navigate('/my-bookings'); // Example redirect
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      console.error("Booking error:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Stay</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
          <input
            type="date"
            id="checkInDate"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
          <input
            type="date"
            id="checkOutDate"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            min={checkInDate || new Date().toISOString().split('T')[0]} // Prevent selecting dates before check-in
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
          <input
            type="number"
            id="numberOfGuests"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(parseInt(e.target.value, 10))}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="text-lg font-semibold text-gray-800">
          Price per night: <span className="text-blue-600">₹{price * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)) || price}</span>
        </div>
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        {success && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookForm;
