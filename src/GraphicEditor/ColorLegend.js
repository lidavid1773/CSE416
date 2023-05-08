import React from 'react';

const ColorLegend = ({ colors }) => (
    <div>
        {colors&&colors.map((color, index) => (
            <span key={index} style={{ backgroundColor: color, width: '150px', height: '20px', display: 'inline-block', marginRight: '5px' }}>
                {color}
            </span>
        ))}
    </div>
);

export default ColorLegend;