import React from 'react'
import Login from './Components/AuthComponents/Login'
import Signup from './Components/AuthComponents/Signup'
import OtpValidation from './Components/AuthComponents/OtpValidation'
import ForgetPassword from './Components/AuthComponents/PasswordReset'
import Dashboard from './Pages/DashboardPage'
import UserPage from './Pages/UserPage'
import RoomListing from './Components/UserComponents/RoomListing'
import RoomDetails from './Components/UserComponents/RoomDetails'
import HotelListingPage from './Components/UserComponents/HotelListing'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/otp' element={<OtpValidation />} />
        <Route path='forgetPassword' element={<ForgetPassword />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='/userPage' element={<UserPage />} />
        
        <Route path='/hotelList' element={<HotelListingPage />} />
        <Route path='/roomlist/:hotelId' element={<RoomListing />} />
        <Route path='/roomDetails/:roomId' element={<RoomDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
