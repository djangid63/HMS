import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../Utils/api';
import { useNavigate } from 'react-router-dom';

const BookForm = ({ price, roomId, capacity, hotelId }) => {
  const navigate = useNavigate();

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [userPhone, setUserPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discountValue, setDiscountValue] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const config = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const fetchCoupon = async () => {
    if (!coupon) {
      setDiscountValue(null);
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const response = await axios.get(`${BASE_URL}/coupon/getAll`, config);
      const matchedCoupon = response.data.data.find((dbCoupon) => dbCoupon.code === coupon);
      setDiscountValue(matchedCoupon ? matchedCoupon.discountValue : null);

      if (!matchedCoupon && coupon) {
        setError('Invalid coupon code');
      } else if (matchedCoupon) {
        setError('');
      }
    } catch (err) {
      console.error("Error fetching coupon:", err);
      setDiscountValue(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (coupon) {
        fetchCoupon();
      } else {
        setDiscountValue(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [coupon]);

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

    const totalBeforeDiscount = price * getNights();
    const finalTotal = discountValue ? (totalBeforeDiscount * (1 - discountValue / 100)) : totalBeforeDiscount;

    const bookingData = {
      // userId: user._id || '',
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      userPhone,
      userName: 'DJ',
      totalAmount: finalTotal,
      appliedCoupon: discountValue ? coupon : null,
    };

    try {
      await axios.post(`${BASE_URL}/booking/add`, bookingData, config);

      await axios.patch(`${BASE_URL}/room/update/${roomId}`, { isAvailable: false }, config);

      setSuccess('Booking successful! You will be redirected shortly.');

      setTimeout(() => {
        // navigate('/my-bookings');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      console.error("Booking error:", err);
    }
  };

  const getNights = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end - start;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg sticky top-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Stay</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='flex gap-3'>
          <div>
            <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
            <input
              type="date"
              id="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
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
              min={checkInDate || new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div className='flex gap-3'>
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
          <div>
            <label htmlFor='contact' className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
            <input
              type='tel'
              id='contact'
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor='coupon' className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <div className="flex">
            <input
              type='text'
              id='coupon'
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder='Enter code (e.g. NEW50)'
            />
          </div>
          {isApplyingCoupon && <p className="text-xs text-gray-500 mt-1">Checking coupon...</p>}
          {discountValue && <p className="text-xs text-green-600 mt-1">Coupon applied! {discountValue}% off</p>}
        </div>
        <div className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 mt-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span>Price per night:</span>
              <span className="text-blue-600">₹{price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Nights:</span>
              <span className="text-blue-600">{getNights()}</span>
            </div>
            {discountValue && (
              <div className="flex justify-between items-center">
                <span>Discount:</span>
                <span className="text-green-600">- {discountValue}%</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 mt-1 flex justify-between items-center font-bold">
              <span>Total:</span>
              <span className="text-blue-700">
                {discountValue ? (
                  <>
                    <span className="text-gray-500 line-through text-sm mr-2">₹{price * getNights()}</span>
                    ₹{(price * getNights() * (1 - discountValue / 100)).toFixed(0)}
                  </>
                ) : (
                  <>₹{price * getNights()}</>
                )}
              </span>
            </div>
          </div>
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
