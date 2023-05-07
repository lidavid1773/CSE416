import React, { useState } from 'react';

const DropdownMenuType = {
  FONT_SIZE: 'Font Size',
  FONT_FAMILY: 'Font Family',
  BACKGROUND_COLOR: 'Background Color',
  BORDER_STYLE: 'Border Style',
  BORDER_COLOR: 'Border Color'
};
const fontFamily = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Comic Sans MS', 'Impact', 'Lucida Console'];
const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96];
const borderStyles = [
  'Solid',
  'Dashed',
  'Dotted',
  'Double',
  'Groove',
  'Ridge',
  'Inset',
  'Outset'
];

const Dropdown = ({ onStyleChange, colorSelection }) => {
  const [selectedStyle, setSelectedStyle] = useState({});

  const handleChange = (event, menuType) => {
    const value = event.target.value;
    setSelectedStyle(prevState => ({ ...prevState, [menuType]: value }));
    onStyleChange(menuType, value);
  };

  const createDropdown = (menuType, menuList) => (
    <div key={menuType}>
      <label htmlFor={menuType}>{menuType}: </label>
      <select
        className="form-select"
        id={menuType}
        value={selectedStyle[menuType] || ''}
        onChange={e => handleChange(e, menuType)}
      >
        {menuList.map((option, index) => (
          <option key={index} value={option} style={{ backgroundColor: '#ff0000' }}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      {Object.values(DropdownMenuType).map(menuType => {
        switch (menuType) {
          case DropdownMenuType.FONT_SIZE:
            return createDropdown(menuType, fontSizes);
          case DropdownMenuType.FONT_FAMILY:
            return createDropdown(menuType, fontFamily);
          case DropdownMenuType.BACKGROUND_COLOR:
            return createDropdown(menuType, colorSelection.reverse() );
          case DropdownMenuType.BORDER_STYLE:
            return createDropdown(menuType, borderStyles);
          case DropdownMenuType.BORDER_COLOR:
            return createDropdown(menuType, colorSelection );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default Dropdown;
