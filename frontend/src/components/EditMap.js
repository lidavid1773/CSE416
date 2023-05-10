import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import "leaflet-draw/dist/leaflet.draw-src.css";
import localgeojson from "../maps/ukraine.json";


function Map() {
  const [geojson, setgeojson] = useState(null);
  const undoHistoryRef = useRef([]);
  const redoHistoryRef = useRef([]); 
  const mapRef = useRef(null);
  const drawnItemsRef = useRef(null);
  const editHistory = useRef({});

  function undoFunction() {
    console.log("undo");
    const drawnItems = drawnItemsRef.current;
    const actionHistory = undoHistoryRef.current;
    if (drawnItems && actionHistory.length > 0) {

      const lastAction = actionHistory.pop(); // retreve the lastaction for undo
      redoHistoryRef.current.push(lastAction); // store the lastaction for redo

      if (lastAction.type === 'created') {
        drawnItems.eachLayer((layer) => {
          const layerId = L.stamp(layer);
          if (layerId === lastAction.layerId) {
            lastAction.layer = layer.toGeoJSON();
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

  function redoFunction() {
    console.log("redo");
    const drawnItems = drawnItemsRef.current;
    const redoHistory = redoHistoryRef.current;
    if (drawnItems && redoHistory.length > 0) {
      const lastRedo = redoHistory.pop();
  
      if (lastRedo.type === 'created') {
        // Redo(add) the creation of a layer
        const layerGroup = L.geoJSON(lastRedo.layer);  // create a new instance of layer group
        const layer = layerGroup.getLayers()[0];
        const layerId = L.stamp(layer);           // so get a new ID
        console.log(layerId);
        drawnItems.addLayer(layer);
        undoHistoryRef.current.push({ type: 'created', layerId, layer: layer.toGeoJSON() });
        for(var history of redoHistory){
          if(history.type === "edited"){
            history.layerId = layerId;    // update each layerId in history since old layer got removed, and new layer is created with new ID
          }
        }
      } else if (lastRedo.type === 'edited') {
        drawnItems.eachLayer((layer) => {
          const layerId = L.stamp(layer);
          if (layerId === lastRedo.layerId) {
            const latLngs = lastRedo.after.geometry.coordinates[0].map(([lng, lat]) => L.latLng(lat, lng));
            layer.setLatLngs(latLngs);
            layer.redraw();
            undoHistoryRef.current.push({ type: 'edited', layerId, before: lastRedo.before, after: lastRedo.after });
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
          undoHistoryRef.current.push({ type: 'created', layerId });
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
            undoHistoryRef.current.push({ type: 'edited', layerId, before, after });
            console.log(undoHistoryRef.current);  
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
        } else if ((event.key === 'y' || event.key === 'Y')) {
          event.preventDefault();
          redoFunction();
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