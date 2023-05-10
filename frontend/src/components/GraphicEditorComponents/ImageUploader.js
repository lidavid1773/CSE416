import React, { useState } from 'react';
import { Uploaded } from './Dropdown';
import { useSelector,useDispatch } from 'react-redux';
import { setStyle,setImages,setImagesIndex } from '../../features/GraphicEditorDropdown/graphicEditordropdownSlice';
const ImageUploader = ({ onImageUpload, onSelectedImageIndex, imageIndex}) => {
  const graphicEditor = useSelector((state) => state.graphicEditor);
  const dispatch = useDispatch();
  const handleImageUpload = (event) => {

    const files = event.target.files;
    const uploadedImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        uploadedImages.push(e.target.result);

        if (uploadedImages.length === files.length) {
          dispatch(setImages(uploadedImages))
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label htmlFor="image-upload">Upload Images:</label>
      <input id="image-upload" type="file" accept="image/*" multiple onChange={handleImageUpload} />
    </div>
  );
};

export default ImageUploader;
