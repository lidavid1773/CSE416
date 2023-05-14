import { createSlice } from '@reduxjs/toolkit';
import { ModeDropdownMenuType } from '../../components/GraphicEditorComponents/Dropdown';
export const initialState = {
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
  addTextState:false,
  addText:"",
};

export const graphicEditorSlice = createSlice({
  name: "graphicEditor",
  initialState,
  reducers: {
    setStyle: (state, action) => {
      const { type, value } = action.payload;
      state[type] = value;
    },
    setImages: (state, action) => {
      state.images = [...state.images, ...action.payload];
      graphicEditorSlice.caseReducers.setImagesIndex(state,{ payload:state.images.length - 1});
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
  },
});

export const { setStyle, setImages, setImagesIndex,setAddTextState,setAddText } = graphicEditorSlice.actions;
export default graphicEditorSlice.reducer;
