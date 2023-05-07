import React from 'react';

const BorderDropdown = ({ selectedStyle, onStyleChange }) => {
    const borderStyles = {
        solid: 'Solid',
        dashed: 'Dashed',
        dotted: 'Dotted',
        double: 'Double',
        groove: 'Groove',
        ridge: 'Ridge',
        inset: 'Inset',
        outset: 'Outset',
    };
    const handleChange = (event) => {
        console.log(event.target.value)
        onStyleChange(event.target.value);
    };

    return (
        <div>
            <label htmlFor="border-style">Border Style:</label>
            <select id="border-style" value={selectedStyle} onChange={handleChange}>
                {Object.keys(borderStyles).map((style) => (
                    <option key={style} value={style} style={{borderStyle:`${borderStyles[style]}`}}>
                        {borderStyles[style]}
                        <div > </div>
                    </option>
                ))}
            </select>
        </div>
    );
};

export default BorderDropdown;
