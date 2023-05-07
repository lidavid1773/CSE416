/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import "leaflet-draw/dist/leaflet.draw-src.css";
import localgeojson from "./maps/north_america.json";
import { markerIcon } from "./Icon";
import { SketchPicker } from 'react-color'

import ColorLegend from './GrgphicEditor/ColorLegend';
import ImageUploader from './GrgphicEditor/ImageUploader';
import Dropdown from './GrgphicEditor/Dropdown';
function Map() {
  // const [map, setMap] = useState(null);
  const [geojson, setgeojson] = useState(null);
  const [background, setBackground] = useState('#fff');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setfontFamily] = useState('Arial');
  const [style,setStyle] = useState(null);
  const [borderStyle, setBorderStyle] = useState('solid');
  const selectedRef = useRef(null);

  const [hasSelectedColors, setHasSelectedColors] = useState([]);
  const [images, setImages] = useState([]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleImageUpload = (uploadedImages) => {
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };


  
  const handleStyleChange = (menuType,style) => {
    selectedRef[menuType] = style
    console.log(selectedRef);
  };
  
  const handleChangeComplete = (color) => {
    setBackground(color.hex);
    selectedRef.color = color;
    setHasSelectedColors(hasSelectedColors.concat(color.hex));

  };
  var map, geojsonLayer, vertexLayer;
  var selectedPolygon = null;

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
            hideOnSelect: true,
          },
          {
            text: 'Select Vertices',
            callback: () => enableSelectVerticesMode(),
            hideOnSelect: true,
          },

        ],

      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(map);

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
      // var drawControl = new L.Control.Draw({
      //   draw: false,
      //   edit: {
      //       featureGroup: drawnItems
      //   }
      // });;
      // map.addControl(drawControl);
    }
  }, [geojson]);

  //turn coordinates inside a GeoJson feature into a Leaflet Polygon
  const convertToPolygon = (poly, drawnItems) => {
    var polygon = L.polygon(L.GeoJSON.coordsToLatLngs(poly)).addTo(map);
    drawnItems.addLayer(polygon);
    polygon.on('click', function (e) {
      if (selectedPolygon)
        selectedPolygon.editing.disable();
      selectedPolygon = e.target;
      e.target.editing.enable();
      applyNewStyle(polygon)
    });
  }
  const rgbaToString = (rgba) => `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

  const applyNewStyle = (polygon) => {
    const newColorString = rgbaToString(selectedRef.color.rgb);
    polygon.setStyle({ fillColor: newColorString });
  }
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
        vertexDisplay(features, layer);
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
  return <div className="grid-container">
    <div id="map" style={{ height: '600px' }} />
    <div>
      <ImageUploader onImageUpload={handleImageUpload} />
      <div>
        {images.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Uploaded image ${index}`}
            style={{ maxWidth: '200px', maxHeight: '200px', border: selectedImageIndex === index ? '2px solid blue' : 'none' }}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>
      <SketchPicker style={{ height: '200px' }} color={background}
        onChangeComplete={handleChangeComplete} />
      <ColorLegend colors={hasSelectedColors} />
      <h1 style={{ fontSize: `${fontSize}px`, fontFamily: `${fontFamily}`, borderStyle: `${borderStyle}` }}>Hello World</h1>

      <Dropdown onStyleChange ={handleStyleChange } colorSelection = {hasSelectedColors}></Dropdown>
    </div>

  </div>


}

export default Map;
