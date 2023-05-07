import React, { useState } from 'react';

const ImageUploader = ({ onImageUpload}) => {
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        uploadedImages.push(e.target.result);
        if (uploadedImages.length === files.length) {
          onImageUpload(uploadedImages);
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
