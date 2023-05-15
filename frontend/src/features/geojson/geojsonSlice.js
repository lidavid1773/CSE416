import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  geojson: null,
  regions: [],
  isError: false,
  isSuccess: false,
  message: "",
};

const geojsonSlice = createSlice({
  name: "geojson",
  initialState,
  reducers: {
    setGeojson: (state, action) => {
      state.geojson = action.payload;
    },
    deleteRegion: (state, action) => {
      const { regionId } = action.payload;
      state.regions = state.regions.filter((r) => r.id !== regionId);
    },
    mergeRegion: (state, action) => {
      const { regionId } = action.payload;
      state.regions = state.regions.map((r) =>
        r.id === regionId ? { ...r, merged: true } : r
      );
    },
  },
});

export const { setGeojson, deleteRegion, mergeRegion } = geojsonSlice.actions;

export default geojsonSlice.reducer;
