/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import "leaflet-draw/dist/leaflet.draw-src.css";
import localgeojson from "./maps/ukraine.json";
import { markerIcon } from "./Icon";

function Map() {
  // const [map, setMap] = useState(null);
  const [geojson, setgeojson] = useState(null);
  var map,geojsonLayer,vertexLayer;
 
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
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [
          {
            text: 'View Properties',
            callback: () => console.log('View Properties'),
            hideOnSelect:true,
          },
          {
            text: 'Select Vertices',
            callback: () => enableSelectVerticesMode(),
            hideOnSelect:true,
          },
          
        ],
       
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

  const enableSelectVerticesMode = () => {
    map.removeLayer(geojsonLayer);
    geojsonLayer = L.geoJson(geojson, 
      { onEachFeature: function highlight(features, layer) { vertexDisplay(features, layer); } }
      )
      .addTo(map);
  }
  const selectVerticesMode = (features, layer) => {
   
    if (features.properties) {
      layer.on("click", (event) => {
        vertexDisplay (features, layer);
      });
    }
  }
  const vertexDisplay = (features, layer) => {
    var coords = [];
    if (features.geometry.type === 'Polygon')
      coords = features.geometry.coordinates;
    else if (features.geometry.type === 'MultiPolygon')
      features.geometry.coordinates.forEach(c => coords.push(c[0]))
    if (coords.length > 0) {
      coords.forEach(function (coordsArray) {
        var vertexArray = L.GeoJSON.coordsToLatLngs(coordsArray);
        vertexArray.forEach(function (latlng) {
          var marker = L.marker(latlng, { draggable: true, icon: markerIcon }).addTo(vertexLayer);
          marker.bindPopup(showLatLng(latlng))
          marker.on("click", removeVertex(latlng, features, marker)).addTo(vertexLayer);
          markerDraggingMovement(markerDraggingMovement, marker, features.geometry.coordinates[0])
        });
      });
    }
  }

  const removeVertex = function (latlng, features, marker) {
    return () => {
      if (features.geometry.type === 'Polygon') {
        for (let position of features.geometry.coordinates) {
          if (removeCoordinates(position, latlng, marker, features)) {
            return
          }
        }
      } else {
        for (let polygon of features.geometry.coordinates) {
          for (let position of polygon) {
            if (removeCoordinates(position, latlng, marker, features)) {
              return
            }
          }
        }
      }
    }
  }

  const removeCoordinates = (position, latlng, marker, features) => {
    const polyLineLayer = getPolyLineLayer();
    const coords = L.GeoJSON.coordsToLatLngs(position);
    //const coords = polyLineLayer.getLatLngs()[0];
    var index = markerIndexSearch(coords, latlng)
    if (index === -1) {
      return false;
    }
    if (index === 0 || index === coords[0].length - 1)
      coords.splice(index, 1)
    coords.splice(index, 1)
    marker.remove()
    polyLineLayer.setLatLngs(coords)
    return true;
  }

  const markerDraggingMovement = (funct, marker, coordinates) => {
    var index;
    var PolyLineLayer;
    var coords;
    var latlng;
    marker.on('mousedown', function (e) {
      latlng = e.target.getLatLng();
      PolyLineLayer = getPolyLineLayer();
      coords = PolyLineLayer.getLatLngs()[0];
      index = markerIndexSearch(coords, latlng)
    })
    marker.on('drag', function (e) {
      latlng = e.target.getLatLng();
      coords[index] = (e.target.getLatLng())
      PolyLineLayer.setLatLngs(coords)
    })
    marker.on('dragstart', function (e) {
      map.off('click', funct);
    });
    marker.on('dragend', function (e) {
      console.log('marker dragend event');
    });
  }

  const getPolyLineLayer = () => {
    const polylineLayer = [];
    geojsonLayer.eachLayer(layer => {
      if (layer instanceof L.Polyline) {
        polylineLayer.push(layer);
      }
    });
    return polylineLayer[0];
  }
  const markerIndexSearch = (arr2D, obj) => {
    for (let i in arr2D) {
      var latlng = arr2D[i];
      if (latlng.lng === obj.lng && latlng.lat === obj.lat) {
        return i;
      }
    }
    return -1; // if obj is not found in the 2D array
  };

  const findCoordinate = (latlng) => {

  }

  const showLatLng = (latlng) => {
    return `lng: ${latlng.lng} </br>
    lat: ${latlng.lat} `
  }
  return <div id="map" style={{ height: '600px' }} />;
}

export default Map;
