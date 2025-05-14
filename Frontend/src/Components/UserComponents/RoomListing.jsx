import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Star, Bed, Users, DollarSign, Calendar } from "lucide-react";
import axios from "axios";
import BASE_URL from "../../Utils/api";
import { useNavigate, useParams } from "react-router-dom";
import Room from './../DashComponents/Room';
import { useSelector } from 'react-redux';

function RoomListingPage() {
  const { theme } = useSelector((state) => state.theme);
  const { hotelId } = useParams()
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [hotels, setHotels] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const [sortOption, setSortOption] = useState("default");

  const navigate = useNavigate()

  const placeholderImage =
    "https://images.unsplash.com/photo-1611691823588-0955798e00ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, hotelsRes] = await Promise.all([
          axios.get(`${BASE_URL}/room/getAll`),
          axios.get(`${BASE_URL}/hotel/getAll`)
        ]);

        const hotelData = hotelsRes.data.data;
        setHotels(hotelData);

        const roomData = roomsRes.data.data.filter((room) => room.hotelId._id === hotelId);
        // console.log("roomdata", roomData);
        setRooms(roomData);
        setFilteredRooms(roomData);


        // Extract unique amenities
        const allAmenities = Array.from(
          new Set(roomData.flatMap(room => room.amenities || []))
        );
        setAmenities(allAmenities);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load room data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }; fetchData();
  }, []);

  const navigateToRoomBooking = (roomId) => {
    navigate(`/userPage/room-details/${roomId}`)
  }

  return (
    <div className={`rounded-2xl min-h-screen py-10 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-blue-50 to-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-5xl font-extrabold text-center mb-12 ${theme === 'dark' ? 'text-indigo-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'}`}>
          Find Your Perfect Room
        </h1>
        {/* Error Message */}
        {error && (
          <div className={`mb-8 p-4 rounded-r-lg ${theme === 'dark' ? 'bg-red-900 border-l-4 border-red-600 text-red-200' : 'bg-red-50 border-l-4 border-red-500 text-red-700'}`}>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <div
                key={room._id}
                className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.imageUrls[0] || placeholderImage}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-bold mb-1 transition-colors ${theme === 'dark' ? 'text-gray-200' : 'text-gray-200'} group-hover:text-indigo-600`}>
                      {room.type}
                    </h3>
                    <div className="flex items-center">
                      <div className="flex items-center bg-indigo-100 px-2 py-1 rounded text-xs font-bold text-indigo-800">
                        <Star className="w-3 h-3 mr-1 fill-current text-amber-500 stroke-amber-500" />
                        4.8
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-2 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p className="text-sm line-clamp-2">{room.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-blue-700'}`}>
                      <Bed className="w-3 h-3 mr-1" /> {room.roomType}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-green-50 text-green-700'}`}>
                      <Users className="w-3 h-3 mr-1" /> {room.capacity} guests
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-xl font-bold">{room.price}</span>
                      <span className="text-sm text-gray-500 ml-1">/ night</span>
                    </div>
                    {room.isAvailable ? (
                      <button
                        onClick={() => navigate(`/userPage/room-details/${room._id}`)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        View Details
                      </button>
                    ) : (
                      <button
                        className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        Booked
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : loading ? (
            <div className="col-span-3 flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className={`col-span-3 text-center py-16 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <p className="text-xl">No rooms found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomListingPage;