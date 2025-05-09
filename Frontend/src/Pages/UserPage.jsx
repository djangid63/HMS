import React, { useState } from 'react'
import { Link, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import HotelListing from '../Components/UserComponents/HotelListing'
import RoomListing from '../Components/UserComponents/RoomListing'
import RoomDetails from '../Components/UserComponents/RoomDetails'
import MyBookings from '../Components/UserComponents/MyBooking'


const UserPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand name */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-800">Hotel Vista</span>
              </div>

              {/* Desktop Navigation Menu */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Link to="/userPage" className="px-3 py-2 text-sm font-medium text-indigo-600 border-b-2 border-indigo-500">Home</Link>
                <Link to="/userPage/bookings" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-500 transition-colors">My Bookings</Link>
                <Link to="/userPage/services" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-500 transition-colors">Services</Link>
                <Link to="/userPage/contact" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-500 transition-colors">Contact</Link>
              </div>
            </div>

            {/* User profile and action buttons */}
            <div className="hidden sm:flex sm:items-center space-x-4">
              <div className="ml-3 relative flex items-center">
                <img className="h-8 w-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile" />
                <span className="ml-2 text-gray-700 font-medium">John Doe</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              <Link to="/userPage" className="block pl-3 pr-4 py-2 text-base font-medium text-indigo-600 border-l-4 border-indigo-500">Home</Link>
              <Link to="/userPage/bookings" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-50 hover:border-l-4 hover:border-indigo-500">My Bookings</Link>
              <Link to="/userPage/services" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-50 hover:border-l-4 hover:border-indigo-500">Services</Link>
              <Link to="/userPage/contact" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-50 hover:border-l-4 hover:border-indigo-500">Contact</Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">John Doe</div>
                  <div className="text-sm font-medium text-gray-500">john@example.com</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-50">Your Profile</button>
                <button className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-50">Settings</button>
                <button className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-50">Sign out</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page content with nested routes */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/userPage/hotels" replace />} />
          <Route path="/hotels" element={<HotelListing />} />
          <Route path="/rooms/:hotelId" element={<RoomListing />} />
          <Route path="/room-details/:roomId" element={<RoomDetails />} />
          <Route path="/bookings" element={
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white rounded-lg shadow p-6">
                {<MyBookings />}
              </div>
            </div>
          } />
          <Route path="/services" element={
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Our Services</h1>
                <p className="text-gray-600">Explore our premium hotel services.</p>
              </div>
            </div>
          } />
          <Route path="/contact" element={
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-gray-600">Get in touch with our customer support team.</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default UserPage
