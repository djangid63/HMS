import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../Utils/api';

const State = () => {
  const [formData, setFormData] = useState({
    state: '',
    code: ''
  });

  const [state, setState] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [isDisable, setIsDisable] = useState(false)
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const token = localStorage.getItem('token')

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getActiveLocations = () => {
    if (!state.length) return [];

    const activeLocations = state.filter(item => !item.isDisable);

    const filteredLocations = activeLocations.filter(item =>
      item.state && item.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filteredLocations].sort((a, b) => {
      const aValue = String(a[sortField] || '').toLowerCase();
      const bValue = String(b[sortField] || '').toLowerCase();

      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  const getInactiveLocations = () => {
    if (!state.length) return [];

    const inactiveLocations = state.filter(item => item.isDisable);

    const filteredLocations = inactiveLocations.filter(item =>
      item.state && item.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filteredLocations].sort((a, b) => {
      const aValue = String(a[sortField] || '').toLowerCase();
      const bValue = String(b[sortField] || '').toLowerCase();

      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/state/getAllState`, config)
      setState(response.data.state)
      console.log(response.data.state);
    } catch (error) {
      console.error('Error fetching state:', error);
      showAlert('error', 'Failed to load state');
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [formData, setFormData]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.state || !formData.code) {
      showAlert('error', 'Please fill all fields');
      return;
    }

    try {
      if (editMode) {
        const response = await axios.patch(`${BASE_URL}/state/updateState/${currentId}`, formData, config);
        if (response.data.success) {
          showAlert('success', 'State updated successfully');
          fetchLocations();
        }
      } else {
        const response = await axios.post(`${BASE_URL}/state/addState`, formData, config);
        if (response.data.status) {
          showAlert('success', 'State Created successfully');
          fetchLocations();
        }
      }
      resetForm();
    } catch (error) {
      console.error('Error saving state:', error);
      showAlert('error', editMode ? 'Failed to update state' : 'Failed to add state');
    }
  };

  // Edit state
  const handleEdit = (state) => {
    setFormData({
      state: state.state,
      code: state.code
    });
    setEditMode(true);
    setCurrentId(state._id);
  };

  // Delete state
  const handleSoftDelete = async (id) => {
    if (window.confirm('Are you sure you want to change the status of this state?')) {
      try {
        const response = await axios.delete(`${BASE_URL}/state/softDelete/${id}`, config);
        showAlert('success', 'Successfully changed the state status');
        fetchLocations();
        setIsDisable(!isDisable)
      } catch (error) {
        console.error('Error updating state status:', error);
        showAlert('error', 'Failed to update state status');
      }
    }
  };
  const handleHardDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this state?')) {
      try {
        const response = await axios.delete(`${BASE_URL}/state/hardDelete/${id}`, config);
        if (response.data.success) {
          showAlert('success', 'Successfully Deleted the state');
          fetchLocations();
        }
      } catch (error) {
        console.error('Error deleting state:', error);
        showAlert('error', 'Failed to delete state');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ state: '', code: '' });
    setEditMode(false);
    setCurrentId(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Alert message */}
      {alert.show && (
        <div className={`p-3 mb-4 rounded ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {alert.message}
        </div>
      )}

      {/* Form section (25% height) */}
      <div className="bg-white rounded-lg shadow p-6 mb-6" style={{ flex: '0 0 auto' }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editMode ? 'Edit Location' : 'Add New Location'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
          <div className="w-full md:w-[calc(50%-0.5rem)]">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              State
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter name"
            />
          </div>

          <div className="w-full md:w-[calc(50%-0.5rem)]">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
              Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter code"
            />
          </div>

          <div className="w-full flex justify-end space-x-2 mt-4">
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {editMode ? 'Update Location' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>

      {/* Data table section */}
      <div className="bg-white rounded-lg shadow p-6 overflow-auto mb-6" style={{ flex: '1' }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Active Locations</h2>
          </div>

          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              {/* Search icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                >
                  State {sortField === 'name' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  onClick={() => handleSort('code')}
                  className="py-3 px-4 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                >
                  City {sortField === 'code' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="py-3 px-4 bg-gray-100 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getActiveLocations().length > 0 ? (
                getActiveLocations().map((state) => (
                  <tr key={state._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap">{state.state}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{state.code}</td>
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEdit(state)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleSoftDelete(state._id)}
                        className="text-yellow-600 hover:text-yellow-900 px-4"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => handleHardDelete(state._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                    No active state found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inactive Locations table section */}
      <div className="bg-white rounded-lg shadow p-6 overflow-auto" style={{ flex: '1' }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Inactive Locations</h2>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                >
                  State {sortField === 'name' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  onClick={() => handleSort('code')}
                  className="py-3 px-4 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                >
                  City {sortField === 'code' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="py-3 px-4 bg-gray-100 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getInactiveLocations().length > 0 ? (
                getInactiveLocations().map((state) => (
                  <tr key={state._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap">{state.state}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{state.code}</td>
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEdit(state)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleSoftDelete(state._id)}
                        className="text-green-600 hover:text-green-900 px-4"
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleHardDelete(state._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                    No inactive state found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default State;