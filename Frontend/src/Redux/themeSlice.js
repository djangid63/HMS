import { createSlice } from "@reduxjs/toolkit";

// Get theme and background from localStorage or default values
const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  backgroundImage: localStorage.getItem('backgroundImage') || ''
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setBackgroundImage: (state, action) => {
      state.backgroundImage = action.payload;
      localStorage.setItem('backgroundImage', action.payload);
    },
  },
});


export const { toggleTheme, setBackgroundImage } = themeSlice.actions

export default themeSlice.reducer;