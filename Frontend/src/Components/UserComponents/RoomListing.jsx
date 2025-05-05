import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Star, Bed, Users, DollarSign, Calendar } from "lucide-react";
import axios from "axios";
import BASE_URL from "../../Utils/api";
import { useNavigate, useParams } from "react-router-dom";

function RoomListingPage() {
  const { hotelId } = useParams()
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [hotels, setHotels] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortOption, setSortOption] = useState("default");

  const navigate = useNavigate()

  const placeholderImage =
    "https://images.unsplash.com/photo-1611691823588-0955798e00ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rooms and hotels
        const [roomsRes, hotelsRes] = await Promise.all([
          axios.get(`${BASE_URL}/room/getAll`),
          axios.get(`${BASE_URL}/hotel/getAll`)
        ]);


        const roomData = roomsRes.data.data.filter((room) => room.hotelId._id === hotelId);
        const hotelData = hotelsRes.data.data;
        // console.log("roomdata", roomData);

        setRooms(roomData);
        setFilteredRooms(roomData);
        setHotels(hotelData);

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
    };

    fetchData();
  }, []);

  const navigateToRoomBooking = (roomId) => {
    navigate(`/roomBooking/${roomId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Find Your Perfect Room
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <div
                key={room._id}
                className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.imageUrls[0]}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800">{room.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{room.hotelId?.name}</p>

                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                      <span className="font-semibold">${room.price}/night</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1 text-blue-500" />
                      <span>{room.type}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1 text-blue-500" />
                      <span>{room.capacity} guests</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {room.amenities?.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5">
                    <button onClick={() => navigateToRoomBooking(room._id)} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 rounded-lg transition-all shadow-md hover:shadow-lg">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">No rooms found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}

export default RoomListingPage;