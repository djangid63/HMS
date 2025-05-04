import React, { useState, useEffect } from "react";
import { MapPin, Star, Phone, Mail } from "lucide-react";
import axios from "axios";
import BASE_URL from "../Utils/api";

function HotelListingPage() {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const placeholderImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getHotel = await axios.get(`${BASE_URL}/hotel/getAll`);
        console.log(getHotel.data.data);
        if (getHotel.data) {

          setHotels(getHotel.data.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-10">Explore Hotels</h1>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {hotels.map((hotel, index) => (
          <div
            key={index}
            className="rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow"
          >
            <img
              src={placeholderImage}
              alt={hotel.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">{hotel.name}</h2>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {hotel.address || "No address"}
              </div>
              <p className="text-gray-700 text-sm">{hotel.description || "No description available."}</p>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Rooms:</span> {hotel.room || 0}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-1" />
                {hotel.contactNo || "N/A"}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-1" />
                {hotel.email || "N/A"}
              </div>
              <div className="flex justify-end pt-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotelListingPage;
