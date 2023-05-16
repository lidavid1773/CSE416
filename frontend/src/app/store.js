import { configureStore } from "@reduxjs/toolkit";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from "../features/users/userSlice";
import mapReducer from "../features/maps/mapSlice";
import commentReducer from "../features/comments/commentSlice";
import geojsonReducer from "../features/geojson/geojsonSlice";
import graphicEditordropdownReducer from "../features/GraphicEditorDropdown/graphicEditordropdownSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    maps: mapReducer,
    comments: commentReducer,
    geojsonController: geojsonReducer,
    graphicEditor:graphicEditordropdownReducer,

  }
});
