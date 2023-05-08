import React, { useState } from 'react';
export function getBorderDashArray(borderStyle) {
  switch (borderStyle) {
    case 'dashed':
      return '5, 5';
    case 'dotted':
      return '1, 5';
    case 'double':
      return '5, 1';
    case 'groove':
      return '10, 5, 2, 5';
    case 'ridge':
      return '5, 2, 10, 5';
    case 'inset':
      return '5, 1';
    case 'outset':
      return '5, 5';
    default:
      return 'solid';
  }
}

export const StyleDropdownMenuType = {
  FONT_SIZE: 'fontSize',
  FONT_FAMILY: 'fontFamily',
  BACKGROUND_COLOR: 'backgroundColor',
  BORDER_STYLE: 'borderStyle',
  BORDER_COLOR: 'borderColor',
  BORDER_WEIGHT: 'weight',
};
export const ModeDropdownMenuType = {
  EDITING_MODE:"Editing Mode",
  DOWNLOADING_MODE:"DownLoad File",
}

export const Uploaded = {
  IMAGE: 'image',
}
export const InitState = {
  borderStyle: 'solid',
  borderColor: '#000000',
  fontFamily: 'Arial',
  fontSize: 12,
  backgroundColor: "#FFFFFF",
  weight: 1,
  editingMode:ModeDropdownMenuType.EDITING_MODE,
  downloadingMode:ModeDropdownMenuType.DOWNLOADING_MODE,
}
const fontFamily = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Comic Sans MS', 'Impact', 'Lucida Console'];
const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96];
const weightSizes = [1, 2, 3, 4, 5, 6];
const borderStyles = ["solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"]
const editingMode = ["Map Editing",'Graphic Editing'];
const downloadingMode = ["Export as GeoJSON","Export as SHP/DBF"];
const Dropdown = ({ DropdownMenuType, onStyleChange, colorSelection }) => {
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
          <option key={index} value={option} >
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
            return createDropdown(menuType, colorSelection);
          case DropdownMenuType.BORDER_STYLE:
            return createDropdown(menuType, borderStyles);
          case DropdownMenuType.BORDER_COLOR:
            return createDropdown(menuType, colorSelection);
          case DropdownMenuType.BORDER_WEIGHT:
            return createDropdown(menuType, weightSizes);
          case DropdownMenuType.EDITING_MODE:
            return createDropdown(menuType, editingMode);
          case DropdownMenuType.DOWNLOADING_MODE:
            return createDropdown(menuType, downloadingMode);
          default:
            return null;
        }
      })}
    </div>
  );
};

export default Dropdown;
