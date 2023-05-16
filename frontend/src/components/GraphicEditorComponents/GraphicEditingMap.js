import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import "leaflet-draw/dist/leaflet.draw-src.css";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setPolygons } from '../../features/GraphicEditorDropdown/graphicEditordropdownSlice';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter'
import { getBorderDashArray } from './Dropdown';
import { MARKER_TYPE, addMarker } from './MakerUtils';
import ColorLegend from './ColorLegend';

function Map() {
  const dispatch = useDispatch();
  const graphicEditor = useSelector((state) => state.graphicEditor);
  const geojsonController = useSelector((state) => state.geojsonController);
  const { geojson } = geojsonController;
  const graphicEditorRef = useRef({ ...graphicEditor });
  const { selectedColor } = graphicEditor;

  const [map, setMap] = useState(null);
  const drawMap = () => {
    var drawnItems = new L.FeatureGroup();
    // let tempgeojson = geojson ? geojson : localgeojson;
    let tempgeojson = geojson;
    // console.log(map)
    if (map && tempgeojson) {
      L.geoJSON(tempgeojson, {
        onEachFeature: onEachFeature
      }).addTo(map);

      map.fitBounds(L.geoJson(tempgeojson).getBounds());
      map.addLayer(drawnItems);
    }

  }

  useEffect(() => {
    graphicEditorRef.current = { ...graphicEditor };
  }, [graphicEditor]);

  const createMap = () => {
    const newMap = L.map('map', {});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(newMap);
    new SimpleMapScreenshoter().addTo(newMap);
    setMap(newMap);
  };
  useEffect(() => {
    if (!map) {
      createMap();
    }
  }, []);

  useEffect(() => {
    if (geojson)
      drawMap();
  }, [geojson, map])


  const onEachFeature = (feature, polygon) => {
    const name = feature.properties.name;
    polygon.on("click", function (e) {
      applyNewStyle(polygon, e, name)
    })

  };
  const applyNewStyle = (polygon, e, name) => {
    const { weight, backgroundColor, borderColor, borderStyle, addText, images, imageIndex, fontSize, fontFamily, addTextState } = graphicEditorRef.current;
    const image = images[imageIndex];
    const style = {
      weight,
      fillColor: backgroundColor,
      color: borderColor,
      dashArray: getBorderDashArray(borderStyle),
    }
    polygon.setStyle(style);
    let option = { polygon, e, map }
    let text = addText
    if (image) {
      option.markerType = MARKER_TYPE.IMAGE;
      option.image = image;
      addMarker(option);
    }
    if (addTextState && text) {
      option.markerType = MARKER_TYPE.TEXT;
      option.text = text;
      option.style = {
        fontFamily,
        fontSize,
      }
      addMarker(option);
    }
    let color = style.fillColor
    dispatch(setPolygons({ name, text, color }));
  }

  return <div>
    {map && { selectedColor } && <ColorLegend map={map} />}
    <div id="map" style={{ height: '700px' }} />
  </div>
}

export default Map;