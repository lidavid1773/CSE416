import React, { Component, useEffect, useState } from "react";
import './index.css';
import 'leaflet/dist/leaflet.css';
import ShapeFile from "./Shapefile.js";
import shp from "shpjs";
import { Buffer } from "buffer";

import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
const { BaseLayer, Overlay } = LayersControl;
const shapefile = require('shapefile')
const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(Object.keys(feature.properties).map(function (k) {
      return k + ": " + feature.properties[k];
    }).join("<br />"), {
      maxHeight: 200
    });
  }
}
const style = () => {
  return ({
    weight: 2,
    opacity: 1,
    color: "blue",
    dashArray: "3",
    fillOpacity: 0.7
  });
}
export default function ShapefileExample() {
  const [geodata, setGeodata] = useState([]);
  const handleFile = (e) => {
  let file = document.getElementById("inputfile").files[0];
  if (file) {
    let ext = getExtension(file.name);
    switch (ext) {
      case "geojson":
        readDataFromGeojsonFile(file);
        break;
      case "shp":
        readDataFromShpFile(file);
        break;
      case "zip":
        readDataFromShpZipFile(file);
        break;
      default:
        alert("Invalid file ");
    }
  }
  }
  function getExtension(filename) {
    var parts = filename.split(".");
    return parts[parts.length - 1];
  }
  function readDataFromGeojsonFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const fc = JSON.parse(reader.result.toString());
      if (fc && fc.features.length > 0) {
        setGeodata(fc);
      }
    };
    reader.readAsText(file);
  }
  function readDataFromShpFile(file) {
    const reader = new FileReader();
    var c = 0
    var data=[]
    reader.onload = (event) => {
      shapefile
        .openShp(reader.result)
        .then((source) =>
          source.read().then(function log(result) {
            if (result.done) {
              return;
            }
            c++;
            data.push(result.value)
            // console.log(data);
            setGeodata(data);
            return source.read().then(log);
          })
        )
        .catch((error) => console.error(error.stack));
    };
    reader.readAsArrayBuffer(file);
  }
  
  function readDataFromShpZipFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      shp(reader.result).then(function (fc) {
        if (fc.features.length > 0) {
          setGeodata(fc);
        }
      });
    };
    reader.readAsArrayBuffer(file);
  }
  return (
    <div>
      <div >
        <input type="file" onChange={handleFile} id="inputfile" />
      </div>
      <MapContainer center={[42.09618442380296, -71.5045166015625]} zoom={2} zoomControl={true}>
        <LayersControl position='topright'>
          <BaseLayer checked name='OpenStreetMap.Mapnik'>
            <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
          </BaseLayer>
        </LayersControl>
        {geodata && 
        <Overlay checked name='Feature group'>
          <ShapeFile geodata={geodata} />
        </Overlay>}
      </MapContainer>


    </div>
  )

}




