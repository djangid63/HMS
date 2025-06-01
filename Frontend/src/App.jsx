import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Login from './Components/AuthComponents/Login'
import Signup from './Components/AuthComponents/Signup'
import OtpValidation from './Components/AuthComponents/OtpValidation'
import ForgetPassword from './Components/AuthComponents/PasswordReset'
import Dashboard from './Pages/DashboardPage'
import UserPage from './Pages/UserPage'
import BookingPanel from './Components/DashComponents/BookingPanel'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RevenuePanel from './Components/DashComponents/RevenuPanel'

const App = () => {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/otp' element={<OtpValidation />} />
          <Route path='/forgetPassword' element={<ForgetPassword />} />
          <Route path='/dashboard/*' element={<Dashboard />} />
          <Route path='/userPage/*' element={<UserPage />} />
          <Route path='/dashboard/bookingPanel' element={<BookingPanel />} />
          <Route path='/dashboard/revenuePanel' element={<RevenuePanel />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
