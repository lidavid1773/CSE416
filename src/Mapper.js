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
  var ShpData = null, DbfData = null;
  const handleFile = (e) => {
    for (let file of e.currentTarget.files) {
      let reader = new FileReader();
      let ext = getExtension(file.name);
      var data=[]
      // eslint-disable-next-line no-loop-func
      reader.onload = () => {
        if (ext === "dbf") {
          DbfData = reader.result;
        }
        else if (ext === "shp") {
          ShpData = reader.result;
        }
        if (ShpData && DbfData) {
          shapefile.open(reader.result).then((source) =>
            source.read().then(function log(result) {
              if (result.done) {
                return;
              }
              data.push(result.value)
              
              setGeodata(data);
              return source.read().then(log);
            })
          )
            .catch((error) => console.error(error.stack));
        }
      }
      reader.readAsArrayBuffer(file);


    }

  }
  const comboIsLoaded = () => {
    if (DbfData && ShpData) {
      console.log("ready")
    }
  }
  const readFile = (file) => {
    const reader = new FileReader();
    if (file) {
      let ext = getExtension(file.name);

      reader.onload = () => {
        if (ext === "dbf") {
          DbfData = reader.result;

        }
        else if (ext === "shp") {
          ShpData = reader.result;
        }
        comboIsLoaded()

      }

      reader.readAsArrayBuffer(file);
    }

  }
  function getExtension(filename) {
    var parts = filename.split(".");
    return parts[parts.length - 1];
  }


  return (
    <div>
      <div >
        <input type="file" accept=".shp , .dbf" onChange={handleFile} id="files" multiple />
        upload shapefile and dbf file together
      </div>
      {/* <input type="file" accept=".dbf" onChange={handleDbfFile} id="dbffile" />
      Choose a bdf file */}
      <MapContainer center={[42.09618442380296, -71.5045166015625]} zoom={2} zoomControl={true}>
        <LayersControl position='topright'>
          <BaseLayer checked name='OpenStreetMap.Mapnik'>
            {/* <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" /> */}
          </BaseLayer>
        </LayersControl>
        {geodata.length !== 0 &&
          <Overlay checked name='Feature group'>
            <ShapeFile geodata={geodata} />
          </Overlay>}
      </MapContainer>


    </div>
  )

}




