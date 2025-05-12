import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import BASE_URL from "../../Utils/api";

function Settings() {
  const [formData, setFormData] = useState({
    password: "",
  });

  const decoded = jwtDecode(localStorage.getItem('token'))

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password.trim()) {
      alert("Please enter a new password");
      return;
    } try {
      await axios.patch(`${BASE_URL}/user/resetPassword`, { email: decoded.email, newPassword: formData.password });
      alert('Password updated successfully!');
      setFormData({ ...formData, password: "" });
      console.log("Updated User Data:", formData);
    } catch (error) {
      console.error('Error updating password:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to update password: ${errorMessage}`);
    }
    console.log("Updated User Data:", formData);

  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">User Settings</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 space-y-5 border"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="D J"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jangiddevesh031@gmail.com"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Leave blank to keep current"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Settings