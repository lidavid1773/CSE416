import React, { useEffect, useState, useRef } from 'react';
import L, { DrawMap, geoJson } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import "leaflet-draw/dist/leaflet.draw-src.css";
import { useSelector } from 'react-redux';
import localgeojson from "../maps/geojson (17).json";
import { useDispatch } from 'react-redux';
import { setGeojson } from '../features/geojson/geojsonSlice';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter'
import { getBorderDashArray } from './GraphicEditorComponents/Dropdown';
import { Uploaded } from './GraphicEditorComponents/Dropdown';
import { initialState } from '../features/GraphicEditorDropdown/graphicEditordropdownSlice';
function Map() {
  const dispatch = useDispatch();
  const graphicEditor = useSelector((state) => state.graphicEditor);
  const graphicEditorRef = useRef({ ...graphicEditor });
  // const { geojson } = useSelector((state) => state.geojson);
  const [tempgeojson, setTempgeojson] = useState(localgeojson)
  var selectedPolygon;
  // const [map, setMap] = useState(null);
  let map;
  const drawMap = () => {
    var drawnItems = new L.FeatureGroup();
    tempgeojson.features.forEach(function (currentFeature) {
      if (currentFeature.geometry.type === "MultiPolygon") {
        currentFeature.geometry.coordinates.forEach(function (currentCoordinate) {
          currentCoordinate.forEach(poly => convertToPolygon(poly, drawnItems));
        })
      } else {
        currentFeature.geometry.coordinates.forEach(poly => convertToPolygon(poly, drawnItems));
      }
    });
    map.fitBounds(L.geoJson(tempgeojson).getBounds());
    map.addLayer(drawnItems);
  }


  const convertToPolygon = (poly, drawnItems) => {
    var polygon = L.polygon(L.GeoJSON.coordsToLatLngs(poly)).addTo(map);
    drawnItems.addLayer(polygon);
    polygon.on('click', function (e) {
      if (selectedPolygon)
        selectedPolygon.editing.disable();
      selectedPolygon = e.target;
      e.target.editing.enable();
      applyNewStyle(polygon, e)
    });
  }
  const applyNewStyle = (polygon, e) => {
    const { weight, backgroundColor, borderColor, borderStyle } = graphicEditorRef.current;

    polygon.setStyle({
      weight,
      fillColor: backgroundColor,
      color: borderColor,
      dashArray: getBorderDashArray(borderStyle),
    })
    addImageMarker(polygon, e);
  }
  const addImageMarker = (polygon, e) => {
    const images = graphicEditorRef.current.images
    const index = graphicEditorRef.current.imageIndex
    const image = images[index];
    if (image) {
      const icon = L.icon({
        iconUrl: image,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const marker = L.marker(e.latlng, { icon }).addTo(map);
      if (!polygon.imageMarkers) {
        polygon.imageMarkers = []
      }
      polygon.imageMarkers.push(marker);
    }
  }
  const createMap = () => {

    map = L.map('map', {
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map);
    new SimpleMapScreenshoter().addTo(map);
    // setMap(map);
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

  useEffect(() => {
    if (tempgeojson) {
      createMap();
      drawMap();
      dispatch(setGeojson(tempgeojson));
    }
  }, [tempgeojson]);
  return <div id="map" style={{ height: '500px' }} />;
}

export default Map;