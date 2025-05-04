import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '../../Utils/api';

const RoomForm = ({
  isEditing,
  editId,
  initialFormData,
  onFormSubmit,
  onCancelEdit,
  states,
  locations,
  hotels
}) => {
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

  // For file uploads
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef(null);

  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const [amenity, setAmenity] = useState('');

  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Premium', 'Executive'];

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && initialFormData) {
      setFormData(initialFormData);

      // Find the hotel to get its location and state
      const hotel = hotels.find(h => h._id === initialFormData.hotelId);
      if (hotel && hotel.locationId) {
        setSelectedLocation(hotel.locationId._id);

        const location = locations.find(loc => loc._id === hotel.locationId._id);
        if (location && location.stateId) {
          setSelectedState(location.stateId._id);

          // Filter locations by selected state
          const filteredLocs = locations.filter(loc => {
            if (loc.stateId && loc.stateId._id) {
              return loc.stateId._id === location.stateId._id;
            }
            return false;
          });
          setFilteredLocations(filteredLocs);

          // Filter hotels by selected location
          const filteredHotels = hotels.filter(h => {
            if (h.locationId && h.locationId._id) {
              return h.locationId._id === hotel.locationId._id;
            }
            return false;
          });
          setFilteredHotels(filteredHotels);
        }
      }
    } else {
      resetForm();
    }
  }, [isEditing, initialFormData, hotels, locations]);

  const resetForm = () => {
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
    setSelectedState('');
    setSelectedLocation('');
    setFilteredLocations([]);
    setFilteredHotels([]);
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setSelectedLocation('');
    setFormData({
      ...formData,
      hotelId: ''
    });

    const filtered = locations.filter(location => {
      if (location.stateId && location.stateId._id)
        return location.stateId._id === stateId;

      return false;
    });

    setFilteredLocations(filtered);
    setFilteredHotels([]);
  };

  const handleLocationChange = (e) => {
    const locationId = e.target.value;
    setSelectedLocation(locationId);
    setFormData({
      ...formData,
      hotelId: ''
    });

    const filtered = hotels.filter(hotel => hotel.locationId._id === locationId);
    setFilteredHotels(filtered);
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

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);

      // Show preview of selected files
      const imagePreviewsPromises = filesArray.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });

      // Not storing previews in state to avoid cluttering
    }
  };

  // Handle upload to Cloudinary
  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) return;

    setUploadingImages(true);

    try {
      // Create FormData object for file upload
      const uploadFormData = new FormData();

      selectedFiles.forEach(file => {
        uploadFormData.append('images', file);
      });

      // Upload to your backend
      const response = await axios.post(
        `${BASE_URL}/room/upload-images`,
        uploadFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data && response.data.urls) {
        // Add new image URLs to existing URLs
        setFormData(prevData => ({
          ...prevData,
          imageUrls: [...(prevData.imageUrls || []), ...response.data.urls]
        }));

        // Clear file input
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Show success message
        alert(`${response.data.urls.length} images uploaded successfully!`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prevData => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a clean copy of the form data to send
    const finalFormData = { ...formData };

    // Check if imageUrls is undefined, null, or empty array and handle appropriately
    if (!finalFormData.imageUrls ||
      finalFormData.imageUrls === undefined ||
      finalFormData.imageUrls === null ||
      (Array.isArray(finalFormData.imageUrls) && finalFormData.imageUrls.length === 0)) {

      // Remove the imageUrls property altogether, don't set it to undefined
      delete finalFormData.imageUrls;
      console.log('Removing empty imageUrls property from submission');
    } else {
      console.log('Image URLs being submitted:', finalFormData.imageUrls);
    }

    console.log('Final form data being submitted:', finalFormData);
    onFormSubmit(finalFormData, isEditing, editId);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Room' : 'Add New Room'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* State Selection */}
          <div>
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

          {/* Location Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select
              value={selectedLocation}
              onChange={handleLocationChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Select Location</option>
              {filteredLocations.map(location => (
                <option key={location._id} value={location._id}>{location.name}</option>
              ))}
            </select>
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
              {filteredHotels.map(hotel => (
                <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
              ))}
            </select>
          </div>

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

        {/* Image Uploads - Simplified */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="flex-grow bg-gray-50 border border-gray-300 rounded-l-md shadow-sm p-2"
              />
              <button
                type="button"
                onClick={handleUploadImages}
                disabled={selectedFiles.length === 0 || uploadingImages}
                className={`px-4 py-2 text-white rounded-r-md ${selectedFiles.length === 0 || uploadingImages
                  ? 'bg-gray-400'
                  : 'bg-blue-500 hover:bg-blue-600'
                  }`}
              >
                {uploadingImages ? 'Uploading...' : 'Upload'}
              </button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="text-sm text-gray-500">
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          {/* Display uploaded images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt="Room" className="w-full h-32 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
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
              onClick={onCancelEdit}
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
  );
};

export default RoomForm;