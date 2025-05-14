import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../Utils/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BookForm = ({ price, roomId, capacity, user, hotelId }) => {
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [userPhone, setUserPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discountValue, setDiscountValue] = useState(null); const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const role = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = role === 'admin';
  const adminDiscount = isAdmin ? 20 : 0;
  console.log('user', user);
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
  const handleApplyCoupon = () => {
    if (!coupon) {
      setError('Please enter a coupon code');
      return;
    }
    fetchCoupon();
  };

  const getNights = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end - start;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const calculateTotal = () => {
    const nights = getNights();
    const totalBeforeDiscount = price * nights;

    const couponDiscountPercent = discountValue || 0;
    const effectiveDiscountPercent = isAdmin ? Math.max(adminDiscount, couponDiscountPercent) : couponDiscountPercent;

    return effectiveDiscountPercent > 0
      ? (totalBeforeDiscount * (1 - effectiveDiscountPercent / 100)).toFixed(2)
      : totalBeforeDiscount.toFixed(2);
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

    if (localStorage.getItem('token') == '') {
      setError('You must be logged in to make a booking.');
      navigate('/login');
      return;
    }

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
    } const totalBeforeDiscount = price * getNights();

    const couponDiscountPercent = discountValue || 0;
    const effectiveDiscountPercent = isAdmin ? Math.max(adminDiscount, couponDiscountPercent) : couponDiscountPercent;

    const finalTotal = effectiveDiscountPercent > 0
      ? (totalBeforeDiscount * (1 - effectiveDiscountPercent / 100))
      : totalBeforeDiscount;
    const isAdminDiscountApplied = isAdmin && (!discountValue || adminDiscount >= discountValue);





    const bookingData = {
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      userPhone,
      userName: `${user.firstname} ${user.lastname}`,
      totalAmount: finalTotal,
      appliedCoupon: isAdminDiscountApplied ? null : (discountValue ? coupon : null),
      adminDiscount: isAdminDiscountApplied ? adminDiscount : null,
    };

    try {
      await axios.post(`${BASE_URL}/booking/add`, bookingData, config);

      await axios.patch(`${BASE_URL}/room/update/${roomId}`, { isAvailable: false }, config);

      setSuccess('Booking successful! You will be redirected shortly.');

      setTimeout(() => {
        navigate('/userPage/bookings');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      console.error("Booking error:", err);
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-5 rounded-xl shadow-lg sticky top-24`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Book Your Stay</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='flex gap-3'>
          <div>
            <label htmlFor="checkInDate" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Check-in Date</label>
            <input
              type="date"
              id="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300 text-gray-900'
                }`}
              required
            />
          </div>
          <div>
            <label htmlFor="checkOutDate" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Check-out Date</label>
            <input
              type="date"
              id="checkOutDate"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate || new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300 text-gray-900'
                }`}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="numberOfGuests" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Number of Guests</label>
          <input
            type="number"
            id="numberOfGuests"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(Math.max(1, Math.min(e.target.value, capacity)))}
            min="1"
            max={capacity}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'border-gray-300 text-gray-900'
              }`}
            required
          />
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Maximum capacity: {capacity} guests</p>
        </div>

        <div>
          <label htmlFor="userPhone" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
          <input
            type="tel"
            id="userPhone"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="Your contact number"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'border-gray-300 text-gray-900'
              }`}
            required
          />
        </div>

        <div>
          <label htmlFor="couponCode" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Coupon Code (Optional)</label>
          <div className="flex">
            <input
              type="text"
              id="couponCode"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
              className={`w-full px-3 py-2 border rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300 text-gray-900'
                }`}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon}
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply
            </button>
          </div>
        </div>

        <div className={`border-t border-b py-4 my-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between">
            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Base Price</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>₹{price}</span>
          </div>

          {(discountValue || adminDiscount > 0) && (
            <div className="flex justify-between mt-2">
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Discount</span>
              <span className="font-medium text-green-600">
                -{(discountValue || 0) + adminDiscount}%
              </span>
            </div>
          )}          {getNights() > 0 && (
            <div className="flex justify-between mt-2">
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Stay Duration</span>
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{getNights()} {getNights() === 1 ? 'night' : 'nights'}</span>
            </div>
          )}

          <div className="flex justify-between mt-4 text-lg font-bold">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Total</span>
            <span className="text-indigo-600">
              ₹{calculateTotal()}
            </span>
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}

        <button
          type="submit"
          className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${!checkInDate || !checkOutDate || !numberOfGuests || !userPhone ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          disabled={!checkInDate || !checkOutDate || !numberOfGuests || !userPhone}
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookForm;
