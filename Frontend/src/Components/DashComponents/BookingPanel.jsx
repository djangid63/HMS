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
    console.log("Booking data with aggregate", response.data.data);
    // console.log("Booking data with Populate", response.data.newData);
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
    const base = "px-3 py-1 rounded-full text-sm font-semibold tracking-wide";
    if (status === "Approved") return `${base} bg-green-100 text-green-800 border border-green-200`;
    if (status === "Rejected" || status == "Cancel") return `${base} bg-red-100 text-red-800 border border-red-200`;
    return `${base} bg-amber-100 text-amber-800 border border-amber-200`;
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
    else if (activeTab === 'isChecking approved') {
      return b.isChecking === 'Confirm';
    }
    else if (activeTab === 'isChecking rejected') {
      return b.isChecking === 'Cancel';
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Admin Booking Panel
          </h1>
          <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">Manage all hotel booking requests</p>
        </div>

        {/* Tabs -  */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 px-2">
          <button
            className={`px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 ${activeTab === "pending"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Requests
          </button>
          <button
            className={`px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 ${activeTab === "approved"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab("approved")}
          >
            Approved Requests
          </button>
          <button
            className={`px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 ${activeTab === "rejected"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected Requests
          </button>

          {/* User check-in options - */}
          <div className="w-full mt-3 mb-1 flex justify-center">
            <div className="h-px w-32 bg-gray-300"></div>
          </div>
          <button
            className={`px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 ${activeTab === "isChecking pending"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab("isChecking pending")}
          >
            Check-In Pending
          </button>
          <button
            className={`px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 ${activeTab === "isChecking approved"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab("isChecking approved")}
          >
            Checked-In
          </button>
          <button
            className={`px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 ${activeTab === "isChecking rejected"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab("isChecking rejected")}
          >
            Check-In Rejected
          </button>
        </div>

        {/* Booking Cards - */}
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="border-l-4 border-blue-500 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">{booking.userName}</h2>
                          <p className="text-gray-500 text-sm">ID: #{booking._id.substring(0, 8)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                          <p className="font-medium">{booking.userPhone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Guests</p>
                          <p className="font-medium">{booking.numberOfGuests}</p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                          {activeTab === 'pending' || activeTab === 'approved' || activeTab === 'rejected' ? (
                            <span className={getStatusBadge(booking.status)}>{booking.status}</span>
                          ) : (
                            <span className={getStatusBadge(booking.isChecking)}>{booking.isChecking}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
                      {booking.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking._id, "Approved")}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200 flex-1 md:flex-none flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking._id, "Rejected")}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 flex-1 md:flex-none flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 flex-1 md:flex-none flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-10 text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg text-gray-500">
                No {activeTab} bookings found.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Check back later or select another category
              </p>
            </div>
          )}
        </div>

        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedBooking(null)}>
            <div
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100 animate-scaleIn m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800">Guest Information</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">{selectedBooking.userName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{selectedBooking.userPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700">Booking Information</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-gray-500">Room ID</p>
                      <p className="font-medium">{selectedBooking.roomId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Guests</p>
                      <p className="font-medium">{selectedBooking.numberOfGuests}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="font-bold text-lg text-blue-700">₹{selectedBooking.totalAmount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">Stay Duration</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-gray-500">Check-in</p>
                      <p className="font-medium">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Check-out</p>
                      <p className="font-medium">{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  Close
                </button>

                {selectedBooking.status === "Pending" && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedBooking._id, "Approved");
                        setSelectedBooking(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedBooking._id, "Rejected");
                        setSelectedBooking(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookingPanel;
