import axios from 'axios'
import React, { useState } from 'react'
import BASE_URL from '../../Utils/api'

const PasswordReset = () => {
  // State management for form
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Only sending email in the request
      const response = await axios.post(`${BASE_URL}/user/forgetPassword`, { email })
      alert(response.data.message)
      console.log('Sending OTP to:', email)

      // Simulate API call
      setTimeout(() => {
        setOtpSent(true)
        setSuccess('OTP sent to your email')
        setIsLoading(false)
      }, 1500)
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
      setIsLoading(false)
    }
  }

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {

      const response = await axios.post(`${BASE_URL}/user/resetOtp`, { email, otp, newPassword })

      console.log('Resetting password with OTP:', otp)

      // Simulate API call
      setTimeout(() => {
        setSuccess('Password reset successful!')
        setIsLoading(false)
      }, 1500)
    } catch (err) {
      setError('Password reset failed. Please check your OTP and try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Reset Your Password</h2>

        {error && <div className="p-3 mb-4 text-sm bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        {success && <div className="p-3 mb-4 text-sm bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}

        {!otpSent ? (
          // Step 1: Email form to request OTP
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          // Step 2: OTP and new password form
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remember your password? <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Login</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PasswordReset
