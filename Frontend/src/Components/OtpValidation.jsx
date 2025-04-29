import axios from 'axios/unsafe/axios.js';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BASE_URL from '../api';

const OtpValidation = () => {
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from state, URL parameters, or localStorage
  const email = location.state?.email;

  useEffect(() => {
    // Ensure we have an email to work with
    if (!email) {
      setError('Email not found. Please go back to login.');
    }
  }, [email]);

  // Handle OTP input - simplified version
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow single digit
    if (/^\d{0,1}$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus to next input if current input has a value
      if (value && index < 3 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle verify button click
  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    if (!email) {
      setError('Email not found. Please go back to login.');
      return;
    }

    setLoading(true);
    setError('');


    try {
      const response = await axios.post(`${BASE_URL}/user/otp`, {
        email: email,
        otp: parseInt(enteredOtp)
      });

      if (response.data.success) {
        setLoading(false);
        navigate('/login')
    
      } else {
        setError(response.data.message || 'Verification failed');
        setLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!email) {
      setError('Email not found. Please go back to login.');
      return;
    }

    setOtp(new Array(4).fill(''));
    setIsResendDisabled(true);
    setError('');

    try {
      // Here you would call your API to resend the OTP
      // For example:
      // await axios.post('http://localhost:5000/user/resend-otp', { email });

      alert('New OTP sent to your email');

      // Start timer for resend button if you want to implement it
      // const timerInterval = setInterval(() => {
      //   setTimer((prev) => {
      //     if (prev <= 1) {
      //       clearInterval(timerInterval);
      //       setIsResendDisabled(false);
      //       return 0;
      //     }
      //     return prev - 1;
      //   });
      // }, 1000);

    } catch (error) {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verify Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to {email || "your email"}. Please enter the code below.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex space-x-4 justify-center">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(e, index)}
                  maxLength={1}
                  className="w-16 h-16 text-center text-2xl font-bold border-2 rounded-lg focus:border-blue-500 focus:ring focus:outline-none"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleVerify}
                disabled={loading}
                className="flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none w-32"
              >
                {loading ? (
                  <span className="animate-pulse">Verifying...</span>
                ) : (
                  "Verify"
                )}
              </button>

              <button
                onClick={handleResendOtp}
                disabled={isResendDisabled}
                className={`px-6 py-3 border text-base font-medium rounded-md w-32 ${isResendDisabled
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
              >
                Resend
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpValidation;
