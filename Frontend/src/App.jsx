import React from 'react'
import Login from './Components/AuthComponents/Login'
import Signup from './Components/AuthComponents/Signup'
import OtpValidation from './Components/AuthComponents/OtpValidation'
import ForgetPassword from './Components/AuthComponents/PasswordReset'
import User from './Components/UserComponent/User'
import Dashboard from './Pages/DashboardPage'
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
        <Route path='user' element={<User />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
