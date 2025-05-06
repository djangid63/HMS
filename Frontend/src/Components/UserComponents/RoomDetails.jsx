import React, { useState } from "react";

const tabs = ["Overview", "Details", "Amenities", "Reviews", "Location"];

const RoomDetail = () => {

  const [activeTab, setActiveTab] = useState("Overview");

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <p className="text-gray-700">
            Enjoy a luxurious stay in our Deluxe Room with modern amenities and a stunning city view.
            Spacious and elegantly designed, this room includes a king-sized bed, ensuite bathroom, and a private balcony.
          </p>
        );
      case "Details":
        return (
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Room Size: 400 sq ft</li>
            <li>Bed Type: King Size</li>
            <li>Occupancy: 2 Adults + 1 Child</li>
            <li>View: Cityscape</li>
            <li>Bathroom: Ensuite with Rain Shower</li>
          </ul>
        );
      case "Amenities":
        return (
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Free Wi-Fi</li>
            <li>Air Conditioning</li>
            <li>Mini Bar</li>
            <li>Flat Screen TV</li>
            <li>Room Service</li>
            <li>Private Balcony</li>
            <li>24/7 Front Desk</li>
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
