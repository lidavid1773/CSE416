import React, { useEffect, useRef } from 'react';
import L, { polygon } from 'leaflet';
import { useSelector } from 'react-redux';

const ColorLegend = ({ map }) => {
  const graphicEditor = useSelector((state) => state.graphicEditor);
  const {polygons} = graphicEditor;
  const controlRef = useRef(null);
  useEffect(() => {
    if (polygons.length > 0) {
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

          polygons.forEach((polygon) => {
            const {color,name,text} = polygon
            const icon = L.DomUtil.create('div');
            icon.innerHTML = `
            <div>
              <span style="background-color: ${color}; width: 60px; height: 20px; display: inline-block; "></span>
              <span style="display: flex; justify-content: left; align-items: left;">${name} : ${text}</span>
            </div>
          `;
            container.appendChild(icon);
          });

          return container;
        }
      });

      const controlInstance = new iconControl();
      controlRef.current = controlInstance;
      map.addControl(controlInstance);
    }
  }, [polygons]);

  return null;
};

export default ColorLegend;
