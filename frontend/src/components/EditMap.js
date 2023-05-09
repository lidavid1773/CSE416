import React, { useEffect, useState } from 'react';
import L, { DrawMap, geoJson } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import "leaflet-draw/dist/leaflet.draw-src.css";
import localgeojson from "../maps/ukraine.json";
import { useSelector } from 'react-redux';
function Map() {


  const drawMap = () => {
    var drawnItems = new L.FeatureGroup();
    
    geojson.features.forEach(function (currentFeature) {
      if (currentFeature.geometry.type === "MultiPolygon") {
        currentFeature.geometry.coordinates.forEach(function (currentCoordinate) {
          currentCoordinate.forEach(poly => convertToPolygon(poly, drawnItems));
        })
      } else {
        currentFeature.geometry.coordinates.forEach(poly => convertToPolygon(poly, drawnItems));
      }
    });
    map.fitBounds(L.geoJson(geojson).getBounds());
    map.addLayer(drawnItems);
  }


  const { geojson } = useSelector((state) => state.geojson);
  const convertToPolygon = (poly, drawnItems) => {
    var polygon = L.polygon(L.GeoJSON.coordsToLatLngs(poly)).addTo(map);
    drawnItems.addLayer(polygon);

    polygon.on('click', function (e) {
      // if (selectedPolygon)
      //   selectedPolygon.editing.disable();
      // selectedPolygon = e.target;
      // e.target.editing.enable();
      // applyNewStyle(polygon, e)
    });
  }

  const [map, setMap] = useState(null);

  const createMap = () => {

    const map = L.map('map', {
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map);
    setMap(map);
  }
  useEffect(() => {
    if (!map) {
      createMap();
    }
  }, []);
  useEffect(() => {
    if (geojson) {
      console.log(geojson);
      console.log(geojson.type);
      // drawMap();
    }

  }, [geojson])
  return <div id="map" style={{ height: '500px' }} />;
}

export default Map;