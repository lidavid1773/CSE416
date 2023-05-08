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
import ColorLegend from './GraphicEditor/ColorLegend';
import ImageUploader from './GraphicEditor/ImageUploader';
import Dropdown, { InitState, getBorderDashArray, Uploaded, StyleDropdownMenuType, ModeDropdownMenuType, DownloadDropdownMenuType } from './GraphicEditor/Dropdown';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter'

function Map() {
  // const [map, setMap] = useState(null);
  const [geojson, setgeojson] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#fff');
  const [style, setStyle] = useState(null);
  const mapRef = useRef(InitState);
  const [hasSelectedColors, setHasSelectedColors] = useState([]);
  const [images, setImages] = useState([]);
  const initImageIndex = -1;
  const [selectedImageIndex, setSelectedImageIndex] = useState(initImageIndex);

  const handleImageClick = (index) => {
    if (mapRef.current[Uploaded.IMAGE]) {
      mapRef.current[Uploaded.IMAGE] = undefined
      setSelectedImageIndex(initImageIndex);
    }
    else {
      mapRef.current[Uploaded.IMAGE] = images[index];
      setSelectedImageIndex(index);
    }

  };

  const handleImageUpload = (uploadedImages) => {
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };
  const handleStyleChange = (menuType, style) => {
    mapRef.current[menuType] = style
    console.log(mapRef.current);
    setStyle(style);
  };

  const handleChangeComplete = (color) => {
    setBackgroundColor(color.rgb);
    const newColorString = rgbaToString(color.rgb);
    mapRef.current.backgroundColor = newColorString;

    setHasSelectedColors((prevColor) => [newColorString, ...prevColor]);

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
      if (!mapRef.current.map) {
        map = L.map('map', {
          renderer: L.canvas(),
          preferCanvas: true
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        }).addTo(map);
        mapRef.current.map = map;
        mapRef.current.geojson = geojson;
        new SimpleMapScreenshoter().addTo(map)

        setStyle(1)
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
      applyNewStyle(polygon, e)
    });
  }
  const rgbaToString = (rgba) => `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

  const applyNewStyle = (polygon, e) => {

    polygon.setStyle({
      weight: mapRef.current.weight,
      fillColor: mapRef.current.backgroundColor,
      color: mapRef.current.borderColor,
      dashArray: getBorderDashArray(mapRef.current.borderStyle),
    })
    addImageMarker(polygon, e);
  }
  const addImageMarker = (polygon, e) => {

    if (mapRef.current[Uploaded.IMAGE]) {
      const icon = L.icon({
        iconUrl: mapRef.current[Uploaded.IMAGE],
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const marker = L.marker(e.latlng, { icon }).addTo(map);
      if (!polygon.imageMarker) {
        polygon.imageMarker = []
      }
      polygon.imageMarker.push(marker);
    }
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
  return <div>
    <Dropdown DropdownMenuType={DownloadDropdownMenuType} onStyleChange={handleStyleChange} dropdownRef={mapRef} mapRef={mapRef}> </Dropdown>
    <div className="grid-container">
      <div id="map" style={{ height: '600px' }} />

      <div>
        <Dropdown DropdownMenuType={ModeDropdownMenuType} onStyleChange={handleStyleChange} dropdownRef={mapRef} ></Dropdown>

        {mapRef.current["Editing Mode"] === "Graphic Editing" &&
          <div>
            <ImageUploader onImageUpload={handleImageUpload} onSelectedImageIndex={setSelectedImageIndex} imageIndex={selectedImageIndex} graphicRef={mapRef} />
            {images.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Uploaded image ${index}`}
                style={{ maxWidth: '200px', maxHeight: '200px', border: selectedImageIndex === index ? '2px solid blue' : 'none' }}
                onClick={() => handleImageClick(index)}
              />
            ))}
            <SketchPicker style={{ height: '200px' }} color={backgroundColor}
              onChangeComplete={handleChangeComplete} />
            <ColorLegend colors={hasSelectedColors} />
            <h1 style={{
              fontSize: `${mapRef.current.fontSize}px`,
              fontFamily: `${mapRef.current.fontFamily}`,
              border: `${mapRef.current.weight}px ${mapRef.current.borderStyle} ${mapRef.current.borderColor}`,
              background: `${mapRef.current.backgroundColor}`,
            }}>
              Hello World
            </h1>
            <Dropdown DropdownMenuType={StyleDropdownMenuType} onStyleChange={handleStyleChange} colorSelection={hasSelectedColors} dropdownRef={mapRef} ></Dropdown>
          </div>}

      </div>
    </div>
  </div>

}

export default Map;
