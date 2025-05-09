import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../Utils/api";

const BookingPanel = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchBooking = async () => {
    const response = await axios.get(`${BASE_URL}/booking/getAll`, config);
    setBookings(response.data.data);
  };
  useEffect(() => {
    fetchBooking();
  }, []);

  const handleStatusChange = async (id, newStatus) => {

    try {
      await axios.patch(
        `${BASE_URL}/booking/update/${id}`,
        { status: newStatus },
        config
      );
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }

    fetchBooking()
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-medium";
    if (status === "Approved") return `${base} bg-green-100 text-green-700`;
    if (status === "Rejected") return `${base} bg-red-100 text-red-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  };

  const filteredBookings = bookings.filter((b) => {

    if (activeTab === 'pending') {
      return b.status === 'Pending';
    }
    else if (activeTab === 'approved') {
      return b.status === 'Approved';
    }
    else if (activeTab === 'rejected') {
      return b.status === 'Rejected';
    }
    else if (activeTab === 'isChecking pending') {
      return b.isChecking === 'Pending' && b.status !== 'Rejected';
    }
    else if (activeTab === 'isChecking rejected') {
      return b.isChecking === 'Confirm';
    }
    else if (activeTab === 'isChecking rejected') {
      return b.isChecking === 'Cancel';
    }

  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Booking Panel</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "pending"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300"
              } transition`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "approved"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300"
              } transition`}
            onClick={() => setActiveTab("approved")}
          >
            Approved Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "rejected"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300"
              } transition`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected Requests
          </button>

          {/* User options */}

          <button
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "isChecking pending"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300"
              } transition`}
            onClick={() => setActiveTab("isChecking pending")}
          >
            Check In Pending
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "isChecking approved"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300"
              } transition`}
            onClick={() => setActiveTab("isChecking approved")}
          >
            Check In
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "isChecking rejected"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300"
              } transition`}
            onClick={() => setActiveTab("isChecking rejected")}
          >
            Check In rejected
          </button>
        </div>

        {/* Booking Cards */}
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{booking.userName}</h2>
                  <p className="text-gray-500 text-sm">Phone: {booking.userPhone}</p>
                  <p className="text-gray-500 text-sm">Guests: {booking.numberOfGuests}</p>
                  <span className={getStatusBadge(booking.status)}>{booking.status}</span>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                  {booking.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(booking._id, "Approved")}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking._id, "Rejected")}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    View More
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No {activeTab} bookings found.
            </p>
          )}
        </div>

        {/* Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <p><strong>Email:</strong> {selectedBooking.userName}</p>
              <p><strong>Phone:</strong> {selectedBooking.userPhone}</p>
              <p><strong>Guests:</strong> {selectedBooking.numberOfGuests}</p>
              <p><strong>Room ID:</strong> {selectedBooking.roomId}</p>
              <p><strong>Total Amount:</strong> ₹{selectedBooking.totalAmount}</p>
              <p><strong>Check-in:</strong> {new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPanel;
