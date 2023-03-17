import { useEffect, useState } from "react";
import { MapContainer, Marker, useMap, } from "react-leaflet";
import L, { marker } from "leaflet";

import { saveAs } from 'file-saver';
import Editbutton from "./exportButton";
import ExportButton from "./exportButton";
import { markerIcon } from "./Icon";
import { featureGroup } from "leaflet";
export default function Shapefile(FileData) {
  const dissolve = require("geojson-dissolve");
  const [region, setRegion] = useState([]);
  const [regionLayer, setRegionLayer] = useState([]);

  const [mapData, setmapData] = useState(FileData);
  const [removeMode, setRemoveMode] = useState(false);
  const [reRender, setReRender] = useState(false);
  var map = useMap();
  var admName;
  var count = 0;
  var geojson ;
  const style = {
    default: {
      "color": "#3388ff",
    },
    click: {
      "color": "red",
      'weight': 2,
      'opacity': 1
    }
  }
  const customizePopUp = (features, layer) => {
    if (features.properties) {
      const admLevel = checkAdmLevel(features)
      admName = "NAME_" + admLevel
      layer.bindPopup(features.properties[admName]);
      // layer.on("click", function (e) {
      //   if (e["sourceTarget"]["options"]["color"] !== "red") {
      //     region[count] = features;
      //     regionLayer[count] = layer;
      //     layer.setStyle(style.click)
      //     count++;
      //   }
      //   else {
      //     layer.setStyle(style.default)
      //     region[count] = null;
      //     regionLayer[count] = null;
      //     count--;
      //   }
      //   if (count === 2) {
      //     mergeRegions();
      //   }
      //   else if (count < 0) {
      //     count = 0;
      //   }
      // });
      vertexDisplay(features);

    }
  }
 
  


  const vertexLayer = L.layerGroup();
  map.addLayer(vertexLayer);

  const checkAdmLevel = (features) => {
    return features.properties["NAME_2"] != null ? 2 :
      features.properties["NAME_1"] != null ? 1 : 0
  }
  const mergeRegions = (layer) => {
    var union = dissolve(region[0], region[1]);
    var newRegion = {};
    newRegion.type = "Feature";
    newRegion.properties = region[0].properties;
    let newName = "";
    if (newName != null && newName !== "") {
      newRegion.properties[admName] = newName;
      layer.bindPopup(newName)
    }
    newRegion.geometry = union;
    regionLayer[0].remove()
    regionLayer[1].remove()
    geojson.addData(newRegion)
    count = 0;
  }
  const removeVertex = function (latlng, features, marker) {
    return () => {
      console.log(features.geometry.type)
      if (features.geometry.type === 'Polygon') {
        if (removeCoodinates(features.geometry.coordinates, latlng, marker, features)) {
          return
        }
      }
      else
        for (let coordinates of features.geometry.coordinates) {
          console.log("Multipolyon")
          for (let position of coordinates) {
            if (removeCoodinates(position, latlng, marker, features)) {
              return
            }
          }
        }
    }
  }
  const regluarSearch2D = (arr2D, obj) => {
    
    for(let i in arr2D){
      var latlng = arr2D[i];
      if(latlng.lng === obj.lng && latlng.lat === obj.lat){

        return i;
      }
    }
    return -1; // if obj is not found in the 2D array
  };
  
  const removeCoodinates = (position, latlng, marker, features) => {
    
    geojson.eachLayer(layer => {
      // Check if the layer is a polyline or polygon
      if (layer instanceof L.Polyline) {
        // Get the layer's coordinates
        const coords = layer.getLatLngs()[0];
        var index = regluarSearch2D(coords,latlng)
        if(index  === 0 || index === coords[0].length)
            coords.splice(index,1)
        coords.splice(index,1)
        marker.remove()
        layer.setLatLngs(coords)
        return 
      }
    });
   
   
  }
  const makerDraggingMovement = (funct, marker, coordinates) => {
    marker.on('click', function (e) {
      // console.log(coordinates);
      // console.log(marker.index);
      // console.log(marker.index);
      // console.log(coordinates[marker.index])
      // geojson.eachLayer(layer => {
      //   // Check if the layer is a polyline or polygon
      //   if (layer instanceof L.Polyline) {
      //     // Get the layer's coordinates
      //     const coords = layer.getLatLngs();
      //     // coords.splice(marker.index)
      //     console.log(coords)
      //   }
      // });

    })
    marker.on('drag', function (e) {
      var latlng = e.target.getLatLng();
      marker.setPopupContent(showLatLng(latlng))
      marker.openPopup()
      const newLatLng = [latlng.lng, latlng.lat]
      coordinates[marker.index] = newLatLng
      console.log(coordinates[marker.index])
      geojson.eachLayer(layer => {
        // Check if the layer is a polyline or polygon
        if (layer instanceof L.Polyline) {
          // Get the layer's coordinates
          const coords = layer.getLatLngs();
          coords[0][marker.index]=(e.target.getLatLng())
          layer.setLatLngs(coords)
          return 
        }
      });
    })
    marker.on('dragstart', function (e) {
      map.off('click', funct);
    });
    marker.on('dragend', function (e) {
      console.log('marker dragend event');
      console.log(marker.index);
      console.log(coordinates[marker.index]);
    });
  }
  const insertVertex = (e) => {
    var latlng = e.latlng;
    var marker = L.marker(
      latlng, {
      draggable: true,
      icon: markerIcon
    }
    );
    marker.bindPopup(showLatLng(latlng))
    makerDraggingMovement(insertVertex, marker)
    marker.addTo(vertexLayer);
  }
  const showLatLng = (latlng) => {
    return `lng: ${latlng.lng} </br>
    lat: ${latlng.lat} `
  }
  const vertexDisplay = (features) => {
    var coords = [];
    if (features.geometry.type === 'Polygon')
      coords = features.geometry.coordinates;
    else if (features.geometry.type === 'MultiPolygon')
      features.geometry.coordinates.forEach(c => coords.push(c[0]))
    var markerIndex = 0
    if (coords.length > 0) {
      coords.forEach(function (coordsArray) {
        var vertexArray = L.GeoJSON.coordsToLatLngs(coordsArray);
        vertexArray.forEach(function (latlng) {
          var marker = L.marker(latlng, { draggable: true, icon: markerIcon }).addTo(vertexLayer)
          marker.bindPopup(showLatLng(latlng))
          marker.on("click", removeVertex(latlng, features, marker)).addTo(vertexLayer);
          // dragVertex(marker);

          // makerDraggingMovement(makerDraggingMovement, marker, features.geometry.coordinates[0])
          // console.log(markerIndex)
          marker.index = markerIndex
          // console.log(marker)
          markerIndex++
          // marker.markerIndex++;
          // console.log(marker)
        });
      });
    }
  }
  // map.on('click', insertVertex);
  // map.off('click',insertVertex);
  useEffect(() => {
    console.log("only once")
    
   geojson = L.geoJson(mapData.geodata,{ onEachFeature: function popUp(features, layer) { customizePopUp(features, layer); } })
    .addTo(map);
   
  }, []);
  useEffect(() => {
    console.log(mapData.geodata)
    

    
  //   L.polygon(mapData.geodata,{ onEachFeature: function popUp(features, layer) { customizePopUp(features, layer); } })
  //  .addTo(map);
    
  }, [reRender]);
  return (<div >
    <ExportButton L={L} map={map} mapData={mapData}></ExportButton>
  </div>);
}

