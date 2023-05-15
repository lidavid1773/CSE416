import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useSelector } from 'react-redux';

const ColorLegend = ({ map }) => {
  const selectedColor = useSelector((state) => state.graphicEditor.selectedColor);
  const controlRef = useRef(null);

  useEffect(() => {
    if (selectedColor.length > 0) {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
      }

      const iconControl = L.Control.extend({
        options: {
          position: 'bottomleft' // Position the control at the bottom left corner
        },

        onAdd: function (map) {
          const container = L.DomUtil.create('div');
          container.className = 'color-legend';

          selectedColor.forEach((color) => {
            const icon = L.DomUtil.create('div', 'color-icon');
            icon.innerHTML = `<span style="background-color: ${color}; width: 40px; height: 20px; display: inline-block; "></span>`;
            container.appendChild(icon);
          });

          return container;
        }
      });

      const controlInstance = new iconControl();
      controlRef.current = controlInstance;
      map.addControl(controlInstance);
    }
  }, [map, selectedColor]);

  return null;
};

export default ColorLegend;
