import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../Utils/api';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaCaretDown, FaCaretUp, FaFilter, FaMapMarkerAlt, FaCalendarAlt, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenuePanel = () => {
  const { theme } = useSelector((state) => state.theme);
  
  // State for data management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
  const [states, setStates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortRevenue, setSortRevenue] = useState("desc");
  
  // Revenue aggregation
  const [revenueByState, setRevenueByState] = useState([]);
  const [revenueByLocation, setRevenueByLocation] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageBookingValue, setAverageBookingValue] = useState(0);
  const [topPerformers, setTopPerformers] = useState([]);
  
  const [timeFilter, setTimeFilter] = useState("all"); // all, month, week, today
  
  // Authentication configuration
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch states, locations, and bookings in parallel
        const [statesRes, locationsRes, bookingsRes] = await Promise.all([
          axios.get(`${BASE_URL}/state/getAllState`, config),
          axios.get(`${BASE_URL}/location/getAllLocation`, config),
          axios.get(`${BASE_URL}/booking/getAll`, config)
        ]);
        
        setStates(statesRes.data.state || []);
        setLocations(locationsRes.data.location || []);
        
        // Process booking data - need to join with rooms and hotels data for complete info
        const bookingData = bookingsRes.data.data || [];
        
        // Fetch rooms data to get hotelId for each booking
        const roomsRes = await axios.get(`${BASE_URL}/room/getAll`, config);
        const roomsData = roomsRes.data.data || [];
        
        // Fetch hotels data to get location information
        const hotelsRes = await axios.get(`${BASE_URL}/hotel/getAll`, config);
        const hotelsData = hotelsRes.data.data || [];
        
        // Enhance booking data with room, hotel, location, and state information
        const enhancedBookings = bookingData.map(booking => {
          // Find related room
          const room = roomsData.find(room => room._id === booking.roomId);
          
          // Find related hotel
          const hotel = room ? hotelsData.find(hotel => hotel._id === room.hotelId) : null;
          
          // Find related location
          const location = hotel ? locations.find(loc => loc._id === hotel.locationId) : null;
          
          // Find related state
          const state = location ? states.find(state => state._id === location.stateId) : null;
          
          // Return enhanced booking with all associations
          return {
            ...booking,
            roomDetails: room || {},
            hotelDetails: hotel || {},
            locationDetails: location || {},
            stateDetails: state || {}
          };
        }).filter(booking => booking.status === 'Approved');
        
        setBookings(enhancedBookings);
        setFilteredBookings(enhancedBookings);
        
        // Calculate initial revenue metrics
        calculateRevenueMetrics(enhancedBookings);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load revenue data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Update filtered locations when state selection changes
  useEffect(() => {
    if (selectedState) {
      const stateLocations = locations.filter(loc => loc.stateId && loc.stateId._id === selectedState);
      setFilteredLocations(stateLocations);
    } else {
      setFilteredLocations(locations);
    }
  }, [selectedState, locations]);
  
  // Apply filters when selection changes
  useEffect(() => {
    filterBookings();
  }, [selectedState, selectedLocation, dateRange, timeFilter, sortRevenue, bookings]);
  
  // Function to filter bookings based on selected criteria
  const filterBookings = () => {
    if (!bookings.length) return;
    
    let filtered = [...bookings];
    
    // Filter by state
    if (selectedState) {
      filtered = filtered.filter(booking => 
        booking.stateDetails && booking.stateDetails._id === selectedState
      );
    }
    
    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(booking => 
        booking.locationDetails && booking.locationDetails._id === selectedLocation
      );
    }
    
    // Filter by date range
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }
    
    // Filter by time period
    if (timeFilter !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      if (timeFilter === 'week') {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (timeFilter === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (timeFilter === 'today') {
        cutoffDate.setHours(0, 0, 0, 0);
      }
      
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate >= cutoffDate;
      });
    }
    
    // Apply sorting
    if (sortRevenue === 'asc') {
      filtered.sort((a, b) => a.totalAmount - b.totalAmount);
    } else {
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    }
    
    setFilteredBookings(filtered);
    calculateRevenueMetrics(filtered);
  };
  
  // Function to calculate revenue metrics from bookings
  const calculateRevenueMetrics = (bookingsData) => {
    if (!bookingsData.length) {
      setRevenueByState([]);
      setRevenueByLocation([]);
      setTotalRevenue(0);
      setAverageBookingValue(0);
      setTopPerformers([]);
      return;
    }
    
    // Calculate total revenue
    const total = bookingsData.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    setTotalRevenue(total);
    
    // Calculate average booking value
    setAverageBookingValue(total / bookingsData.length);
    
    // Aggregate revenue by state
    const stateRevenue = {};
    bookingsData.forEach(booking => {
      if (booking.stateDetails && booking.stateDetails._id) {
        const stateId = booking.stateDetails._id;
        const stateName = booking.stateDetails.state || 'Unknown State';
        
        if (!stateRevenue[stateId]) {
          stateRevenue[stateId] = {
            _id: stateId,
            name: stateName,
            revenue: 0,
            bookings: 0
          };
        }
        
        stateRevenue[stateId].revenue += booking.totalAmount || 0;
        stateRevenue[stateId].bookings += 1;
      }
    });
    
    // Aggregate revenue by location
    const locationRevenue = {};
    bookingsData.forEach(booking => {
      if (booking.locationDetails && booking.locationDetails._id) {
        const locationId = booking.locationDetails._id;
        const locationName = booking.locationDetails.name || 'Unknown Location';
        const stateId = booking.stateDetails ? booking.stateDetails._id : null;
        
        if (!locationRevenue[locationId]) {
          locationRevenue[locationId] = {
            _id: locationId,
            name: locationName,
            stateId: stateId,
            revenue: 0,
            bookings: 0
          };
        }
        
        locationRevenue[locationId].revenue += booking.totalAmount || 0;
        locationRevenue[locationId].bookings += 1;
      }
    });
    
    // Convert to arrays and sort by revenue
    const stateRevenueArray = Object.values(stateRevenue).sort((a, b) => b.revenue - a.revenue);
    const locationRevenueArray = Object.values(locationRevenue).sort((a, b) => b.revenue - a.revenue);
    
    setRevenueByState(stateRevenueArray);
    setRevenueByLocation(locationRevenueArray);
    
    // Determine top performers (hotels with highest revenue)
    const hotelRevenue = {};
    bookingsData.forEach(booking => {
      if (booking.hotelDetails && booking.hotelDetails._id) {
        const hotelId = booking.hotelDetails._id;
        const hotelName = booking.hotelDetails.name || 'Unknown Hotel';
        
        if (!hotelRevenue[hotelId]) {
          hotelRevenue[hotelId] = {
            _id: hotelId,
            name: hotelName,
            locationName: booking.locationDetails ? booking.locationDetails.name : 'Unknown',
            stateName: booking.stateDetails ? booking.stateDetails.state : 'Unknown',
            revenue: 0,
            bookings: 0
          };
        }
        
        hotelRevenue[hotelId].revenue += booking.totalAmount || 0;
        hotelRevenue[hotelId].bookings += 1;
      }
    });
    
    // Get top 5 hotels
    const topHotels = Object.values(hotelRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    setTopPerformers(topHotels);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedState("");
    setSelectedLocation("");
    setDateRange({ start: "", end: "" });
    setTimeFilter("all");
    setSortRevenue("desc");
  };
  
  // Generate chart data for state revenue
  const prepareStateChartData = () => {
    const sortedData = [...revenueByState];
    if (sortRevenue === 'asc') {
      sortedData.sort((a, b) => a.revenue - b.revenue);
    } else {
      sortedData.sort((a, b) => b.revenue - a.revenue);
    }
    
    // Take top 10 states for readability
    const topStates = sortedData.slice(0, 10);
    
    return {
      labels: topStates.map(item => item.name),
      datasets: [
        {
          label: 'Revenue by State',
          data: topStates.map(item => item.revenue),
          backgroundColor: theme === 'dark' ? 'rgba(99, 102, 241, 0.7)' : 'rgba(79, 70, 229, 0.7)',
          borderColor: theme === 'dark' ? 'rgba(129, 140, 248, 1)' : 'rgba(67, 56, 202, 1)',
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Generate chart data for location revenue
  const prepareLocationChartData = () => {
    let relevantLocations = [...revenueByLocation];
    
    // Filter by selected state if applicable
    if (selectedState) {
      relevantLocations = relevantLocations.filter(loc => loc.stateId === selectedState);
    }
    
    if (sortRevenue === 'asc') {
      relevantLocations.sort((a, b) => a.revenue - b.revenue);
    } else {
      relevantLocations.sort((a, b) => b.revenue - a.revenue);
    }
    
    // Take top 10 locations for readability
    const topLocations = relevantLocations.slice(0, 10);
    
    return {
      labels: topLocations.map(item => item.name),
      datasets: [
        {
          label: 'Revenue by Location',
          data: topLocations.map(item => item.revenue),
          backgroundColor: theme === 'dark' ? 'rgba(249, 115, 22, 0.7)' : 'rgba(234, 88, 12, 0.7)',
          borderColor: theme === 'dark' ? 'rgba(251, 146, 60, 1)' : 'rgba(194, 65, 12, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Revenue: ₹${context.parsed.y.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#1f2937'
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Revenue Dashboard</h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Analyze your revenue performance by state and location
          </p>
        </div>

        {/* Filters */}
        <div className={`p-4 mb-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-semibold mb-4 md:mb-0 flex items-center">
              <FaFilter className="mr-2" /> Filter Options
            </h2>
            <button 
              onClick={resetFilters}
              className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedLocation(""); // Reset location when state changes
                }}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.state}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="">All Locations</option>
                {filteredLocations.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Period Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Time Period</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium mb-1">Sort Revenue</label>
              <div
                className={`flex items-center justify-between p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  {sortRevenue === 'desc' ? (
                    <FaSortAmountDown className="mr-2" />
                  ) : (
                    <FaSortAmountUp className="mr-2" />
                  )}
                  <span>{sortRevenue === 'desc' ? 'High to Low' : 'Low to High'}</span>
                </div>
                <button
                  onClick={() => setSortRevenue(sortRevenue === 'desc' ? 'asc' : 'desc')}
                  className={`p-1 rounded-md ${
                    theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                  }`}
                >
                  {sortRevenue === 'desc' ? (
                    <FaCaretDown className="text-lg" />
                  ) : (
                    <FaCaretUp className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className={`p-4 mb-8 rounded-lg ${theme === 'dark' ? 'bg-red-900 text-white' : 'bg-red-50 text-red-800'}`}>
            {error}
          </div>
        ) : (
          <>
            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total Revenue</h3>
                <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Based on {filteredBookings.length} approved bookings
                </p>
              </div>

              <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Average Booking Value</h3>
                <p className="text-3xl font-bold">₹{averageBookingValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Per approved booking
                </p>
              </div>

              <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Top Performing Region</h3>
                {revenueByState.length > 0 ? (
                  <>
                    <p className="text-xl font-bold">{revenueByState[0].name}</p>
                    <p className="text-lg">₹{revenueByState[0].revenue.toLocaleString('en-IN')}</p>
                    <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      From {revenueByState[0].bookings} bookings
                    </p>
                  </>
                ) : (
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No data available</p>
                )}
              </div>
            </div>

            {/* Revenue Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* State Revenue Chart */}
              <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaMapMarkerAlt className="inline mr-2" /> Revenue by State
                </h3>
                {revenueByState.length > 0 ? (
                  <div className="h-80">
                    <Bar data={prepareStateChartData()} options={chartOptions} />
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-80">
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No state revenue data available</p>
                  </div>
                )}
              </div>

              {/* Location Revenue Chart */}
              <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaMapMarkerAlt className="inline mr-2" /> Revenue by Location
                </h3>
                {revenueByLocation.length > 0 ? (
                  <div className="h-80">
                    <Bar data={prepareLocationChartData()} options={chartOptions} />
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-80">
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No location revenue data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Performers Table */}
            <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Top Performing Hotels
              </h3>
              {topPerformers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th 
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            theme === 'dark' ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-50'
                          }`}
                        >
                          Hotel
                        </th>
                        <th 
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            theme === 'dark' ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-50'
                          }`}
                        >
                          Location
                        </th>
                        <th 
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            theme === 'dark' ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-50'
                          }`}
                        >
                          State
                        </th>
                        <th 
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            theme === 'dark' ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-50'
                          }`}
                        >
                          Revenue
                        </th>
                        <th 
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            theme === 'dark' ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-50'
                          }`}
                        >
                          Bookings
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {topPerformers.map((hotel, index) => (
                        <tr key={hotel._id} 
                          className={index % 2 === 0 
                            ? (theme === 'dark' ? 'bg-gray-800' : 'bg-white')
                            : (theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50')
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{hotel.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{hotel.locationName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{hotel.stateName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            ₹{hotel.revenue.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{hotel.bookings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-red p-6 text-center">
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No hotel revenue data available</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RevenuePanel;
