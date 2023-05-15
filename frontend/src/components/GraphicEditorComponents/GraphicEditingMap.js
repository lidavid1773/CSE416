import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import "leaflet-draw/dist/leaflet.draw-src.css";
import { useSelector } from 'react-redux';
import localgeojson from "../../maps/geojson (17).json";
import { useDispatch } from 'react-redux';
import { setGeojson } from '../../features/geojson/geojsonSlice';
import { setPolygons } from '../../features/GraphicEditorDropdown/graphicEditordropdownSlice';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter'
import { getBorderDashArray } from './Dropdown';
import { MARKER_TYPE, addMarker } from './MakerUtils';
import ColorLegend from './ColorLegend';
function Map() {
  const dispatch = useDispatch();
  const graphicEditor = useSelector((state) => state.graphicEditor);
  const graphicEditorRef = useRef({ ...graphicEditor });
  const { selectedColor } = graphicEditor;

  // const { geojson } = useSelector((state) => state.geojson);
  const [tempgeojson, setTempgeojson] = useState(localgeojson)

  const [map, setMap] = useState(null);
  const drawMap = () => {
    var drawnItems = new L.FeatureGroup();
    L.geoJSON(localgeojson, {
      onEachFeature: onEachFeature
    }).addTo(map);

    map.fitBounds(L.geoJson(tempgeojson).getBounds());
    map.addLayer(drawnItems);
  }



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
    let option = {polygon,e, map}
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
    dispatch(setPolygons({name,text,color}));


  }


  // useEffect(() => {
  //   if (!map) {
  //     createMap();
  //   }
  // }, []);
  // useEffect(() => {
  //   if(localgeojson){

  //   }
  //   // if (geojson) {
  //   //   console.log(geojson)
  //   //   drawMap();
  //   // }
  // }, [geojson])
  useEffect(() => {
    graphicEditorRef.current = { ...graphicEditor };
  }, [graphicEditor]);

  const createMap = () => {
    const newMap = L.map('map', {});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(newMap);
    new SimpleMapScreenshoter().addTo(newMap);
    return newMap;
  };
  useEffect(() => {
    if (tempgeojson) {
      const newMap = createMap();
      dispatch(setGeojson(tempgeojson));
      setMap(newMap);
    }
  }, [tempgeojson]);
  useEffect(() => {
    if (map)
      drawMap();
  }, [map]);
  return <div>
    {map && { selectedColor } && <ColorLegend map={map} />}
    <div id="map" style={{ height: '700px' }} />
  </div>




}

export default Map;