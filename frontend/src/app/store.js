import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/users/userSlice";
import mapReducer from "../features/maps/mapSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    maps: mapReducer,
  },
});
