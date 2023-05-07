import React, { useState } from 'react';

const ImageUploader = () => {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        uploadedImages.push(e.target.result);
        if (uploadedImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...uploadedImages]);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label htmlFor="image-upload">Upload Images:</label>
      <input id="image-upload" type="file" accept="image/*" multiple onChange={handleImageUpload} />
        <div>
        {images.map((imageUrl, index) => (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img key={index} src={imageUrl} alt={`Uploaded image ${index}`} style={{ maxWidth: '200px', maxHeight: '200px' }} />
      ))}
        </div>
     
    </div>
  );
};

export default ImageUploader;
