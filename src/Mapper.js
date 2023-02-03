import React, { Component, useEffect, useState } from "react";
import './index.css';
import 'leaflet/dist/leaflet.css';
import ShapeFile from "./Shapefile.js";
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
const { BaseLayer, Overlay } = LayersControl;

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
    var reader = new FileReader();
    var file = e.target.files[0];
    reader.readAsArrayBuffer(file);
    reader.onload = function (buffer) {
      setGeodata({ geodata: buffer.target.result })
    }
  }
  return (
    <div>
      <div >
        <input type="file" onChange={handleFile} className="inputfile" />
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