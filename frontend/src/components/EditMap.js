import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import "leaflet-draw/dist/leaflet.draw-src.css";
import localgeojson from "../maps/ukraine.json";

function Map() {
  // const [map, setMap] = useState(null);
  const [geojson, setgeojson] = useState(null);
  var map;
 
  useEffect(() => {
    const fetchData = async () => {
      if (localgeojson) {
        setgeojson(localgeojson);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (geojson) {
      map = L.map('map', {
        // drawControl: true,
      });
     
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(map);
      // geojsonLayer = L.geoJson(geojson).addTo(map);
      // geojsonLayer.eachLayer(layer => {
      //   if (layer instanceof L.Polyline) {
      //     layer.enableEdit();
      //   }
      // });
      // geojsonLayer = L.geoJson(geojson, { 
      //                           onEachFeature: function popUp(features, layer) { selectVerticesMode(features, layer); } 
      //                         }).addTo(map);
      var drawnItems = new L.FeatureGroup();
      geojson.features.forEach(function(currentFeature){
          var polygon = L.polygon(L.GeoJSON.coordsToLatLngs(currentFeature.geometry.coordinates[0])).addTo(map);
          // polygon.enableEdit();
          map.fitBounds(polygon.getBounds());
          drawnItems.addLayer(polygon);
      });
      map.addLayer(drawnItems); 
      var drawControl = new L.Control.Draw({
        draw: false,
        edit: {
            featureGroup: drawnItems
        }
      });;
      map.addControl(drawControl);
      // const bounds = geojsonLayer.getBounds();
      // map.fitBounds(bounds);
      // vertexLayer = L.layerGroup();
      // map.addLayer(vertexLayer);
    }
  }, [geojson]);

  return <div id="map" style={{ height: '500px' }} />;
}

export default Map;