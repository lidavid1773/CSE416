import React from 'react';

const FontSizeDropdown = ({ selectedSize, onSizeChange }) => {
  // Create an array of font sizes to map over
  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96];

  // Map over the font sizes array to create the dropdown options
  const options = fontSizes.map((size) => (
    <option key={size} value={size}>
      {size}
    </option>
  ));

  // Handle the change event when the user selects a new font size
  const handleChange = (event) => {
    const newSize = parseInt(event.target.value);
    onSizeChange(newSize);
  };

  return (
    <div>
      <label htmlFor="font-size-dropdown">Font Size:</label>
      <select id="font-size-dropdown" value={selectedSize} onChange={handleChange}>
        {options}
      </select>
    </div>
  );
};

export default FontSizeDropdown;
