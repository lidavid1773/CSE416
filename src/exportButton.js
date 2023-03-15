import { useEffect } from "react";
import { saveAs } from 'file-saver';
import shpwrite from 'shp-write';
import process from 'process';
const FileSaver = require('file-saver');

export default function ExportButton(api) {
  var [L, map, mapData] = [api.L, api.map, api.mapData];
  const handleGeoJSONExport = () => {
    const json = JSON.stringify(mapData.geodata[0], null, 2);
    var fileToSave = new Blob([json], {
      type: 'application/json'
    });
    FileSaver.saveAs(fileToSave, "geojson.json")
  }
  // console.log(process) 
  const handleSHPExport = () => {
    console.log(process)
    shpwrite.download(mapData.geodata[0])
  }
  const addButton = (name, handleMethod) => {
    L.Control.Button = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: function (map) {
        var container = L.DomUtil.create('button', 'leaflet-bar leaflet-control');
        var button = L.DomUtil.create('a', 'leaflet-control-button', container);
        L.DomEvent.disableClickPropagation(button);
        L.DomEvent.on(container, 'click', function () {
          handleMethod()
        });
        const buttonElement = `<div >Export as ${name}</div>`;
        container.innerHTML = buttonElement;
        return container;
      },
      onRemove: function (map) { },
    });
    var control = new L.Control.Button()
    control.addTo(map);
  }
  useEffect(() => {
    if (!map) return;
    addButton("GeoJSON", handleGeoJSONExport)
    addButton("SHP/DBF", handleSHPExport)
  }, []);


  return null;
}