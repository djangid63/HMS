import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../../Utils/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
          <p className="font-medium">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white shadow-md rounded-2xl p-6 mb-6 border"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-semibold">Name:</span> {booking.userName}</p>
                <p><span className="font-semibold">Check-In:</span> {booking.checkInDate}</p>
                <p><span className="font-semibold">Check-Out:</span> {booking.checkOutDate}</p>
              </div>
              <div>
                <p><span className="font-semibold">Amount:</span> ₹{booking.totalAmount}</p>
                <p><span className="font-semibold">Status:</span> {booking.isChecking}</p>
                <div className="mt-4 space-x-3">
                  {booking.status == 'Approved' && (
                    <button
                      className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                      onClick={() => handleAction(booking._id, "Confirm")}
                      disabled={booking.isChecking !== "Pending"}
                    >
                      Check In
                    </button>
                  )
                  }
                  <button
                    className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    onClick={() => handleAction(booking._id, "Cancel")}
                    disabled={booking.isChecking !== "Pending"}
                  >
                    Cancel Booking
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}


export default MyBookings