import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  geojson: null,
};

const geojsonSlice = createSlice({
  name: "geojsonController",
  initialState,
  reducers: {
    setGeojson: (state, action) => {
      //console.log(action.payload)
      state.geojson = action.payload;
    },
    setCoordinates: (state, action) => {
      // console.log(action.payload);
      const {featureIndex, multiIndex, polyIndex, isMulti, newCoords} = action.payload;
      if (isMulti)
        state.geojson.features[featureIndex].geometry.coordinates[multiIndex][polyIndex] = newCoords;
      else 
        state.geojson.features[featureIndex].geometry.coordinates[polyIndex] = newCoords;
    },
    setNewRegion: (state, action) => {
      //console.log(action.payload)
      state.geojson.features.push(action.payload.newRegion);
    },
  },
});

export const { setGeojson, setCoordinates, setNewRegion } = geojsonSlice.actions;
export default geojsonSlice.reducer;
