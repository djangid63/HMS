import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Share, FileUp, Plus } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../../Utils/api';

const AdminDashboard = () => {
  const { theme } = useSelector(state => state.theme);
  const [loading, setLoading] = useState(true);

  // Dashboard data state
  const [dashboardStats, setDashboardStats] = useState({
    newBookings: 0,
    checkIns: 0,
    checkOuts: 0,
    roomsAvailable: 0,
    totalRevenue: 0
  });

  const [bookingByPlatform, setBookingByPlatform] = useState([
    { name: 'Direct Booking', percentage: 61, color: 'bg-blue-500' },
    { name: 'Booking.com', percentage: 12, color: 'bg-blue-300' },
    { name: 'Agoda', percentage: 11, color: 'bg-blue-400' },
    { name: 'Airbnb', percentage: 9, color: 'bg-blue-200' },
    { name: 'Hotels.com', percentage: 5, color: 'bg-blue-600' },
    { name: 'Others', percentage: 2, color: 'bg-blue-800' }
  ]);

  const [roomStatus, setRoomStatus] = useState({
    occupied: 0,
    reserved: 0,
    available: 0,
    notReady: 0
  });

  const [bookingList, setBookingList] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // API authentication configuration
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch bookings data
      const bookingsResponse = await axios.get(`${BASE_URL}/booking/getAll`, config);
      const bookings = bookingsResponse.data.data || [];

      // Fetch rooms data
      const roomsResponse = await axios.get(`${BASE_URL}/room/getAll`, config);
      const rooms = roomsResponse.data.data || [];
      

      // Calculate dashboard metrics
      const pendingBookings = bookings.filter(booking => booking.status === 'Pending').length;
      const checkedInBookings = bookings.filter(booking => booking.status === 'Approved').length;
      const cancelledOrCompleted = bookings.filter(booking =>
        booking.status === 'Rejected' || booking.status === 'Cancel' || booking.status === 'Completed'
      ).length;

      const availableRooms = rooms.filter(room => room.isAvailable && room.isActive).length;

      // Calculate total revenue (sum of all approved bookings)
      const totalRevenue = bookings
        .filter(booking => booking.status === 'Approved' || booking.status === 'Completed')
        .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

      // Update dashboard stats
      setDashboardStats({
        newBookings: pendingBookings + checkedInBookings + cancelledOrCompleted,
        checkIns: checkedInBookings,
        checkOuts: cancelledOrCompleted,
        roomsAvailable: availableRooms,
        totalRevenue: totalRevenue
      });

      // Update room status
      setRoomStatus({
        occupied: checkedInBookings,
        reserved: pendingBookings,
        available: availableRooms,
        notReady: rooms.filter(room => !room.isAvailable || !room.isActive).length
      });

      // Update recent bookings list (only the latest 4)
      const latestBookings = bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
        .map(booking => {
          const checkInDate = new Date(booking.checkInDate);
          const checkOutDate = new Date(booking.checkOutDate);
          const diffTime = Math.abs(checkOutDate - checkInDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {
            id: booking._id.substring(0, 8),
            guest: booking.userBooking && booking.userBooking[0] ? booking.userBooking[0].name : 'Guest',
            roomType: booking.roomType || 'Standard Room',
            duration: `${diffDays} nights`,
            checkIn: new Date(booking.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            checkOut: new Date(booking.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: booking.status === 'Approved' ? 'checked-in' : booking.status.toLowerCase(),
            priority: booking.roomType?.toLowerCase().includes('deluxe') ? 'deluxe' :
              booking.roomType?.toLowerCase().includes('suite') ? 'suite' : 'standard'
          };
        });

      setBookingList(latestBookings);

      // Create recent activities based on the latest bookings and room changes
      const activities = latestBookings.map((booking, index) => {
        const time = new Date(Date.now() - index * 30 * 60000).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        });

        let type = 'guest-issue';
        let title = `${booking.guest} ${booking.status === 'checked-in' ? 'checked in' : 'booked'} a room.`;

        if (index === 1) {
          type = 'room-cleaned';
          title = `Room ${booking.roomType} cleaned and prepped for new guests.`;
        } else if (index === 2) {
          type = 'room-setup';
          title = `${booking.roomType} set up for arrival on ${booking.checkIn}.`;
        }

        return { time, type, title };
      });

      setRecentActivities(activities);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hey Admin,</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Great service leaves a lasting impression.</p>
        </div>
        <div className="flex gap-2">
          <button className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}`}>
            <Share size={18} /> Share
          </button>
          <button className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}`}>
            <FileUp size={18} /> Export
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600">
            <Plus size={18} /> Custom Widgets
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* New Bookings */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">New Bookings</p>
              <h2 className="text-3xl font-bold mt-1">{loading ? '...' : dashboardStats.newBookings}</h2>
              <div className="flex items-center mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">+8.1% from last week</span>
              </div>
            </div>
            <div className="p-2 rounded-md bg-blue-100">
              <span className="text-blue-600">📅</span>
            </div>
          </div>
        </div>

        {/* Check-In */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check-In</p>
              <h2 className="text-3xl font-bold mt-1">{loading ? '...' : dashboardStats.checkIns}</h2>
              <div className="flex items-center mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">+3.6% from last week</span>
              </div>
            </div>
            <div className="p-2 rounded-md bg-green-100">
              <span className="text-green-600">🛎️</span>
            </div>
          </div>
        </div>

        {/* Check-Out */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check-Out</p>
              <h2 className="text-3xl font-bold mt-1">{loading ? '...' : dashboardStats.checkOuts}</h2>
              <div className="flex items-center mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">-1.06% from last week</span>
              </div>
            </div>
            <div className="p-2 rounded-md bg-green-100">
              <span className="text-green-600">🚪</span>
            </div>
          </div>
        </div>

        {/* Room Available */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Room Available</p>
              <h2 className="text-3xl font-bold mt-1">{loading ? '...' : dashboardStats.roomsAvailable}</h2>
              <div className="flex items-center mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">-2.97% from last week</span>
              </div>
            </div>
            <div className="p-2 rounded-md bg-green-100">
              <span className="text-green-600">🏠</span>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow col-span-1 md:col-span-2 lg:col-span-4`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <h2 className="text-3xl font-bold mt-1">${loading ? '...' : dashboardStats.totalRevenue.toLocaleString()}</h2>
              <div className="flex items-center mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">+5.70% from last week</span>
              </div>
            </div>
            <div className="p-2 rounded-md bg-green-100">
              <span className="text-green-600">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Charts, Room Status, Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Booking by Platform */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Booking by Platform</h3>
            <button className="text-gray-500">
              •••
            </button>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-36 h-36">
              {/* This is a simplified donut chart - in a real app, you'd use a chart library */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  {bookingByPlatform.map((platform, index) => {
                    // Simple calculation to create donut chart segments
                    const offset = bookingByPlatform
                      .slice(0, index)
                      .reduce((acc, curr) => acc + curr.percentage, 0);
                    return (
                      <circle
                        key={platform.name}
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke={platform.color.replace('bg-', 'fill-').replace('-500', '-500')}
                        strokeWidth="4"
                        strokeDasharray={`${platform.percentage} ${100 - platform.percentage}`}
                        strokeDashoffset={`${25 - offset}`}
                        transform="rotate(-90 18 18)"
                        className={platform.color}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {bookingByPlatform.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                  <span className="text-sm">{platform.name}</span>
                </div>
                <span className="text-sm font-medium">{platform.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Availability */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Room Availability</h3>
            <button className="text-gray-500">
              •••
            </button>
          </div>

          <div className="w-full h-20 bg-blue-100 rounded-md mb-4 flex items-center justify-center">
            <div className="w-full h-6 flex">
              <div className="bg-blue-700 h-full" style={{ width: "100%" }}></div>
              <div className="bg-blue-300 h-full" style={{ width: "15%" }}></div>
              <div className="bg-blue-100 h-full" style={{ width: "20%" }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Occupied</p>
              <p className="text-2xl font-bold">{loading ? '...' : roomStatus.occupied}</p>
            </div>
            <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Reserved</p>
              <p className="text-2xl font-bold">{loading ? '...' : roomStatus.reserved}</p>
            </div>
            <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold">{loading ? '...' : roomStatus.available}</p>
            </div>
            <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Not Ready</p>
              <p className="text-2xl font-bold">{loading ? '...' : roomStatus.notReady}</p>
            </div>
          </div>
        </div>

        {/* Booking Analytics - Replacing the Tasks section */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Booking Analytics</h3>
            <button className="text-gray-500">
              •••
            </button>
          </div>
          {/* 
          <div className="space-y-3">
            <div className="p-3 rounded-md bg-blue-50 text-blue-700">
              <div className="flex justify-between items-start">
                <p className="text-xs">Today</p>
                <span className="text-xs font-medium">Performance</span>
              </div>
              <p className="text-sm mt-1 font-medium">Occupancy Rate: {loading ? '...' : `${Math.round((roomStatus.occupied / (roomStatus.occupied + roomStatus.available + roomStatus.notReady)) * 100)}%`}</p>
              <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${loading ? '0' : Math.round((roomStatus.occupied / (roomStatus.occupied + roomStatus.available + roomStatus.notReady)) * 100)}%` }}></div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-green-50 text-green-700">
              <div className="flex justify-between items-start">
                <p className="text-xs">This Month</p>
                <span className="text-xs font-medium">Revenue Target</span>
              </div>
              <p className="text-sm mt-1 font-medium">Target Progress: {loading ? '...' : '65%'}</p>
              <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-amber-50 text-amber-700">
              <div className="flex justify-between items-start">
                <p className="text-xs">This Week</p>
                <span className="text-xs font-medium">Check-ins</span>
              </div>
              <p className="text-sm mt-1 font-medium">Expected: {loading ? '...' : dashboardStats.checkIns + Math.round(dashboardStats.checkIns * 0.2)} check-ins</p>
              <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
                <div className="bg-amber-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-purple-50 text-purple-700">
              <div className="flex justify-between items-start">
                <p className="text-xs">Forecast</p>
                <span className="text-xs font-medium">Next Week</span>
              </div>
              <p className="text-sm mt-1 font-medium">Projected Revenue: ${loading ? '...' : Math.round(dashboardStats.totalRevenue * 0.15).toLocaleString()}</p>
              <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Booking List */}
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow mb-6`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Booking List</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search guest, status, etc"
              className={`px-3 py-1 text-sm rounded-md ${theme === 'dark' ? 'bg-gray-600 text-white border-gray-700' : 'bg-gray-50 border border-gray-200'}`}
            />
            <button className={`px-3 py-1 text-sm rounded-md ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
              All Status ▼
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-3 px-2">Booking ID ↓</th>
                <th className="pb-3 px-2">Guest Name ↓</th>
                <th className="pb-3 px-2">Room Type ↓</th>
                <th className="pb-3 px-2">Room Number ↓</th>
                <th className="pb-3 px-2">Duration ↓</th>
                <th className="pb-3 px-2">Check-in & Check-Out ↓</th>
                <th className="pb-3 px-2">Status ↓</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">Loading booking data...</td>
                </tr>
              ) : bookingList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">No bookings found</td>
                </tr>
              ) : (
                bookingList.map((booking) => (
                  <tr
                    key={booking.id}
                    className={`border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-100'} text-sm`}
                  >
                    <td className="py-3 px-2 flex items-center gap-1">
                      <span className="font-medium">{booking.id}</span>
                      {booking.priority === 'deluxe' && <span className="w-2 h-2 rounded-full bg-yellow-400"></span>}
                      {booking.priority === 'suite' && <span className="w-2 h-2 rounded-full bg-purple-500"></span>}
                    </td>
                    <td className="py-3 px-2">{booking.guest}</td>
                    <td className="py-3 px-2">{booking.roomType.split(' ')[0]}</td>
                    <td className="py-3 px-2">{booking.roomType.split(' ')[1] || 'N/A'}</td>
                    <td className="py-3 px-2">{booking.duration}</td>
                    <td className="py-3 px-2">
                      {booking.checkIn} - {booking.checkOut}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-md ${booking.status === 'checked-in' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {booking.status === 'checked-in' ? 'Checked-in' :
                          booking.status === 'pending' ? 'Pending' : booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activities */}
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Recent Activities <span className="text-xs text-gray-500">(1,242)</span></h3>
          <div>
            <button className={`px-3 py-1 text-sm rounded-md ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
              Popular ▼
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading activities...</div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No recent activities</div>
          ) : (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'room-ready' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'room-setup' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'room-cleaned' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'maintenance' ? 'bg-purple-100 text-purple-600' :
                        'bg-blue-100 text-blue-600'
                  }`}>
                  {activity.type.includes('room') ? 'R' : 'M'}
                </div>
                <div>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  <p className="text-sm">{activity.title}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
