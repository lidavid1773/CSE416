import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/users/userSlice";
import mapReducer from "../features/maps/mapSlice";
import commentReducer from "../features/comments/commentSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    maps: mapReducer,
    comments: commentReducer
  }
});
