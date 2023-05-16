import React, { useState } from 'react';
import shpwrite from 'shp-write';
import process from 'process';
import { download } from '@crmackey/shp-write'
import { useSelector, useDispatch } from 'react-redux';
import { setStyle } from '../../features/GraphicEditorDropdown/graphicEditordropdownSlice';
const FileSaver = require('file-saver');

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
  EDITING_MODE: "Editing Mode",
}
export const DownloadDropdownMenuType = {
  DOWNLOADING_MODE: "Export as",
}
export const Uploaded = {
  IMAGE: 'image',
}

const fontFamily = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Comic Sans MS', 'Impact', 'Lucida Console'];
const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96];
const weightSizes = [1, 2, 3, 4, 5, 6];
const borderStyles = ["solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"]
const editingMode = ["Map Editing", 'Graphic Editing'];
const downloadingMode = ["GeoJSON", "SHP/DBF"];
const Dropdown = ({ DropdownMenuType, colorSelection }) => {
  const geojson = useSelector(state => state.geojsonController.geojson);
  const dispatch = useDispatch();
  const graphicEditor = useSelector(state => state.graphicEditor);
  const [selectedStyle, setSelectedStyle] = useState({});
  const handleChange = (event, type) => {
    const value = event.target.value;
    setSelectedStyle(prevState => ({ ...prevState, [type]: value }));
    dispatch(setStyle({type, value}));
  };
  const handleGeoJSONExport = (geojson) => {
    console.log(geojson)
    const json = JSON.stringify(geojson, null, 2);
    var fileToSave = new Blob([json], {
      type: 'application/json'
    });
    FileSaver.saveAs(fileToSave, "geojson.json")
  }
  // console.log(process) 
  const handleSHPExport = () => {
    console.log(geojson)
    download(geojson);
  }
  const fileExport = () => {
    // console.log(dropdownRef.current[DownloadDropdownMenuType.DOWNLOADING_MODE] )

    const data = geojson;
    if (graphicEditor[DownloadDropdownMenuType.DOWNLOADING_MODE] === "SHP/DBF") {
      console.log("shp")
      handleSHPExport()
    }
    else {
      console.log("geo")
      handleGeoJSONExport(data);
    }
  }
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
      {menuType === DownloadDropdownMenuType.DOWNLOADING_MODE && <button onClick={() => fileExport()} className="upload-button">Download</button>}


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
