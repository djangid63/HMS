import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Share, FileUp, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const { theme } = useSelector(state => state.theme); 0.0
// DUMmy data
  const dashboardData = {
    newBookings: 840,
    checkIns: 231,
    checkOuts: 124,
    roomsAvailable: 32,
    totalRevenue: 123980,
    bookingByPlatform: [
      { name: 'Direct Booking', percentage: 61, color: 'bg-blue-500' },
      { name: 'Booking.com', percentage: 12, color: 'bg-blue-300' },
      { name: 'Agoda', percentage: 11, color: 'bg-blue-400' },
      { name: 'Airbnb', percentage: 9, color: 'bg-blue-200' },
      { name: 'Hotels.com', percentage: 5, color: 'bg-blue-600' },
      { name: 'Others', percentage: 2, color: 'bg-blue-800' }
    ],
    roomStatus: {
      occupied: 286,
      reserved: 87,
      available: 32,
      notReady: 13
    },
    tasks: [
      { id: 1, date: 'June 19, 2023', status: 'completed', description: 'Prepare Conference Room B (10 AM)' },
      { id: 2, date: 'June 19, 2023', status: 'in-progress', description: 'Restock 3rd Floor Supplies (Housekeeping)' },
      { id: 3, date: 'June 20, 2023', status: 'pending', description: 'Inspect and Clean Pool Area (11 AM)' },
      { id: 4, date: 'June 20, 2023', status: 'pending', description: 'Check-In Assistance During Peak Hours (4 PM - 6 PM)' }
    ],
    bookingList: [
      { id: 'LG-800113', guest: 'John Smith', roomType: 'Room 101', duration: '3 nights', checkIn: 'Jun 19, 2023', checkOut: 'Jun 22, 2023', status: 'checked-in', priority: 'deluxe' },
      { id: 'LG-800114', guest: 'Alice Johnson', roomType: 'Room 207', duration: '2 nights', checkIn: 'Jun 19, 2023', checkOut: 'Jun 22, 2023', status: 'checked-in', priority: 'standard' },
      { id: 'LG-800115', guest: 'Mark Davis', roomType: 'Room 303', duration: '5 nights', checkIn: 'Jun 19, 2023', checkOut: 'Jun 22, 2023', status: 'pending', priority: 'suite' },
      { id: 'LG-800116', guest: 'Emma Watson', roomType: 'Room 105', duration: '4 nights', checkIn: 'Jun 19, 2023', checkOut: 'Jun 22, 2023', status: 'checked-in', priority: 'standard' }
    ],
    recentActivities: [
      { time: '12:00 PM', type: 'room-ready', title: 'Conference Room B Ready (10 AM)' },
      { time: '11:30 AM', type: 'room-setup', title: 'Room 8 set for 10 AM meeting, with AV and refreshments.' },
      { time: '11:00 AM', type: 'room-cleaned', title: 'Room 204 cleaned and prepped for new guests.' },
      { time: '10:30 AM', type: 'maintenance', title: 'Maintenance logged: Toilet issue in Room 109, technician assigned.' },
      { time: '10:00 AM', type: 'guest-issue', title: 'Argus Copper checked in a guest, room key issued.' }
    ]
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hey Prottoy,</h1>
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
              <h2 className="text-3xl font-bold mt-1">{dashboardData.newBookings}</h2>
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
              <h2 className="text-3xl font-bold mt-1">{dashboardData.checkIns}</h2>
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
              <h2 className="text-3xl font-bold mt-1">{dashboardData.checkOuts}</h2>
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
              <h2 className="text-3xl font-bold mt-1">{dashboardData.roomsAvailable}</h2>
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
              <h2 className="text-3xl font-bold mt-1">${dashboardData.totalRevenue.toLocaleString()}</h2>
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
                  {dashboardData.bookingByPlatform.map((platform, index) => {
                    // Simple calculation to create donut chart segments
                    const offset = dashboardData.bookingByPlatform
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
            {dashboardData.bookingByPlatform.map((platform) => (
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
            {/* This is a simplified capacity graph */}
            <div className="w-full h-6 flex">
              <div className="bg-blue-700 h-full" style={{ width: "70%" }}></div>
              <div className="bg-blue-300 h-full" style={{ width: "15%" }}></div>
              <div className="bg-blue-100 h-full" style={{ width: "15%" }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Occupied</p>
              <p className="text-2xl font-bold">{dashboardData.roomStatus.occupied}</p>
            </div>
            <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Reserved</p>
              <p className="text-2xl font-bold">{dashboardData.roomStatus.reserved}</p>
            </div>
            <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold">{dashboardData.roomStatus.available}</p>
            </div>
            <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Not Ready</p>
              <p className="text-2xl font-bold">{dashboardData.roomStatus.notReady}</p>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Tasks</h3>
            <button className="text-gray-100 bg-blue-500 rounded-md p-1">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {dashboardData.tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-md ${task.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-xs">{task.date}</p>
                  <span className="text-xs capitalize">{task.status === 'in-progress' ? 'In Progress' : task.status}</span>
                </div>
                <p className="text-sm mt-1">{task.description}</p>
                <div className="flex justify-end mt-2">
                  <button className="text-gray-500">•••</button>
                </div>
              </div>
            ))}
          </div>
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
              {dashboardData.bookingList.map((booking) => (
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
                  <td className="py-3 px-2">{booking.roomType.split(' ')[1]}</td>
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
              ))}
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
          {dashboardData.recentActivities.map((activity, index) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
