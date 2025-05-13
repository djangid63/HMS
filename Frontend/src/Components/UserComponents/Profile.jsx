import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import BASE_URL from "../../Utils/api";


function Settings({ user }) {
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
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-3xl shadow-sm my-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Account Settings</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100"
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
              <input type="file" name="img" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
          <p className="text-sm text-gray-500">Click the icon to upload a new photo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Firstname
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Enter firstname"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Lastname
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Enter lastname"
            />
          </div>

        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || decoded.email}
            onChange={handleChange}
            className="w-full text-gray-400 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
            placeholder="Enter email"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            New Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings