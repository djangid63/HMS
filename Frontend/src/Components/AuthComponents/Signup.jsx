import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../Utils/api';


const SignUp = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    age: '',
  });

  const navigate = useNavigate()

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      // API call would go here
      const response = await axios.post(`${BASE_URL}/user/signup`, formData)
      if (response.data.success) {
        alert('Otp Successfully send to your email')
        navigate('/otp', { state: { email: formData.email } });

      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-white to-blue-50 p-4 relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-100 opacity-50"></div>
          <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-indigo-100 opacity-40"></div>
        </div>

        <div className="w-full max-w-md z-10 backdrop-blur-sm bg-white/50 p-5 rounded-xl shadow-lg border border-white/60">
          {/* Logo */}
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg shadow-sm mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">OASIS</h1>
              <span className="text-xs text-gray-500 font-medium">HOTEL & BAR</span>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-1 text-gray-800">Create an Account</h2>
          <p className="text-sm text-gray-500 mb-4">Join us and start booking today</p>

          {error && (
            <div className="mb-3 text-xs bg-red-50 border-l-2 border-red-500 p-2 rounded text-red-600">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className="w-full px-3 py-2 bg-white bg-opacity-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition-all"
                />
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-3 py-2 bg-white bg-opacity-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-9 pr-3 py-2 bg-white bg-opacity-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition-all"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white bg-opacity-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition-all"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm*</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-white bg-opacity-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* Gender and Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-white bg-opacity-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition-all appearance-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age*</label>
                <div className="relative">
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="18"
                    placeholder="25"
                    className="w-full pl-9 pr-3 py-2 bg-white bg-opacity-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition-all"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-300 mt-3 text-sm font-medium shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Sign Up'}
            </button>

            {/* Or divider */}
            <div className="flex items-center justify-center my-3">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-3 text-xs text-gray-400 font-medium">Or </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Social Login Options */}
            {/* <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center border border-gray-200 bg-white rounded-lg py-2 px-3 hover:bg-gray-50 hover:shadow-sm text-sm transition-all">
                <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google" className="h-4 w-4 mr-2" />
                <span className="text-gray-700 font-medium">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center border border-gray-200 bg-white rounded-lg py-2 px-3 hover:bg-gray-50 hover:shadow-sm text-sm transition-all">
                <img src="https://cdn.cdnlogo.com/logos/a/92/apple.svg" alt="Apple" className="h-4 w-4 mr-2" />
                <span className="text-gray-700 font-medium">Apple</span>
              </button>
            </div> */}
          </form>

          <div className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">Log In</Link>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <span>© Oasis {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* Right Side - Images and Text */}
      <div className="hidden md:flex flex-col md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-800 p-5 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-400 rounded-full opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-400 rounded-full opacity-20"></div>
        </div>

        <div className="grid grid-cols-2 gap-3 h-3/4 relative z-10">
          <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
              alt="Hotel entrance"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform">
            <img
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd"
              alt="Pool view"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform">
            <img
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461"
              alt="Hotel pool"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform">
            <img
              src="https://images.unsplash.com/photo-1566665797739-1674de7a421a"
              alt="Hotel building"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-4 text-white relative z-10">
          <h2 className="text-xl font-bold mb-2 text-center">Discover Your Dream Getaway</h2>
          <p className="text-sm text-blue-100 text-center">
            Experience luxury and comfort with our exclusive collection of hotels and resorts.
            From breathtaking views to unparalleled service, your perfect stay awaits.
          </p>
          <div className="flex justify-center mt-3">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map(dot => (
                <div
                  key={dot}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${dot === 2 ? 'bg-white scale-110' : 'bg-blue-200 bg-opacity-50'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;