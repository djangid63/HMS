import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../Utils/api';
import RoomForm from './RoomForm';

const Room = () => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    hotelId: '',
    type: '',
    capacity: 1,
    price: 0,
    amenities: [],
    isAvailable: true,
    isActive: true,
    description: '',
    imageUrls: []
  });

  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [states, setStates] = useState([]);
  const [locations, setLocations] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Search and sort related states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortPriceDirection, setSortPriceDirection] = useState('none'); // 'none', 'asc', 'desc'
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchStates();
    fetchLocations();
    fetchHotels();
    fetchRooms();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/state/getAllState`, config);
      setStates(response.data.state);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/location/getAllLocation`, config);
      console.log("location------>>>>", response.data.location);
      setLocations(response.data.location || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hotel/getAll`, config);
      console.log("Hotels--------->>>>>>>>>>><<<<<<", response.data);
      setHotels(response.data.data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/room/getAll`, config);
      const roomData = response.data.data || [];
      setRooms(roomData);
      setFilteredRooms(roomData);
      // console.log(roomData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterAndSortRooms(e.target.value, sortPriceDirection);
  };

  // Toggle price sorting
  const handleSortPrice = () => {
    // Cycle through sort states: none -> ascending -> descending -> none
    const nextSortDirection = sortPriceDirection === 'none' ? 'asc' :
      sortPriceDirection === 'asc' ? 'desc' : 'none';
    setSortPriceDirection(nextSortDirection);
    filterAndSortRooms(searchTerm, nextSortDirection);
  };

  // Filter and sort the rooms based on search term and sort direction
  const filterAndSortRooms = (search, sortDirection) => {
    let result = [...rooms];

    // Apply search filter if search term exists
    if (search.trim() !== '') {
      result = result.filter(room =>
        room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
        room.price.toString().includes(search) ||
        room.type.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting if sort direction is specified
    if (sortDirection === 'asc') {
      result = result.sort((a, b) => a.price - b.price);
    } else if (sortDirection === 'desc') {
      result = result.sort((a, b) => b.price - a.price);
    }

    setFilteredRooms(result);
  };

  // Re-filter and sort when rooms data changes
  useEffect(() => {
    filterAndSortRooms(searchTerm, sortPriceDirection);
  }, [rooms]);

  const handleFormSubmit = async (formData, isEditing, editId) => {
    try {
      console.log('Submitting form data with images:', formData);
      console.log('Image URLs being sent:', formData.imageUrls);

      if (isEditing) {
        const response = await axios.patch(`${BASE_URL}/room/update/${editId}`, formData, config);
        console.log('Update response:', response.data);
      } else {
        const response = await axios.post(`${BASE_URL}/room/add`, formData, config);
        console.log('Add response:', response.data);
        setFormData("")
      }

      setIsEditing(false);
      setEditId(null);
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleEdit = (room) => {
    setFormData({
      roomNumber: room.roomNumber || '',
      hotelId: room.hotelId || '',
      type: room.type || '',
      capacity: room.capacity || 1,
      price: room.price || 0,
      amenities: room.amenities || [],
      isAvailable: room.isAvailable !== undefined ? room.isAvailable : true,
      isActive: room.isActive !== undefined ? room.isActive : true,
      description: room.description || '',
      imageUrls: room.imageUrls || []
    });

    setIsEditing(true);
    setEditId(room._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/room/delete/${id}`, config);
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/room/disable/${id}`, config);
      fetchRooms();
    } catch (error) {
      console.error('Error toggling room status:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      roomNumber: '',
      hotelId: '',
      type: '',
      capacity: 1,
      price: 0,
      amenities: [],
      isAvailable: true,
      isActive: true,
      description: '',
      imageUrls: []
    });
  };

  const handleViewMore = async (room) => {
    setSelectedRoom(room);
    try {
      const hotel = hotels.find(h => h._id === room.hotelId);
      if (hotel) {
        // console.log("hotel---------->>>>", hotel);
        // console.log("room images:", room.imageUrls); 
        setHotelDetails(hotel);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setHotelDetails(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Room Management</h1>

      {/* Room Form - Now using the RoomForm component */}
      <RoomForm
        isEditing={isEditing}
        editId={editId}
        initialFormData={formData}
        onFormSubmit={handleFormSubmit}
        onCancelEdit={handleCancelEdit}
        states={states}
        locations={locations}
        hotels={hotels}
      />

      {/* Rooms List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Rooms List</h2>

        <div className="overflow-x-auto">
          <div className="flex items-center justify-between p-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search rooms..."
              className="border border-gray-300 rounded-md shadow-sm p-2 w-1/3"
            />
            <button
              onClick={handleSortPrice}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Sort by Price ({sortPriceDirection === 'none' ? 'None' : sortPriceDirection === 'asc' ? 'Ascending' : 'Descending'})
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.length > 0 ? (
                filteredRooms.map(room => (
                  <tr key={room._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{room.roomNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* {hotels.find(h => h._id === room.hotelId)?.name || 'Unknown'} */}
                      {room.hotelId.name || 'Not found'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{room.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{room.capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${room.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${room.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {room.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${!room.isDisable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {!room.isDisable ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleToggleActive(room._id)}
                        className={`px-3 py-1 ${room.isDisable ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded`}
                      >
                        {room.isDisable ? 'Enable' : 'Disable'}
                      </button>
                      {/* <button
                        onClick={() => handleViewMore(room)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        View More
                      </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No rooms found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedRoom && hotelDetails && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Room Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Room Images - Enhanced Gallery */}
            {selectedRoom.imageUrls && selectedRoom.imageUrls.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Room Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedRoom.imageUrls.map((url, index) => (
                    <div key={index} className="overflow-hidden rounded-lg shadow-md h-48">
                      <img
                        src={url}
                        alt={`Room ${selectedRoom.roomNumber} - Image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onClick={() => window.open(url, '_blank')}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Room Information</h3>
                <p className="mb-1"><span className="font-semibold">Room Number:</span> {selectedRoom.roomNumber}</p>
                <p className="mb-1"><span className="font-semibold">Type:</span> {selectedRoom.type}</p>
                <p className="mb-1"><span className="font-semibold">Capacity:</span> {selectedRoom.capacity} {selectedRoom.capacity > 1 ? 'persons' : 'person'}</p>
                <p className="mb-1"><span className="font-semibold">Price:</span> ${selectedRoom.price}/night</p>
                <p className="mb-1"><span className="font-semibold">Status:</span>
                  <span className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full ${selectedRoom.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedRoom.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </p>
                <p className="mb-1"><span className="font-semibold">Active Status:</span>
                  <span className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full ${!selectedRoom.isDisable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {!selectedRoom.isDisable ? 'Active' : 'Disabled'}
                  </span>
                </p>

                {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold mb-1">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedRoom.amenities.map((item, index) => (
                        <span key={index} className="bg-gray-100 px-2 py-0.5 text-xs rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Hotel Information</h3>
                <p className="mb-1"><span className="font-semibold">Hotel Name:</span> {hotelDetails.name}</p>

                <div className="mb-1">
                  <span className="font-semibold">Full Address:</span>
                  <p className="ml-2">
                    {hotelDetails.address},<br />
                    {hotelDetails.locationId?.name || 'Unknown City'}, {hotelDetails.locationId?.stateId?.state || 'Unknown State'}
                  </p>
                </div>

                <p className="mb-1"><span className="font-semibold">Contact:</span> {hotelDetails.contactNo}</p>
                <p className="mb-1"><span className="font-semibold">Email:</span> {hotelDetails.email}</p>
              </div>
            </div>

            {selectedRoom.description && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedRoom.description}</p>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;