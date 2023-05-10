import React, { useEffect, useState } from 'react';
import L, { DrawMap, geoJson } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import "leaflet-draw/dist/leaflet.draw-src.css";
import { useSelector } from 'react-redux';
import localgeojson from "../maps/geojson (17).json";
import { useDispatch } from 'react-redux';
import { setGeojson } from '../features/geojson/geojsonSlice';
function Map() {
  const dispatch = useDispatch();
  // const { geojson } = useSelector((state) => state.geojson);
  const [tempgeojson,setTempgeojson] = useState(localgeojson)
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
      // if (selectedPolygon)
      //   selectedPolygon.editing.disable();
      // selectedPolygon = e.target;
      // e.target.editing.enable();
      // applyNewStyle(polygon, e)
    });
  }


  const createMap = () => {

    map = L.map('map', {
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map);
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
    if (tempgeojson) {
        createMap();
        drawMap();
        dispatch(setGeojson(tempgeojson));
    }
  }, [tempgeojson]);
  return <div id="map" style={{ height: '500px' }} />;
}

export default Map;