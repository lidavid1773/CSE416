import { useEffect, useState } from "react";
import { useMap, } from "react-leaflet";
import L from "leaflet";
export default function Shapefile(FileData) {
  const dissolve = require("geojson-dissolve");
  const [region, setRegion] = useState([]);
  const [regionLayer, setRegionLayer] = useState([]);
  
  const [mapData, setmapData] = useState(FileData);
  const [removeMode, setRemoveMode] = useState(false);
  const [reRender,setReRender] = useState(false);
  const map = useMap();

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
  var vertexMode="Vertex Mode off";
  var count = 0;
  var admName;
  const geo = L.geoJson(
    { features: [] },
    {
      onEachFeature: function popUp(features, layer) {
        if (features.properties) {
          const admLevel = checkAdmLevel(features)
          admName = "NAME_" + admLevel
          layer.bindPopup(features.properties[admName]);
          // layer.on("click", function (e) {
          //   if (e["sourceTarget"]["options"]["color"] !== "red") {
          //     region[count] = features;
          //     regionLayer[count]=layer;
          //     layer.setStyle(style.click)
          //     count++;
          //   }
          //   else{
          //     layer.setStyle(style.default)
          //     region[count] = null;
          //     regionLayer[count]=null;
          //     count--;
          //   }
          //   if(count === 2){
          //     mergeRegions();
          //   }
          //   else if (count <0){
          //     count = 0 ;
          //   }
          // });
          vertexDisplay(features);
        }
      }
    }
  ).addTo(map);
  
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
    geo.addData(newRegion)
    count = 0;
  }
  const removeVertex = function (latlng, features, marker) {
    return () => {
      marker.off("click");
      marker.remove()
      
    }
    // {
    //   console.log(features)
    //   if (features.geometry.type === 'Polygon')
    //     console.log("polyon")
    //   if (checkCoodinates(features.geometry.coordinates, latlng, marker,features)) {
    //     return
    //   }
    //   else
    //     for (let coordinates of features.geometry.coordinates) {
    //       console.log("Multipolyon")
    //       for (let position of coordinates) {
         
    //         if (checkCoodinates(position, latlng, marker,features)) {
    //           return
    //         }
    //       }
    //     }
    // }
  }
  const checkCoodinates = (position, latlng, marker,features) => {
    console.log(position.length)
    for (let i in position) {
      if (latlng.lat === position[i][1] && latlng.lng === position[i][0]) {
        position.splice(i, 1)
        // vertexLayer.removeLayer(marker);
        marker.off("click");
        map.removeLayer(marker)
        geo.remove()
        setReRender(!reRender);
        // setmapData(mapData);
        // 
        return true
      }
    }
    return false
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
          var marker = L.circleMarker(latlng,
        //     { icon: L.divIcon({
        //       className: features.properties.iconcategory,
        //       iconSize: L.point(50, 50),
        //   }) 
        
        // }
        {radius:10}
          )
          marker.addEventListener("click", removeVertex(latlng, features, marker)).addTo(vertexLayer);
        });
      });
    }
  }
  useEffect(() => {
    // console.log("render");
    // console.log(mapData)
    for (let data of mapData.geodata) {
      geo.addData(data);
    }
  }, [mapData,reRender]);

  return (<div style={{margin: "auto"}}>
    <span >
      <button >
        {vertexMode}
      </button>
      <button >
        Merge Map
      </button>
    </span>


  </div>);
}

