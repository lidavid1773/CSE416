import { useEffect } from "react";
import shpwrite from 'shp-write';
import process from 'process';
import { addButton } from "./addButton";
import { GlobalGeoJsonContext,App } from "./App";
import { useContext } from "react";
const FileSaver = require('file-saver');

export default function ExportButton(props) {
  const [map] = [props.map]
  const [geojson, setgeojson] = useContext(GlobalGeoJsonContext);

  const handleGeoJSONExport = () => {
    console.log(geojson)
    const json = JSON.stringify(geojson, null, 2);
    var fileToSave = new Blob([json], {
      type: 'application/json'
    });
    FileSaver.saveAs(fileToSave, "geojson.json")
  }
  // console.log(process) 
  const handleSHPExport = () => {
    console.log(process)
    shpwrite.download(geojson)
  }
  if (!Array.isArray(geojson)) {
    addButton("Export as GeoJSON", handleGeoJSONExport, map)
    addButton("Export as SHP/DBF", handleSHPExport, map)
  }
  useEffect(() => {
  
  }, [geojson]);
  return null;
}
