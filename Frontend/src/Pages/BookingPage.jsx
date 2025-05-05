import React, { useState, useEffect } from 'react'
import SearchNavBar from '../Components/UserComponents/BookNavbar'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../Utils/api'

const RoomBooking = () => {
  const { roomId } = useParams()
  const [rooms, setRooms] = useState([])
  const [location, setLocation] = useState('')
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomList = await axios.get(`${BASE_URL}/room/getAll`);
        const filterRoom = roomList.data.data.filter((room) => room._id == roomId)
        setRooms(filterRoom)
        console.log(filterRoom);
        setLocation(filterRoom.map((room) => room.hotelId.name))
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);

  const [formData, setFormData] = useState({
    userId: '',
    hotelId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: '',
    totalAmount: '',
    userName: '',
    userPhone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };
  return (
    <div className="bg-gray-50 min-h-screen w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500">
      {/* SearchNavBar component */}
      {/* <div>
        <SearchNavBar roomId={roomId} />
      </div> */}

      {/* Booking form container */}
      <div className="px-4 py-4 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-10 transform transition-all hover:shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent">
            Book Your Stay
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="userName" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Full Name</label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="hotelName" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Hotel</label>
                <input
                  type="text"
                  id="hotelName"
                  name="hotelName"
                  value={location}
                  readOnly
                  className="w-full rounded-lg px-4 py-3 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200 bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Room Type</label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  readOnly
                  className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="numberOfGuests" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Number of Guests</label>
                <input
                  type="number"
                  id="numberOfGuests"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  min="1"
                  className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="checkInDate" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Check-in Date</label>
                <input
                  type="date"
                  id="checkInDate"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="checkOutDate" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Check-out Date</label>
                <input
                  type="date"
                  id="checkOutDate"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleChange}
                  className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="userPhone" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Phone Number</label>
              <input
                type="tel"
                id="userPhone"
                name="userPhone"
                value={formData.userPhone}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                <label htmlFor="totalAmount" className="block text-sm text-gray-700 mb-2 font-medium tracking-wide">Total Amount ($)</label>
                <input
                  type="number"
                  id="totalAmount"
                  name="totalAmount"
                  value={formData.totalAmount}
                  min="0"
                  step="0.01"
                  readOnly
                  className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
                  required
                />
              </div>

            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transform transition-all hover:scale-105 shadow-md"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RoomBooking
