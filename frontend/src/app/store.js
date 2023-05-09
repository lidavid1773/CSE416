import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/users/userSlice";
import mapReducer from "../features/maps/mapSlice";
import commentReducer from "../features/comments/commentSlice";
import geojsonRedcuer from "../features/geojson.js/geojsonSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    maps: mapReducer,
    comments: commentReducer,
    geojson:geojsonRedcuer,
  }
});
