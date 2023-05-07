import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

const fontStyles = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Comic Sans MS', 'Impact', 'Lucida Console'];

const FontStyleSelector = ({ selectedStyle, onStyleChange }) => {
  const handleChange = (event) => {
    const selectedStyle = event.target.value;
    onStyleChange(selectedStyle);
  };

  return (
    <div>
      <label htmlFor="font-style">Font Family:</label>
      <select 
        className="form-select" 
        id="font-style" 
        value={selectedStyle} 
        onChange={handleChange}
        style={{ fontFamily: selectedStyle }}>,
        {fontStyles.map((style, index) => (
          <option key={index} value={style}>
            {style}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontStyleSelector;
