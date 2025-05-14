import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setBackgroundImage } from '../../Redux/themeSlice';
import { FaMoon, FaSun, FaImage } from 'react-icons/fa';

import darkImg1 from '../../../public/Images/DarkImg1.jpg';
import darkImg2 from '../../../public/Images/DarkImg2.jpg';
import darkImg3 from '../../../public/Images/DarkImg3.jpg';
import darkImg4 from '../../../public/Images/DarkImg4.jpg';
import lightImg1 from '../../../public/Images/LightImg1.jpg';
import lightImg2 from '../../../public/Images/LightImg2.jpg';
import lightImg3 from '../../../public/Images/LightImg3.jpg';

const Settings = () => {
  const dispatch = useDispatch();
  const { theme, backgroundImage } = useSelector((state) => state.theme);
  const [selectedImage, setSelectedImage] = useState(backgroundImage);

  const backgroundOptions = [
    { id: 1, name: "None", url: "" },
    { id: 2, name: "Dark Image 1", url: darkImg1 },
    { id: 3, name: "Dark Image 2", url: darkImg2 },
    { id: 4, name: "Dark Image 3", url: darkImg3 },
    { id: 5, name: "Dark Image 4", url: darkImg4 },
    { id: 6, name: "Light Image 1", url: lightImg1 },
    { id: 7, name: "Light Image 2", url: lightImg2 },
    { id: 8, name: "Light Image 3", url: lightImg3 },
  ];

  // Apply background image to body when changed

  const handleBackgroundSelect = (url) => {
    let bgImgPath = url.replace('/public', '')

    setSelectedImage(bgImgPath);
    dispatch(setBackgroundImage(bgImgPath));
  };

  return (
    <div style={{ backgroundImage: `url(${selectedImage})`, backgroundSize: 'cover' }} className={`settings-container p-5 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-5 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Settings</h2>

      <div className="theme-section">
        <h3 className={`text-lg font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Theme</h3>
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${theme === 'light'
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
            }`}
        >
          {theme === 'light' ? <FaMoon className="mr-2 text-indigo-700" /> : <FaSun className="mr-2 text-yellow-400" />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>

      {/* Background Image Section */}
      <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <FaImage className="inline mr-2" /> Background Image
        </h3>
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Select a background image for your application
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {backgroundOptions.map((bg) => (
            <div
              key={bg.id}
              onClick={() => handleBackgroundSelect(bg.url)}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedImage === bg.url
                ? 'border-indigo-500 shadow-lg transform scale-105'
                : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
            >
              {bg.url ? (
                <div className="relative h-24">
                  <img
                    src={bg.url}
                    alt={bg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${selectedImage === bg.url ? 'bg-opacity-20' : ''
                    }`}></div>
                </div>
              ) : (
                <div className={`h-24 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>None</span>
                </div>
              )}
              <div className={`p-2 text-center text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'
                }`}>
                {bg.name}
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <button
            onClick={() => handleBackgroundSelect("")}
            className={`mt-4 px-4 py-2 text-sm rounded-md ${theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
          >
            Clear Background
          </button>
        )}
      </div>

      <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Notifications</h3>
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="emailNotifications"
            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
          />
          <label htmlFor="emailNotifications" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            Email notifications
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="smsNotifications"
            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
          />
          <label htmlFor="smsNotifications" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            SMS notifications
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;