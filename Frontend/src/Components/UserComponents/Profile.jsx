import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import BASE_URL from "../../Utils/api";
import { useSelector } from 'react-redux';


function Settings({ user }) {
  const { theme } = useSelector((state) => state.theme);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    password: '',
    img: null,

  });

  console.log(user);


  const decoded = jwtDecode(localStorage.getItem('token'))

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Make sure we're only processing image files
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      // Store the base64 string in state
      setFormData({ ...formData, img: event.target.result });
      console.log('Image loaded successfully');
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Error processing image');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      email: decoded.email
    };

    if (formData.firstname) {
      updateData.firstname = formData.firstname;
    }

    if (formData.lastname) {
      updateData.lastname = formData.lastname;
    }

    if (formData.password && formData.password.trim() !== '') {
      updateData.newPassword = formData.password;
    }

    if (formData.img) {
      updateData.img = formData.img;
    }

    try {
      if (Object.keys(updateData).length > 1) {
        await axios.patch(`${BASE_URL}/user/resetPassword`, updateData);
        alert('Profile updated successfully!');
        setFormData({ ...formData, password: "" });
        console.log("Updated User Data:", formData);
      } else {
        alert('No changes to update');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to update profile: ${errorMessage}`);
    }

  }


  return (
    <div className={`max-w-2xl mx-auto p-6 rounded-3xl shadow-sm my-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h2 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Account Settings</h2>

      <form
        onSubmit={handleSubmit}
        className={`shadow-lg rounded-2xl p-8 space-y-6 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}
      >
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-3 group">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-blue-500">
              {user ? (
                <img src={user[0].img} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <span className="text-4xl text-gray-400">{decoded.email.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 transition-all shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Click to change profile picture</span>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstname" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-gray-100'
                : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              placeholder="John"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastname" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-gray-100'
                : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Email - Read Only */}
        <div className="space-y-2">
          <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={decoded.email}
            disabled
            className={`mt-1 p-2 block w-full rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed ${theme === 'dark'
              ? 'border-gray-700 text-gray-400'
              : 'border-gray-300 text-gray-500'
              }`}
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            New Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-gray-100'
              : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            placeholder="••••••••"
          />
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Leave blank to keep current password</p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings