import { configureStore } from "@reduxjs/toolkit";
import themeReducer from '../Redux/themeSlice'

const store = configureStore({
  reducer: {
    theme: themeReducer
  }
})

export default store