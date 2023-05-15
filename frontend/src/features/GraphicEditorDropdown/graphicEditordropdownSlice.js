import { createSlice } from '@reduxjs/toolkit';
import { ModeDropdownMenuType } from '../../components/GraphicEditorComponents/Dropdown';
import { polygon } from 'leaflet';

export const initialState = {
  selectedColor: [],
  borderStyle: 'solid',
  borderColor: '#000000',
  fontFamily: 'Arial',
  fontSize: 12,
  backgroundColor: "rgba(255, 255, 255, 0.5)",
  weight: 1,
  editingMode: ModeDropdownMenuType.EDITING_MODE,
  downloadingMode: "GeoJSON",
  images: [],
  imageIndex: -1,
  addTextState: false,
  addText: "",
  polygons:[],
};

export const graphicEditorSlice = createSlice({
  name: "graphicEditor",
  initialState,
  reducers: {
    setStyle: (state, action) => {
      const { type, value } = action.payload;
      // console.log('action.payload :', action.payload);
    
      state[type] = value;
    },
    setImages: (state, action) => {
      state.images = [...state.images, ...action.payload];
      graphicEditorSlice.caseReducers.setImagesIndex(state, { payload: state.images.length - 1 });
    },
    setImagesIndex: (state, action) => {
      state.imageIndex = action.payload;
    },
    setAddTextState: (state, action) => {
      state.addTextState = action.payload;
    },
    setAddText: (state, action) => {
      state.addText = action.payload;
    },
    setSelectedColor: (state, action) => {
      state.selectedColor = state.selectedColor.concat(action.payload);
    },
    setPolygons: (state, action) => {
      const { name } = action.payload;
    
      const updatedPolygons = state.polygons.map(polygon => {
        if (polygon.name === name) {
          return action.payload; // Update the matching polygon
        }
        return polygon; // Keep the original polygon
      });
    
      if (!updatedPolygons.some(polygon => polygon.name === name)) {
        updatedPolygons.push(action.payload); // Add the new polygon if not found
      }
    
      return {
        ...state,
        polygons: updatedPolygons
      };
    },
    
  },
});

export const { setStyle, setImages, setImagesIndex, setAddTextState, setAddText, setSelectedColor,setPolygons} = graphicEditorSlice.actions;
export default graphicEditorSlice.reducer;
