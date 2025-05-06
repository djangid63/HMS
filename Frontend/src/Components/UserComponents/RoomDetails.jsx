import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../../Utils/api";
const tabs = ["Overview", "Amenities", "Reviews", "Location"];

const RoomDetail = () => {
  const { roomId } = useParams()
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedRoom, setSelectedRoom] = useState([])

  useEffect(() => {

    const fetchRoom = async () => {
      const response = await axios.get(`${BASE_URL}/room/getAll`)
      const filterRoom = response.data.data.filter((room) => room._id == roomId)
      setSelectedRoom(filterRoom)
      console.log("room", filterRoom)

    }
    fetchRoom()
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          selectedRoom[0] ? (
            <div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Images</h3>
                {selectedRoom[0].imageUrls
                  && selectedRoom[0].imageUrls
                    .length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedRoom[0].imageUrls
                      .map((image, index) => (
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
                <p className="text-gray-700 mb-4">
                  {selectedRoom[0].description}
                </p>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Room Details</h3>
                  <p className="text-gray-600"><span className="font-medium">Type:</span> {selectedRoom[0].roomType}</p>
                  <p className="text-gray-600"><span className="font-medium">Price:</span> ₹{selectedRoom[0].price} / night</p>
                </div>

              </div>
            </div>
          ) : (
            <p className="text-gray-700">Loading...</p>
          )
        );
      case "Amenities":
        return (
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {selectedRoom[0].amenities
              .map((amentie, index) => (
                <li key={index} >{amentie}</li>
              ))
            }
          </ul>
        );
      case "Reviews":
        return (
          <div className="text-gray-700 space-y-4">
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
          <p className="text-gray-700">
            Located in the heart of the city, near shopping malls and major attractions. 15 min from the airport.
          </p>
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
          src='https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt="Hotel Room"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0  flex items-center justify-center">

          <h1 className="text-4xl md:text-5xl text-white font-bold">Deluxe Room</h1>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-300 overflow-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 font-medium ${activeTab === tab ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-600"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">{renderContent()}</div>
      </div>

      {/* Booking Sidebar */}
      {/* <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="w-full md:w-1/3 bg-white p-6 shadow-lg rounded-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">₹4,999 / night</h3>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Check-in</label>
            <input type="date" className="w-full border border-gray-300 p-2 rounded" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Check-out</label>
            <input type="date" className="w-full border border-gray-300 p-2 rounded" />
          </div>
          <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">
            Book Now
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default RoomDetail;
