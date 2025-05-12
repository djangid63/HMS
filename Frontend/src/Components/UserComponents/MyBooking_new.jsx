import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../../Utils/api";

function MyBookings() {
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
      setBookings(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooking();
  }, [])

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

  // Filter bookings based on active tab
  const filteredBookings = activeTab === 'all'
    ? bookings
    : bookings.filter(booking =>
      activeTab === 'pending'
        ? booking.isChecking === 'Pending'
        : activeTab === 'confirmed'
          ? booking.isChecking === 'Confirm'
          : activeTab === 'cancelled'
            ? booking.isChecking === 'Cancel'
            : true
    );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Confirm': return 'bg-green-100 text-green-800 border-green-300';
      case 'Cancel': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-800">My Bookings</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm bg-white" role="group">
          <button
            className={`px-5 py-3 text-sm font-medium rounded-l-lg ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('all')}
          >
            All Bookings
          </button>
          <button
            className={`px-5 py-3 text-sm font-medium ${activeTab === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`px-5 py-3 text-sm font-medium ${activeTab === 'confirmed' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`px-5 py-3 text-sm font-medium rounded-r-lg ${activeTab === 'cancelled' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-md">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchBooking}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-500 mt-4 text-lg">No bookings found in this category.</p>
          {activeTab !== 'all' && (
            <button
              onClick={() => setActiveTab('all')}
              className="mt-4 px-5 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors font-medium"
            >
              View All Bookings
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] duration-300 border border-gray-100"
            >
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex justify-between items-center">
                <h3 className="font-medium text-lg text-gray-800">Booking #{booking._id.slice(-6)}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.isChecking)}`}>
                  {booking.isChecking}
                </span>
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
