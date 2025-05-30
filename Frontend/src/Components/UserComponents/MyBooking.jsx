import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../../Utils/api";
import { useSelector } from 'react-redux';

function MyBookings({ user }) {
  const { theme } = useSelector((state) => state.theme);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const token = localStorage.getItem('token')
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/booking/getAll`, config);
      console.log(response.data.data);
      let fullname = `${user[0].firstname} ${user[0].lastname}`;
      const filteredBooking = response.data.data.filter((bookings) => bookings.userName === fullname);
      setBookings(filteredBooking);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user && user.length > 0) {
      fetchBooking();
    }
  }, [user])

  const handleAction = async (id, isChecking) => {
    try {
      const res = await axios.patch(`${BASE_URL}/booking/update/${id}`, { isChecking }, config);
      if (res.status === 200) {
        fetchBooking()
        alert(`Booking ${isChecking === 'Cancel' ? 'cancelled' : 'confirmed'} successfully!`);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking. Please try again.");
    }
  };

  let filteredBookings = bookings;

  if (activeTab !== 'all') {
    filteredBookings = bookings.filter(booking => {
      if (activeTab === 'pending') {
        return booking.isChecking === 'Pending';
      } else if (activeTab === 'confirmed') {
        return booking.isChecking === 'Confirm';
      } else if (activeTab === 'cancelled') {
        return booking.isChecking === 'Cancel';
      } else {
        return true;
      }
    });
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return theme === 'dark'
          ? 'bg-yellow-900 text-yellow-200 border-yellow-700'
          : 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Confirm':
        return theme === 'dark'
          ? 'bg-green-900 text-green-200 border-green-700'
          : 'bg-green-100 text-green-800 border-green-300';
      case 'Cancel':
        return theme === 'dark'
          ? 'bg-red-900 text-red-200 border-red-700'
          : 'bg-red-100 text-red-800 border-red-300';
      default:
        return theme === 'dark'
          ? 'bg-gray-700 text-gray-200 border-gray-600'
          : 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className={` rounded-2xl max-w-6xl mx-auto p-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <h1 className={`text-4xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-800'}`}>My Bookings</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className={`inline-flex rounded-md shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`} role="group">
          <button
            className={`px-5 py-3 text-sm font-medium rounded-l-lg ${activeTab === 'all'
              ? 'bg-indigo-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            onClick={() => setActiveTab('all')}
          >
            All Bookings
          </button>
          <button
            className={`px-5 py-3 text-sm font-medium ${activeTab === 'pending'
              ? 'bg-indigo-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`px-5 py-3 text-sm font-medium ${activeTab === 'confirmed'
              ? 'bg-indigo-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            onClick={() => setActiveTab('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`px-5 py-3 text-sm font-medium rounded-r-lg ${activeTab === 'cancelled'
              ? 'bg-indigo-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className={`p-6 rounded-lg shadow-md text-center ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
          <p>{error}</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className={`p-6 rounded-lg shadow-md text-center ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 flex flex-col md:flex-row md:items-center md:justify-between border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                    {booking.roomId ? booking.roomId.name : 'Room Name Not Available'}
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {booking.hotelId ? booking.hotelId.name : 'Hotel Name Not Available'}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusClass(booking.isChecking)}`}>
                    {booking.isChecking}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Guest Details</h4>
                      <p className="text-lg font-medium">{booking.userName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Check-In</h4>
                        <p className="font-medium">{formatDate(booking.checkInDate)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Check-Out</h4>
                        <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Payment</h4>
                      <p className="text-xl font-bold text-indigo-700">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="mt-6 space-x-3 flex">
                      {booking.status === 'Approved' && booking.isChecking === 'Pending' && (
                        <button
                          className="flex-1 px-4 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors font-medium shadow-sm flex items-center justify-center"
                          onClick={() => handleAction(booking._id, "Confirm")}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Check In
                        </button>
                      )}
                      {booking.isChecking === 'Pending' && (
                        <button
                          className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors font-medium shadow-sm flex items-center justify-center"
                          onClick={() => handleAction(booking._id, "Cancel")}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Cancel Booking
                        </button>
                      )}
                      {booking.isChecking !== 'Pending' && (
                        <div className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 text-center">
                          {booking.isChecking === 'Confirm' ? 'Booking Confirmed' : 'Booking Cancelled'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings