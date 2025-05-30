import React, { useEffect, useState } from 'react';
import Location from '../Components/DashComponents/location';
import Room from '../Components/DashComponents/Room'
import State from '../Components/DashComponents/State'
import Hotel from './../Components/DashComponents/Hotel';
import BookingPanel from '../Components/DashComponents/BookingPanel';
import CouponPanel from '../Components/DashComponents/CouponPanel'
import UserPage from './UserPage';
import { FaHotel, FaBed, FaCalendarCheck, FaUsers, FaUserTie, FaBroom, FaChartBar, FaCog, FaSignOutAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../Components/DashComponents/AdminDashboard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('bookingPanel');
  const navigate = useNavigate()


  // Simple placeholder component that shows when a sidebar option is clicked
  const ComponentPlaceholder = ({ title }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title} Content</h2>
      <p className="text-gray-600">This is where the {title.toLowerCase()} content will be displayed.</p>
      <p className="text-gray-600 mt-2">Each option will load its own unique component from the Components folder.</p>
    </div>
  );

  const getContent = () => {
    if (activeTab === 'location') {
      return <Location />;
    }
    else if (activeTab === 'state') {
      return <State />
    }
    else if (activeTab === 'addHotel') {
      return <Hotel />
    }
    else if (activeTab === 'addRooms') {
      return <Room />
    }
    else if (activeTab === 'bookingPanel') {
      return <BookingPanel />
    }
    else if (activeTab === 'couponPanel') {
      return <CouponPanel />
    }
    else if (activeTab === 'ViewUI') {
      return <UserPage />
    }
    else if (activeTab === 'dashboard')
      return <AdminDashboard />

    return <ComponentPlaceholder title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />;
  };

  const logOut = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">HMS Admin</h1>
          <p className="text-sm text-gray-400">Hotel Management System</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaHotel className="mr-3" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('bookingPanel')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'bookingPanel' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaHotel className="mr-3" />
                <span>Booking Panel</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('state')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'state' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaMapMarkerAlt className="mr-3" />
                <span>State</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('location')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'location' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaMapMarkerAlt className="mr-3" />
                <span>Location</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('addHotel')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'addHotel' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaMapMarkerAlt className="mr-3" />
                <span>Add Hotel</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('addRooms')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'addRooms' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaBed className="mr-3" />
                <span>Rooms & Suites</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('couponPanel')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'couponPanel' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaUsers className="mr-3" />
                <span>Generate Coupon</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('ViewUI')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'bookings' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaCalendarCheck className="mr-3" />
                <span>View User Interface</span>
              </button>
            </li>
            {/* <li>
              <button
                onClick={() => setActiveTab('staff')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'staff' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaUserTie className="mr-3" />
                <span>Staff</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('housekeeping')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'housekeeping' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaBroom className="mr-3" />
                <span>Housekeeping</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'reports' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaChartBar className="mr-3" />
                <span>Reports</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center w-full py-2 px-4 rounded-lg text-left ${activeTab === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <FaCog className="mr-3" />
                <span>Settings</span>
              </button>
            </li> */}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button onClick={logOut} className="flex items-center w-full py-2 px-4 rounded-lg hover:bg-gray-700 text-left">
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {<div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-sm text-gray-500">Welcome back, Devesh</p>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 bg-white rounded-lg shadow-sm relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </div>

        {/* Display content for the selected tab */}
        {getContent()}
      </div>}
    </div>
  );
};

export default Dashboard;