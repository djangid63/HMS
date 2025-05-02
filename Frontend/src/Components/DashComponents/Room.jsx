import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../Utils/api';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [amenity, setAmenity] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);

  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Premium', 'Executive'];

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchRooms();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hotel/getAll`, config);
      setHotels(response.data.data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/room/getAll`, config);
      setRooms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addItem = (key, value, setValue) => {
    if (value.trim() !== '') {
      setFormData({
        ...formData,
        [key]: [...formData[key], value.trim()]
      });
      setValue('');
    }
  };

  const removeItem = (key, index) => {
    setFormData({
      ...formData,
      [key]: formData[key].filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.patch(`${BASE_URL}/room/update/${editId}`, formData, config);
      } else {
        await axios.post(`${BASE_URL}/room/add`, formData, config);
      }

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

  const handleDisable = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/room/disable/${id}`, config);
      fetchRooms();
    } catch (error) {
      console.error('Error disabling the room:', error);
    }
  };

  const handleViewMore = async (room) => {
    setSelectedRoom(room);
    try {
      const hotel = hotels.find(h => h._id === room.hotelId);
      if (hotel) {
        // console.log("hotel---------->>>>", hotel);
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

      {/* Room Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Room' : 'Add New Room'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Room Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Hotel Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Hotel</label>
              <select
                name="hotelId"
                value={formData.hotelId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Hotel</option>
                {hotels.map(hotel => (
                  <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                ))}
              </select>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Type</option>
                {roomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                name="capacity"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Price per Night</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                  Available
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={amenity}
                onChange={(e) => setAmenity(e.target.value)}
                placeholder="Add amenity (e.g., WiFi, TV)"
                className="flex-grow border border-gray-300 rounded-l-md shadow-sm p-2"
              />
              <button
                type="button"
                onClick={() => addItem('amenities', amenity, setAmenity)}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.amenities.map((item, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeItem('amenities', index)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Image URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs</label>
            <div className="flex items-center mb-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="flex-grow border border-gray-300 rounded-l-md shadow-sm p-2"
              />
              <button
                type="button"
                onClick={() => addItem('imageUrls', imageUrl, setImageUrl)}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt="Room" className="w-full h-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeItem('imageUrls', index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
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
                }}
                className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>

      {/* Rooms List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Rooms List</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.length > 0 ? (
                rooms.map(room => (
                  <tr key={room._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{room.roomNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hotels.find(h => h._id === room.hotelId)?.name || 'Unknown'}
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
                        onClick={() => handleViewMore(room)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No rooms found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedRoom && hotelDetails && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
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

            {selectedRoom.imageUrls && selectedRoom.imageUrls.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedRoom.imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Room ${selectedRoom.roomNumber}`} className="w-full h-32 object-cover rounded" />
                  ))}
                </div>
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