import React, { Component, useEffect, useState, createContext } from "react";
import './index.css';
import 'leaflet/dist/leaflet.css';
import ShapeFile from "./shapeFile.js";
import { MapContainer, LayersControl } from 'react-leaflet'
import localgeojson from "./geojson (19).json"
import SimplificationButton from "./simplificationButton";
import{useGeoJson,useLocalGeoJson} from "./geojsonHooks"
import {ContextMenu} from "./ContextMenu";
import "leaflet-contextmenu";
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";
const { BaseLayer, Overlay } = LayersControl;
const shapefile = require('shapefile')
const GlobalGeoJsonContext = createContext({});
function App() {
  const [geojson, setgeojson] = useState([]);
  const [count, setcount] = useState(0);
  const [numOfVertices, setnumOfVertices] = useState(0)
  var ShpData = null, DbfData = null;
  const handleFile = (e) => {
    for (let file of e.currentTarget.files) {
      let reader = new FileReader();
      let ext = getExtension(file.name);
      var data = []
      // console.log('working')
      // eslint-disable-next-line no-loop-func
      reader.onload = () => {
        if (ext === "dbf") {
          DbfData = reader.result;
        }
        else if (ext === "shp") {
          ShpData = reader.result;
        }
        if (ShpData && DbfData) {
          shapefile.open(ShpData, DbfData).then((source) =>
            source.read().then(function log(result) {
              if (result.done) {
                return;
              }
              // data.push(result.value)
              setgeojson(result.value);
              return source.read().then(log);
            })
          ).catch((error) => console.error(error.stack));
        }
      }
      reader.readAsArrayBuffer(file);
    }
  }
  function getExtension(filename) {
    var parts = filename.split(".");
    return parts[parts.length - 1];
  }
  function countCoordinates(geojson) {
    let count = 0;
    for (const feature of geojson.features) {
      const geometry = feature.geometry;
      if (geometry.type === "Polygon") {
        count += geometry.coordinates[0].length;
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          count += polygon[0].length;
        }
      }
    }
    return count;
  }
 
  
  // const updateGeoJson = (geojson, setgeojson, setnumOfVertices) => {
  //   if (geojson?.length) {
  //     setgeojson(prevGeoJson => {
  //       const newGeoJson = [...prevGeoJson, ...geojson];
  //       setnumOfVertices(countCoordinates(newGeoJson));
  //       return newGeoJson;
  //     });
  //   }
  // };
  // const useLocalGeoJson = (localgeojson, setgeojson, setnumOfVertices) => {
  //   useEffect(() => {
  //     if (localgeojson) {
  //       setgeojson(localgeojson);
  //       setnumOfVertices(countCoordinates(localgeojson));
  //     }
  //   }, [localgeojson, setgeojson, setnumOfVertices]);
  // };
  // const useGeoJson = (geojson, setgeojson, setnumOfVertices) => {
  //   useEffect(() => {
  //     updateGeoJson(geojson, setgeojson, setnumOfVertices);
  //   }, [geojson, setgeojson, setnumOfVertices]);
  // };
  
  useGeoJson(geojson, setgeojson, setnumOfVertices);
  useLocalGeoJson(localgeojson, setgeojson, setnumOfVertices);
  return (
    <div>
      <div >
        <input type="file" accept=".shp , .dbf" onChange={handleFile} id="files" multiple />
        upload shapefile and dbf file together
      </div>
      
        {<GlobalGeoJsonContext.Provider value={[geojson, setgeojson]}>

          <div>Number of vertices: {numOfVertices}</div>
          {/* <SimplificationButton></SimplificationButton> */}
          <MapContainer zoomControl={true} contextmenu={true}
        contextmenuItems={ContextMenu} >

            {geojson && <Overlay checked name='Feature group'>
            <ShapeFile />
          </Overlay>}
          

          </MapContainer >

        </GlobalGeoJsonContext.Provider>}
    
    </div>



  )

}

export { App, GlobalGeoJsonContext };



