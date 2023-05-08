import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import "leaflet-draw/dist/leaflet.draw-src.css";
import localgeojson from "../maps/ukraine.json";


function Map() {
  const [geojson, setgeojson] = useState(null);
  const actionHistoryRef = useRef([]); 
  const mapRef = useRef(null);
  const drawnItemsRef = useRef(null);
  const editHistory = useRef({});

  function undoFunction() {
    console.log("undo");
    const drawnItems = drawnItemsRef.current;
    const actionHistory = actionHistoryRef.current;
    if (drawnItems && actionHistory.length > 0) {
      const lastAction = actionHistory.pop();
      if (lastAction.type === 'created') {
        drawnItems.eachLayer((layer) => {
          const layerId = L.stamp(layer);
          if (layerId === lastAction.layerId) {
            drawnItems.removeLayer(layer);
          }
        });
      } else if (lastAction.type === 'edited') {
        drawnItems.eachLayer((layer) => {
          const layerId = L.stamp(layer);
          if (layerId === lastAction.layerId) {
            const latLngs = lastAction.before.geometry.coordinates[0].map(([lng, lat]) => L.latLng(lat, lng));
            layer.setLatLngs(latLngs);
            layer.redraw();
          }
        });
      }
    }
  }
 
  useEffect(() => {
    const fetchData = async () => {
      if (localgeojson) {
        const map = L.map('map');
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        }).addTo(map);

        const drawnItems = new L.FeatureGroup();
        drawnItemsRef.current = drawnItems;
        map.addLayer(drawnItems);

        const drawControl = new L.Control.Draw({
          draw: {
            polyline: false,
            polygon: true,
            circle: false,
            marker: false,
            circlemarker: false,
            rectangle: true,
          },
          edit: {
            featureGroup: drawnItems,
          },
        });
        map.addControl(drawControl);

        map.on('draw:created', (e) => {
          console.log('created');
          const layer = e.layer;
          const layerId = L.stamp(layer);

          // Add the layer to the feature group
          drawnItems.addLayer(layer);

          // Initialize the layer history
          console.log(layerId);
          editHistory.current[layerId] = [];
          actionHistoryRef.current.push({ type: 'created', layerId });
        });

        map.on('draw:editstart', (e) => {
          console.log('editstart');
          const drawnItems = drawnItemsRef.current;
        
          drawnItems.eachLayer((layer) => {
            const layerId = L.stamp(layer);
            console.log(editHistory.current);
            // Save the layer state before editing to the history
            editHistory.current[layerId] = [...(editHistory.current[layerId] || []), layer.toGeoJSON()];
          });
        });

        map.on('draw:edited', (e) => {
          console.log('edited');
          const layers = e.layers;

          layers.eachLayer((layer) => {
            const layerId = L.stamp(layer);
            const before = editHistory.current[layerId].slice(-1)[0];
            const after = layer.toGeoJSON();
            // Save the layer state after editing to the history
            editHistory.current[layerId] = [...(editHistory.current[layerId] || []), after];
            actionHistoryRef.current.push({ type: 'edited', layerId, before, after });
            console.log(actionHistoryRef.current);  
          });
        });
        
        setgeojson(localgeojson);

        return () => {         
          map.off('draw:created');
          map.off('draw:edited');        
        };
      }
    };
    fetchData();

    const handleKeyDown = (event) => {
      if (event.ctrlKey) {
        if ((event.key === 'z' || event.key === 'Z')) {
          event.preventDefault();
          undoFunction();
        }
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };

  }, []);

  useEffect(() => {

    const map = mapRef.current;
    const drawnItems = drawnItemsRef.current;

    if (map && drawnItems && geojson) {
      // Remove all layers from the drawnItems feature group
      drawnItems.clearLayers();

      // Add new layers from the geojson prop
      geojson.features.forEach(function (currentFeature) {
        const polygon = L.polygon(L.GeoJSON.coordsToLatLngs(currentFeature.geometry.coordinates[0])).addTo(map);
        // polygon.enableEdit();
        map.fitBounds(polygon.getBounds());
        drawnItems.addLayer(polygon);
      });
    }
  }, [geojson]);

  return <div id="map" style={{ height: '500px' }} />;
}

export default Map;