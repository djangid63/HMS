import React from 'react'
import Login from './Components/login'
import Signup from './Components/signup'
import OtpValidation from './Components/OtpValidation'
import ForgetPassword from './Components/PasswordReset'
import Dashboard from './Pages/Dashboard'
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
