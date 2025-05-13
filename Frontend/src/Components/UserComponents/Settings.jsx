import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../Redux/themeSlice';
import { FaMoon, FaSun } from 'react-icons/fa';

const Settings = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className="settings-container p-5">
      <h2 className="text-2xl font-bold mb-5">Settings</h2>

      <div className="theme-section">
        <h3 className="text-lg font-medium mb-3">Theme</h3>
        <button
          onClick={() => dispatch(toggleTheme())}
          className="flex justify-center items-center"
        >
          {theme === 'light' ? <FaMoon className="mr-2" /> : <FaSun className="mr-2" />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </div>
  );
};

export default Settings;