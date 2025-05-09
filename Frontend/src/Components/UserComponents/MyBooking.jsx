import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../../Utils/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem('token')
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  useEffect(() => {
    const fetchBooking = async () => {
      const response = await axios.get(`${BASE_URL}/booking/getAll`, config)
      setBookings(response.data.data)
    }
    fetchBooking()
  }, [])

  const handleAction = async (id, action) => {

    setBookings((prev) =>
      prev.map((b) =>
        b._id === id
          ? { ...b, isChecking: action === "checkin" ? "Confirm" : "Cancel" }
          : b
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
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
                  <button
                    className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    onClick={() => handleAction(booking._id, "checkin")}
                    disabled={booking.isChecking !== "Pending"}
                  >
                    Check In
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    onClick={() => handleAction(booking._id, "cancel")}
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