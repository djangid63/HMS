import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import BASE_URL from "../../Utils/api";

const SearchNavBar = ({ roomId }) => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000));
  const [guests, setGuests] = useState(2);
  const [roomNum, setRoomNum] = useState(1);

  const [rooms, setRooms] = useState([])
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomList = await axios.get(`${BASE_URL}/room/getAll`);
        const filterRoom = roomList.data.data.filter((room) => room._id == roomId)
        setRooms(filterRoom)
        console.log(filterRoom);
        setLocation(filterRoom.map((room) => room.hotelId.name))
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 py-8 flex justify-center shadow-lg">
      <div className="flex gap-4 w-11/12 max-w-3xl bg-white bg-opacity-95 rounded-2xl p-6 shadow-xl">
        {/* Location */}
        <div className="flex flex-col flex-1">
          <span className="text-sm text-gray-700 mb-2 font-medium tracking-wide">Hotel Name</span>
          <input
            className="rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Enter location"
          />
        </div>
        {/* Checkin */}
        <div className="flex flex-col flex-1">
          <span className="text-sm text-gray-700 mb-2 font-medium tracking-wide">CHECK-IN</span>
          <DatePicker
            selected={checkIn}
            onChange={date => setCheckIn(date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={new Date()}
            className="rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium text-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
            dateFormat="MMM d, yyyy"
          />
        </div>
        {/* Checkout */}
        <div className="flex flex-col flex-1">
          <span className="text-sm text-gray-700 mb-2 font-medium tracking-wide">CHECK-OUT</span>
          <DatePicker
            selected={checkOut}
            onChange={date => setCheckOut(date)}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn}
            className="rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium text-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200"
            dateFormat="MMM d, yyyy"
          />
        </div>
        {/* Guests & Rooms */}
        <div className="flex flex-col flex-1">
          <span className="text-sm text-gray-700 mb-2 font-medium tracking-wide">GUESTS & ROOMS</span>
          <input
            className="rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-medium text-lg focus:outline-none cursor-not-allowed"
            value={`${guests} Adults • ${rooms} Room`}
            readOnly
          />
        </div>
        {/* Button */}
        {/* <div className="flex items-end">
          <button className="bg-amber-500 text-white font-semibold rounded-lg px-8 py-3 hover:bg-amber-600 transition duration-200 shadow-md">
            Update Search
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SearchNavBar;