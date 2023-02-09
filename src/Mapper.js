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
  const [geodata, setGeodata] = useState(null);
  const handleFile = (e) => {
  var fc;
  const reader = new FileReader();
  let file = document.getElementById("inputfile").files[0];
  reader.onload = (event) => {
    shapefile
      .openShp(reader.result)
      .then((source) =>
        source.read().then(function log(result) {
          if (result.done) {
            
            return;
          }
          fc = result.value;
          setGeodata({fc})
          return source.read().then(log);
        })
      )
      .catch((error) => console.error(error.stack));
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
        {geodata && <Overlay checked name='Feature group'>
          <ShapeFile zipUrl={geodata} />
        </Overlay>}
      </MapContainer>


    </div>
  )

}