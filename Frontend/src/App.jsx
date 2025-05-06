import React from 'react'
import Login from './Components/AuthComponents/Login'
import Signup from './Components/AuthComponents/Signup'
import OtpValidation from './Components/AuthComponents/OtpValidation'
import ForgetPassword from './Components/AuthComponents/PasswordReset'
import Dashboard from './Pages/DashboardPage'
import UserPage from './Pages/UserPage'
import RoomListing from './Components/UserComponents/RoomListing'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RoomBooking from './Pages/BookingPage'
import RoomDetails from './Components/UserComponents/RoomDetails'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/otp' element={<OtpValidation />} />
        <Route path='forgetPassword' element={<ForgetPassword />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='user' element={<UserPage />} />
        <Route path='/roomlist/:hotelId' element={<RoomListing />} />
        <Route path='/roomBooking/:roomId' element={<RoomBooking />} />
        <Route path='/RoomDetails' element={<RoomDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
