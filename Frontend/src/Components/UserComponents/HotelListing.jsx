import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
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
  const placeholderImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getHotel = await axios.get(`${BASE_URL}/hotel/getAll`);
        if (getHotel.data) {
          const hotelData = getHotel.data.data;

          const hotelNew = hotelData.filter((hotel) => hotel.locationId._id == locationFilter);

          const getLocations = [
            ...new Set(
              hotelData
                .filter((hotel) => {
                  if (hotel.locationId.isDisable !== true) return hotel.locationId;
                })
                .map((hotel) => JSON.stringify(hotel.locationId))
            ),
          ].map((location) => JSON.parse(location));

          const stateSpecificLocations = getLocations.filter((locations) => locations.stateId._id == stateFilter);
          setLocations(stateSpecificLocations);

          const getStates = [
            ...new Set(
              getLocations
                .filter((locations) => {
                  if (locations.stateId.isDisable !== true) return locations.stateId;
                })
                .map((locations) => JSON.stringify(locations.stateId))
            ),
          ].map((locations) => JSON.parse(locations));
          setStates(getStates);

          const statesNew = getHotel.data.data.filter((hotel) => hotel.locationId.stateId._id == stateFilter && hotel.isDisable != true);
          console.log(statesNew);

          if (statesNew.length > 0 && hotelNew.length <= 0) {
            setHotels(statesNew);
            setFilteredHotels(statesNew);
          } else if (hotelNew.length > 0) {
            setHotels(hotelNew);
            setFilteredHotels(hotelNew);
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

    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      updatedHotels = updatedHotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(lowerCaseTerm) ||
        hotel.address?.toLowerCase().includes(lowerCaseTerm)
      );
    }

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
        break;
    }

    setFilteredHotels(updatedHotels);
  }, [searchTerm, sortOption, hotels]);

  const navigateToRooms = (hotelId) => {
    navigate(`/roomlist/${hotelId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Find Your Perfect Stay
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Explore a wide range of hotels and book your room with ease.
          </p>
        </header>

        {/* Search and Filters Bar */}
        <div className="mb-12 p-6 bg-white rounded-xl shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search hotels by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors duration-200 ease-in-out bg-gray-50"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
            </div>

            {/* State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors duration-200 ease-in-out bg-gray-50 appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2212%22 height%3D%2212%22 fill%3D%22none%22 stroke%3D%22%236b7280%22 strokeLinecap%3D%22round%22 strokeLinejoin%3D%22round%22 strokeWidth%3D%222%22 viewBox%3D%220 0 24 24%22%3E%3Cpolyline points%3D%226 9 12 15 18 9%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-3"
            >
              <option value="">Filter by State</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.state}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors duration-200 ease-in-out bg-gray-50 appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2212%22 height%3D%2212%22 fill%3D%22none%22 stroke%3D%22%236b7280%22 strokeLinecap%3D%22round%22 strokeLinejoin%3D%22round%22 strokeWidth%3D%222%22 viewBox%3D%220 0 24 24%22%3E%3Cpolyline points%3D%226 9 12 15 18 9%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-3"
            >
              <option value="">Filter by Location</option>
              {locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors duration-200 ease-in-out bg-gray-50 appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2212%22 height%3D%2212%22 fill%3D%22none%22 stroke%3D%22%236b7280%22 strokeLinecap%3D%22round%22 strokeLinejoin%3D%22round%22 strokeWidth%3D%222%22 viewBox%3D%220 0 24 24%22%3E%3Cpolyline points%3D%226 9 12 15 18 9%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-3"
            >
              <option value="default">Sort by: Default</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="rooms-desc">Rooms (High to Low)</option>
              <option value="rooms-asc">Rooms (Low to High)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <div
                key={hotel._id}
                onClick={() => navigateToRooms(hotel._id)}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden cursor-pointer flex flex-col"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={hotel.images && hotel.images.length > 0 ? hotel.images[0].url : placeholderImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"></div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate group-hover:text-indigo-600 transition-colors duration-200">
                    {hotel.name}
                  </h2>

                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1.5 text-indigo-500 flex-shrink-0" />
                    <span className="line-clamp-1" title={`${hotel.address}, ${hotel.locationId.name}, ${hotel.locationId.stateId.state}`}>
                      {`${hotel.address}, ${hotel.locationId.name}, ${hotel.locationId.stateId.state}` || "No address available"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {hotel.description || "No description available."}
                  </p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5 text-gray-700">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5 text-indigo-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12M3 3v12M3 3v7.5M7.5 3v7.5M3 3l3.75 3.75M3 3l3.75 3.75m0 0L9 3m-3.75 3.75L9 3m0 0L6.75 5.25m2.25-2.25L12 3m0 0l3.75 3.75M12 3v7.5m0 0l3.75-3.75M12 3l3.75 3.75m0 0L18 3m-3.75 3.75L18 3m0 0l2.25 2.25M15 3h6v6h-6V3z" />
                      </svg>
                      <span>Rooms: <span className="font-medium">{hotel.room || 0}</span></span>
                    </div>
                    <div className="flex items-center truncate">
                      <Phone className="w-4 h-4 mr-1.5 text-indigo-500 flex-shrink-0" />
                      <span title={hotel.contactNo || "N/A"}>{hotel.contactNo || "N/A"}</span>
                    </div>
                    <div className="flex items-center truncate col-span-2">
                      <Mail className="w-4 h-4 mr-1.5 text-indigo-500 flex-shrink-0" />
                      <span title={hotel.email || "N/A"}>{hotel.email || "N/A"}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75">
                      View Rooms & Book
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Hotels Found</h3>
              <p className="text-gray-500">
                We couldn't find any hotels matching your current filters. Try adjusting your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HotelListingPage;
