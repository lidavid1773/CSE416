import { createSlice } from '@reduxjs/toolkit';
import { ModeDropdownMenuType } from '../../components/GraphicEditorComponents/Dropdown';
export const initialState = {
    borderStyle: 'solid',
    borderColor: '#000000',
    fontFamily: 'Arial',
    fontSize: 12,
    backgroundColor: "#FFFFFF",
    weight: 1,
    editingMode: ModeDropdownMenuType.EDITING_MODE,
    downloadingMode: "GeoJSON",
    images:[],
  };
  export const graphicEditorSlice = createSlice({
    name: "graphicEditor",
    initialState,
    reducers: {
      setStyle: (state, action) => {
        const { type, value } = action.payload;
        state[type]= value;
     
      },
      setImages: (state, action) => {
        state.images.push(action.payload);
      },
    },
  });
  
  export const { setStyle,setImages } = graphicEditorSlice.actions;
  export default graphicEditorSlice.reducer;
  