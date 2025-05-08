import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../../Utils/api";
import BookForm from "./BookForm";
const tabs = ["Overview", "Amenities", "Reviews", "Location"];
import { jwtDecode } from "jwt-decode";

const RoomDetail = () => {
  const { roomId } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [user, setUser] = useState()

  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token);
  console.log(decoded);



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
      console.log("room", filterRoom);
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
          <div className="h-[400px]">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Images</h3>
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
                <p className="text-gray-500">No images available for this room.</p>
              )}
            </div>
            <div className="py-4">
              <p className="text-gray-700 mb-4">{selectedRoom[0].description}</p>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Room Details</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Type:</span> {selectedRoom[0].roomType}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Price:</span> ₹{selectedRoom[0].price} / night
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-700">Loading...</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hotel Room"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white font-bold">Deluxe Room</h1>
        </div>
      </div>

      {/* Tabs and Content & Booking Form */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Tabs and Content */}
        <div className="lg:w-2/3">
          <div className="mb-6">
            <div className="flex gap-4 border-b border-gray-300 overflow-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={` py-2 px-4 font-medium whitespace-nowrap ${activeTab === tab
                    ? "border-b-4 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">{renderContent()}</div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:w-1/3 pt-[72px] pl-4">
          {selectedRoom[0] && (
            <BookForm
              price={selectedRoom[0].price}
              roomId={roomId}
              hotelId={selectedRoom[0].hotel}
              capacity={selectedRoom[0].capacity}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
