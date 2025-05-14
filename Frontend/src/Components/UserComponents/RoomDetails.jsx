import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../../Utils/api";
import BookForm from "./BookForm";
const tabs = ["Overview", "Amenities", "Reviews", "Location"];
import { jwtDecode } from "jwt-decode";
import { useSelector } from 'react-redux';

const RoomDetail = () => {
  const { theme } = useSelector((state) => state.theme);
  const { roomId } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [user, setUser] = useState()

  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token);

  useEffect(() => {

    const fetchUser = async () => {
      const response = await axios.get(`${BASE_URL}/user/getAll`)
      const userData = response.data.data.filter((user) => user.email == decoded.email);
      setUser(userData)
    }

    const fetchRoom = async () => {
      const response = await axios.get(`${BASE_URL}/room/getAll`);
      const filterRoom = response.data.data.filter((room) => room._id == roomId);
      setSelectedRoom(filterRoom);
      // console.log("room", filterRoom);
    };
    fetchRoom();
    fetchUser()
  }, []);

  // if (user)
  //   console.log("user", user);

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return selectedRoom[0] ? (
          <div className="h-[500px]">
            <div>
              <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Images</h3>
              {selectedRoom[0].imageUrls && selectedRoom[0].imageUrls.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedRoom[0].imageUrls.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Room image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                    />
                  ))}
                </div>
              ) : (
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No images available for this room.</p>
              )}
            </div>
            <div className="py-4">
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{selectedRoom[0].description}</p>
              <div className="mb-4">
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Room Details</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-medium">Type:</span> {selectedRoom[0].roomType}
                </p>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-medium">Price:</span> ₹{selectedRoom[0].price} / night
                </p>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-medium">Max Guests:</span> {selectedRoom[0].capacity}
                </p>
              </div>
              <div>
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Room Features</h3>
                <ul className="list-disc list-inside">
                  {selectedRoom[0].features && selectedRoom[0].features.map((feature, index) => (
                    <li key={index} className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading room details...</p>
        );
      case "Amenities":
        return (
          <ul className="h-[400px] text-2xl list-disc list-inside text-gray-700 space-y-1">
            {selectedRoom[0].amenities.map((amentie, index) => (
              <li key={index}>{amentie}</li>
            ))}
          </ul>
        );
      case "Reviews":
        return (
          <div className="text-gray-700 space-y-4 h-[400px]">
            <div>
              <strong>John D:</strong> Amazing room, clean and spacious. Loved the view!
            </div>
            <div>
              <strong>Priya S:</strong> Great service and location. Definitely coming back.
            </div>
          </div>
        );
      case "Location":
        return (
          <div className="text-gray-700 h-[400px]">
            <p className="pb-5">
              {`${selectedRoom[0].hotelId.name}`}
            </p>
            <p className="pb-5">
              {`Address : ${selectedRoom[0].hotelId.address}`}
            </p>
            <p className="">
              {`Contact No : ${selectedRoom[0].hotelId.contactNo}`}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Room Details */}
        <div className="lg:col-span-2">
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {selectedRoom[0]?.name || "Room Details"}
          </h1>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-6 font-medium text-sm transition-colors duration-200 whitespace-nowrap focus:outline-none ${activeTab === tab
                    ? `border-b-2 border-indigo-600 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`
                    : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className={`rounded-lg shadow-md p-6 mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {renderContent()}
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:col-span-1 w-fit">
          <div className={` rounded-lg shadow-md p-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <BookForm price={selectedRoom[0]?.price} roomId={selectedRoom[0]?._id} capacity={selectedRoom[0]?.capacity} user={user} hotelId={selectedRoom[0]?.hotelId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
