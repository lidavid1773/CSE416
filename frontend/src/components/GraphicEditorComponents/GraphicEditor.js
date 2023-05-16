/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import ImageUploader from "./ImageUploader";
import { SketchPicker } from 'react-color'
import Dropdown, { StyleDropdownMenuType } from './Dropdown';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStyle, setImagesIndex, setSelectedColor } from '../../features/GraphicEditorDropdown/graphicEditordropdownSlice';
import AddText from './AddText';
export default function GraphicEditor() {
    const [SketchPickerBackgroundColor, setBackgroundColor] = useState('#fff');
    const graphicEditor = useSelector((state) => state.graphicEditor);
    const dispatch = useDispatch();
    const { fontSize, fontFamily, weight, borderStyle, borderColor, backgroundColor, images, imageIndex,selectedColor } = graphicEditor;
    const handleImageClick = (index) => {
        if (imageIndex === index) {
            dispatch(setImagesIndex(-1))
        }
        else {
            dispatch(setImagesIndex(index))
        }
    };

    const handleChangeComplete = (color) => {
        setBackgroundColor(color.rgb);
        const value = rgbaToString(color.rgb);
        dispatch(setStyle({ type: "backgroundColor", value }))
        dispatch(setSelectedColor( value ))
        // setHasSelectedColors((prevColor) => [value, ...prevColor]);
    };
    const rgbaToString = (rgba) => `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

    return (
        <div>
            <div>
                {
                    <div>
                        <AddText></AddText>
                        <ImageUploader />
                        {images.map((imageUrl, index) => (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`Uploaded image ${index}`}
                                style={{ maxWidth: '200px', maxHeight: '200px', border: imageIndex === index ? '2px solid blue' : 'none' }}
                                onClick={() => handleImageClick(index)}
                            />
                        ))}
                        <SketchPicker style={{ height: '200px' }} color={SketchPickerBackgroundColor}
                            onChangeComplete={handleChangeComplete} />
                        <h1 style={{
                            fontSize: `${fontSize}px`,
                            fontFamily,
                            border: `${weight}px ${borderStyle} ${borderColor}`,
                            background: backgroundColor,
                        }}>
                            Style output
                        </h1>
                        <Dropdown DropdownMenuType={StyleDropdownMenuType} colorSelection={selectedColor }  ></Dropdown>
                    </div>}

            </div></div>
    )
}
