import { useContext, useEffect, useState } from "react";
import { MapContainer, Marker, useMap, FeatureGroup,useMapEvents} from "react-leaflet";
import L, { marker, polygon } from "leaflet";

import ExportButton from "./exportButton";
import { markerIcon } from "./Icon";
import SimplificationButton from "./simplificationButton";
import  {GlobalGeoJsonContext }from "./App"

import { difference, lineSplit, lineString, lineStringToPolygon, lineToPolygon,simplify } from "@turf/turf"
import RightClickMenu from "./ContextMenu";
// import { lineToPolygon } from "@turf/turf/dist/js";
// import { turf } from "@turf/turf"
export default function Shapefile(FileData) {
  const dissolve = require("geojson-dissolve");
  // const turf = require("turf/turf");
  const [region, setRegion] = useState([]);
  const [regionLayer, setRegionLayer] = useState([]);
  const [geojson, setgeojson] = useContext(GlobalGeoJsonContext)
  var map = useMap(); 
  var admName;
  var count = 0;
  var geojsonLayer;
 
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
      // layer.bindPopup(features.properties[admName]);
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
    geojsonLayer.addData(newRegion)
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
  const markerIndexSearch = (arr2D, obj) => {
    for (let i in arr2D) {
      var latlng = arr2D[i];
      if (latlng.lng === obj.lng && latlng.lat === obj.lat) {
        return i;
      }
    }
    return -1; // if obj is not found in the 2D array
  };
  const removeCoodinates = (position, latlng, marker, features) => {
    const polyLineLayer = getPolyLineLayer();
    const coords = polyLineLayer.getLatLngs()[0];
    var index = markerIndexSearch(coords, latlng)
    if (index === 0 || index === coords[0].length - 1)
      coords.splice(index, 1)
    coords.splice(index, 1)
    marker.remove()
    polyLineLayer.setLatLngs(coords)
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
  const makerDraggingMovement = (funct, marker, coordinates) => {
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
      marker.setPopupContent(showLatLng(latlng))
      marker.openPopup()
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
  var c = 0;
  var splitarr = []
  const split = (marker, features) => {
    marker.on("click", () => {
      c++;
      var latlng = [marker.getLatLng().lat, marker.getLatLng().lng]
      splitarr.push(latlng)
      console.log(c)

      if (c === 2) {
        // console.log(splitarr,geojson);
        var l1 = lineString(splitarr);
        // console.log(linestring1)
        // var p1 =  lineToPolygon(l1)
        // console.log("bug")
        geojsonLayer.eachLayer(layer => {
          // Check if the layer is a polyline or polygon
          if (layer instanceof L.Polyline) {
            // Get the layer's coordinates
            const coords = layer.getLatLngs()[0];

            var l2 = coords.map(function (latlng) {
              return [latlng.lat, latlng.lng];
            });
            // l2 = lineString(l2)
            console.log(features)
            // var p2 = lineToPolygon(lineString(l2))
            // var region =  difference(p1,p2)
            // console.log(region)
            console.log(lineSplit(l1, features))

            return
          }
        });
      }
    })



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
    if (coords.length > 0) {
      coords.forEach(function (coordsArray) {
        var vertexArray = L.GeoJSON.coordsToLatLngs(coordsArray);
        vertexArray.forEach(function (latlng) {
          var marker = L.marker(latlng, { draggable: true, icon: markerIcon }).addTo(vertexLayer)
          marker.bindPopup(showLatLng(latlng))
          // marker.on("click", removeVertex(latlng, features, marker)).addTo(vertexLayer);
          // marker.on("click", split);
          // split(marker, features);
          makerDraggingMovement(makerDraggingMovement, marker, features.geometry.coordinates[0])
          
        });
      });
    }
  }
  
  // map.on('click', insertVertex);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
// new L.Control.Draw({})
// Initialize the draw control and pass it the FeatureGroup of editable layers
// var drawControl = new L.Control.Draw({
//     edit: {
//         featureGroup: drawnItems
//     }
// });
// map.addControl(drawControl);
  // map.off('click',insertVertex);
  useEffect(() => {
    console.log("only once")
    geojsonLayer = L.geoJson(geojson, { onEachFeature: function popUp(features, layer) { customizePopUp(features, layer); } })
      .addTo(map);
    if(geojsonLayer.getBounds().isValid()){
      map.fitBounds(geojsonLayer.getBounds());
    }
    
    // map.fitBounds(geojsonLayer.getBounds())
  }, [geojson]);
  
  return (<div >
    {/* <RightClickMenu></RightClickMenu> */}{
      geojson.type !== undefined
    }
    <ExportButton  map={map} mapData={geojson}></ExportButton>
    <SimplificationButton  map={map} mapData={geojson}></SimplificationButton>
  </div>);
}

