import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../Utils/api';

const Hotel = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    room: '',
    description: '',
    contactNo: '',
    email: '',
    locationId: '',
    isDisable: false
  });

  const [states, setStates] = useState([]);

  const [locations, setLocations] = useState([]);

  const [hotels, setHotels] = useState([]);

  // New state variables for search and sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const [selectedState, setSelectedState] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('token')
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchStates();
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchLocations(selectedState);
    } else {
      setLocations([]);
    }
  }, [selectedState]);


  const fetchStates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/state/getAllState`, config);
      setStates(response.data.state);
      // console.log("States:", response.data.state);
    } catch (error) {
      console.error('Error fetching states:', error);
      alert('error', 'Failed to load states');
    }
  };

  const fetchLocations = async (stateId) => {
    // console.log("stateId------>", stateId);
    try {
      const response = await axios.get(`${BASE_URL}/location/getLocation/${stateId}`, config);

      console.log("State list from hotel 64 ", response.data.location);
      setLocations(response.data.location);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hotel/getAll`, config);
      console.log("Hotel fetch--------->", response.data.data);
      setHotels(response.data.data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setFormData({ ...formData, locationId: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/hotel/update/${editId}`, formData, config);
      } else {
        await axios.post(`${BASE_URL}/hotel/add`, formData, config);
      }

      setFormData({
        name: '',
        address: '',
        room: '',
        description: '',
        contactNo: '',
        email: '',
        locationId: '',
        isDisable: false
      });
      setSelectedState('');
      setIsEditing(false);
      setEditId(null);
      fetchHotels();
    } catch (error) {
      console.error('Error saving hotel:', error);
    }
  };

  const handleEdit = (hotel) => {
    setFormData({
      name: hotel.name,
      address: hotel.address,
      room: hotel.room,
      description: hotel.description,
      contactNo: hotel.contactNo,
      email: hotel.email,
      locationId: hotel.locationId,
      isDisable: hotel.isDisable
    });

    // Find state for this location
    const location = locations.find(loc => loc._id === hotel.locationId);
    if (location) {
      setSelectedState(location.stateId);
    }

    setIsEditing(true);
    setEditId(hotel._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/hotel/delete/${id}`, config);
      fetchHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${BASE_URL}/hotel/softDelete/${id}`, {}, config);
      fetchHotels();
    } catch (error) {
      console.error('Error toggling hotel status:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Hotel Management</h1>

      {/* Hotel Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Hotel' : 'Add New Hotel'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='flex w-full gap-4'>
            {/* State Selection */}
            <div className='w-1/2'>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state._id} value={state._id}>{state.state}</option>
                ))}
              </select>
            </div>

            {/* City/Location Selection */}
            <div className='w-1/2'>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                disabled={!selectedState}
              >
                <option value="">Select City</option>
                {locations.map(location => (
                  <option key={location._id} value={location._id}>{location.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Hotel Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Room Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Count</label>
              <input
                type="number"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>


          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
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
              required
            ></textarea>
          </div>

          {/* Is Disable */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Disable</label>
            <select
              name="isDisable"
              value={formData.isDisable}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          </div>

          <div className="flex justify-end">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setFormData({
                    name: '',
                    address: '',
                    room: '',
                    description: '',
                    contactNo: '',
                    email: '',
                    locationId: '',
                    isDisable: false
                  });
                  setSelectedState('');
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
              {isEditing ? 'Update Hotel' : 'Add Hotel'}
            </button>
          </div>
        </form>
      </div>

      {/* Hotels List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Hotels List</h2>

        {/* Search and Sort Controls */}
        <div className="p-4 flex flex-wrap justify-between items-center gap-4 border-b">
          {/* Search Input */}
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="name">Name</option>
              <option value="room">Room Count</option>
            </select>

            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hotels.length > 0 ? (
                hotels
                  // Filter hotels based on search query
                  .filter(hotel => {
                    if (!searchQuery) return true;
                    const searchLower = searchQuery.toLowerCase();
                    return hotel.name.toLowerCase().includes(searchLower);
                  })
                  // Sort hotels based on selected field and direction
                  .sort((a, b) => {
                    let valA, valB;

                    if (sortField === 'name') {
                      valA = a.name.toLowerCase();
                      valB = b.name.toLowerCase();
                    }
                    else if (sortField === 'room') {
                      valA = Number(a.room);
                      valB = Number(b.room);
                    }

                    if (sortDirection === 'asc') {
                      return valA > valB ? 1 : -1;
                    } else {
                      return valA < valB ? 1 : -1;
                    }
                  })
                  .map(hotel => (
                    <tr key={hotel._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{hotel.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {`${hotel.address}, ${hotel.locationId.stateId.state}, ${hotel.locationId.name}`}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{hotel.room}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{hotel.contactNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{hotel.isDisable ? 'Disabled' : 'Active'}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                        <button
                          onClick={() => handleEdit(hotel)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(hotel._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleToggleStatus(hotel._id, hotel.isDisable)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          {hotel.isDisable ? 'Enable' : 'Disable'}
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No hotels found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Hotel;