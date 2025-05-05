import React, { useState, useEffect } from "react";
import { MapPin, Star, Phone, Mail } from "lucide-react";
import axios from "axios";
import BASE_URL from './../../Utils/api';
import { useNavigate } from 'react-router-dom';

function HotelListingPage() {
  const [hotels, setHotels] = useState([]);

  const [filteredHotels, setFilteredHotels] = useState([]);

  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const [stateFilter, setStateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [states, setStates] = useState([]);
  const [locations, setLocations] = useState([]);

  const placeholderImage =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";

  const navigate = useNavigate()


  useEffect(() => {
    const fetchData = async () => {
      try {
        const getHotel = await axios.get(`${BASE_URL}/hotel/getAll`);

        if (getHotel.data) {
          const hotelData = getHotel.data.data;

          const hotelNew = hotelData
            .filter((hotel) =>
              hotel.locationId._id == locationFilter
            )

          const getLocations = [
            ...new Set(
              hotelData
                .filter((hotel) => {
                  if (hotel.locationId.isDisable !== true)
                    return hotel.locationId;
                })
                .map((hotel) => JSON.stringify(hotel.locationId))
            ),
          ].map((location) => JSON.parse(location));

          const stateSpecificLocations = getLocations
            .filter((locations) => locations.stateId._id == stateFilter)
          setLocations(stateSpecificLocations)

          const getStates = [
            ...new Set(
              getLocations
                .filter((locations) => {
                  if (locations.stateId.isDisable !== true)
                    return locations.stateId;
                })
                .map((locations) => JSON.stringify(locations.stateId))
            ),
          ].map((locations) => JSON.parse(locations));
          setStates(getStates);

          const statesNew = getHotel.data.data
            .filter((hotel) =>
              hotel.locationId.stateId._id == stateFilter
            )
          console.log(statesNew);

          if (statesNew.length > 0 && hotelNew.length <= 0) {
            setHotels(statesNew)
            setFilteredHotels(statesNew)
          } else if (hotelNew.length > 0) {
            setHotels(hotelNew)
            setFilteredHotels(hotelNew)
          } else {
            setHotels(hotelData);
            setFilteredHotels(hotelData);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [stateFilter, locationFilter]);

  useEffect(() => {
    let updatedHotels = [...hotels];

    // 🔍 Apply search filter
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      updatedHotels = updatedHotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(lowerCaseTerm) ||
        hotel.address?.toLowerCase().includes(lowerCaseTerm)
      );
    }

    // 📊 Apply sorting
    switch (sortOption) {
      case "name-asc":
        updatedHotels.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        updatedHotels.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rooms-desc":
        updatedHotels.sort((a, b) => (b.room || 0) - (a.room || 0));
        break;
      case "rooms-asc":
        updatedHotels.sort((a, b) => (a.room || 0) - (b.room || 0));
        break;
      default:
        // Do nothing for 'default'
        break;
    }

    setFilteredHotels(updatedHotels);
  }, [searchTerm, sortOption, hotels]);


  const navigateToRooms = (hotelId) => {
    navigate(`/roomlist/${hotelId}`);
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Explore Hotels
        </h1>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/80 backdrop-blur-sm"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="appearance-none w-full p-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white/80 backdrop-blur-sm pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2212%22 height%3D%2212%22 fill%3D%22none%22 stroke%3D%22%236b7280%22 strokeLinecap%3D%22round%22 strokeLinejoin%3D%22round%22 strokeWidth%3D%222%22 viewBox%3D%220 0 24 24%22%3E%3Cpolyline points%3D%226 9 12 15 18 9%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-3"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.state}
              </option>
            ))}
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="appearance-none w-full p-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white/80 backdrop-blur-sm pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2212%22 height%3D%2212%22 fill%3D%22none%22 stroke%3D%22%236b7280%22 strokeLinecap%3D%22round%22 strokeLinejoin%3D%22round%22 strokeWidth%3D%222%22 viewBox%3D%220 0 24 24%22%3E%3Cpolyline points%3D%226 9 12 15 18 9%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-3"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {location.name}
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="appearance-none w-full p-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white/80 backdrop-blur-sm pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2212%22 height%3D%2212%22 fill%3D%22none%22 stroke%3D%22%236b7280%22 strokeLinecap%3D%22round%22 strokeLinejoin%3D%22round%22 strokeWidth%3D%222%22 viewBox%3D%220 0 24 24%22%3E%3Cpolyline points%3D%226 9 12 15 18 9%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-3"
          >
            <option value="default">Sort by: Default</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="rooms-desc">Rooms (High to Low)</option>
            <option value="rooms-asc">Rooms (Low to High)</option>
          </select>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredHotels.map((hotel, index) => (
            <div onClick={() => navigateToRooms(hotel._id)}
              key={index}
              className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={placeholderImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {hotel.name}
                </h2>

                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1.5 text-blue-500" />
                  <span className="line-clamp-1">
                    {`${hotel.address} ,  ${hotel.locationId.name}, ${hotel.locationId.stateId.state}` ||
                      "No address"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {hotel.description || "No description available."}
                </p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="text-sm">
                    <span className="font-medium text-gray-500">Rooms:</span>{" "}
                    <span className="font-semibold text-gray-800">
                      {hotel.room || 0}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-1.5 text-blue-500" />
                    <span>{hotel.contactNo || "N/A"}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-1.5 text-blue-500" />
                    <span className="line-clamp-1">{hotel.email || "N/A"}</span>
                  </div>
                </div>

                <div className="flex w-full pt-2">
                  <button className="bg-gradient-to-r w-full from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg shadow-md transition-all transform hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Choose Your Room
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HotelListingPage;
