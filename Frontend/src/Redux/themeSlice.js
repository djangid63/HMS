import { createSlice } from "@reduxjs/toolkit";

// Get theme from localStorage or default to light
const initialState = {
  theme: localStorage.getItem('theme') || 'light'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      // Simply toggle between light and dark
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Save to localStorage
      localStorage.setItem('theme', state.theme);
    },
  },
});


export const { toggleTheme } = themeSlice.actions

export default themeSlice.reducer;