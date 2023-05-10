/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import ImageUploader from "./GraphicEditorComponents/ImageUploader";
import { SketchPicker } from 'react-color'
import ColorLegend from './GraphicEditorComponents/ColorLegend';
import Dropdown, { getBorderDashArray, Uploaded, StyleDropdownMenuType, ModeDropdownMenuType, DownloadDropdownMenuType } from './GraphicEditorComponents/Dropdown';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter'
import { useState, useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { setStyle } from '../features/GraphicEditorDropdown/graphicEditordropdownSlice';
export default function GraphicEditor() {
    const [SketchPickerBackgroundColor, setBackgroundColor] = useState('#fff');
    const graphicEditor = useSelector((state) => state.graphicEditor);
    const dispatch = useDispatch();
    const { fontSize, fontFamily, weight, borderStyle, borderColor, backgroundColor } = graphicEditor;

    const initImageIndex = -1;
    const [selectedImageIndex, setSelectedImageIndex] = useState(initImageIndex);
    const [hasSelectedColors, setHasSelectedColors] = useState([]);
    const [images, setImages] = useState([]);
    const handleImageClick = (index) => {
        if (graphicEditor[Uploaded.IMAGE]) {
            graphicEditor[Uploaded.IMAGE] = undefined
            setSelectedImageIndex(initImageIndex);
        }
        else {
            graphicEditor[Uploaded.IMAGE] = images[index];
            setSelectedImageIndex(index);
        }

    };
    const handleImageUpload = (uploadedImages) => {
        setImages((prevImages) => [...prevImages, ...uploadedImages]);
    };
    const handleChangeComplete = (color) => {
        setBackgroundColor(color.rgb);
        const newColorString = rgbaToString(color.rgb);
        dispatch(setStyle({type:backgroundColor,newColorString}))
        setHasSelectedColors((prevColor) => [newColorString, ...prevColor]);
    };
    const rgbaToString = (rgba) => `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

    return (
        <div>
            <div>

                {
                    <div>
                        <ImageUploader onImageUpload={handleImageUpload} onSelectedImageIndex={setSelectedImageIndex} imageIndex={selectedImageIndex} graphicRef={graphicEditor} />
                        {images.map((imageUrl, index) => (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`Uploaded image ${index}`}
                                style={{ maxWidth: '200px', maxHeight: '200px', border: selectedImageIndex === index ? '2px solid blue' : 'none' }}
                                onClick={() => handleImageClick(index)}
                            />
                        ))}
                        <SketchPicker style={{ height: '200px' }} color={SketchPickerBackgroundColor}
                            onChangeComplete={handleChangeComplete} />
                        <ColorLegend colors={hasSelectedColors} />
                        <h1 style={{
                            fontSize: `${fontSize}px`,
                            fontFamily,
                            border: `${weight}px ${borderStyle} ${borderColor}`,
                            background: backgroundColor,
                        }}>
                            Style output
                        </h1>
                        <Dropdown DropdownMenuType={StyleDropdownMenuType} colorSelection={hasSelectedColors}  ></Dropdown>
                    </div>}

            </div></div>
    )
}
