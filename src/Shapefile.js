import { useEffect, useState } from "react";

import { useMap, } from "react-leaflet";
import L, { geoJSON, marker } from "leaflet";

function Shapefile(FileData) {
  var dissolve = require('geojson-dissolve')
  const [region, setRegion] = useState([])
  const [mapData, setmapData] = useState(FileData);
  const map = useMap();
  var highlight = {
    'fillColor': 'yellow',
    'weight': 2,
    'opacity': 1
  };
  var count = 0;


  const geo = L.geoJson(
    {
      features: [
      ]
    },
    {
      onEachFeature: function popUp(features, layer) {
        var out = [];
        if (features.properties) {
          out.push(" " + features.properties["NAME_1"]);
          layer.bindPopup(out.join("<br />"));
          layer.on("click", function (e) {
            if (!e["sourceTarget"]["options"]["fillColor"] !== "yellow") {
              region[count] = features
              layer.setStyle(highlight);
              count++;
            }
            if (count === 2) {
              var newFiledata = {
                geodata: []
              }
              var union = dissolve(region[0], region[1]);
              var newRegion = {};
              newRegion.type = "Feature";
              newRegion.properties = region[0].properties;
              newRegion.geometry = union;
              newFiledata.geodata.push(newRegion);
              geo.remove(region[0])
              geo.remove(region[1])
              for (let geodata of mapData.geodata) {
                if (geodata !== region[0] && geodata !== region[1]) {
                  newFiledata.geodata.push(geodata);
                }
              }
              count = 0;
              console.log(newFiledata)
              setmapData(newFiledata);
              setRegion([]);

            }
          });
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
                  { radius: 3 }
                )
                marker.addEventListener("click", removeVertex(latlng, features, marker)).addTo(vertexLayer);

              });
            });
          }
        }
      }
    }
  ).addTo(map);

  var vertexLayer = L.layerGroup(({
    features: [
    ]
  }, {
    onEachFeature: function popUp(f, l) {
      console.log(l)
    }
  }

  ));

  map.addLayer(vertexLayer);
  const removeVertex = function (latlng, features,marker) {
    return () => {

      console.log(features)
      if (features.geometry.type === 'Polygon')
        console.log("polyon")
      if (checkCoodinates(features.geometry.coordinates,latlng,marker)) {
        
        
        return
      }
      else
        for (let coordinates of features.geometry.coordinates) {
          console.log("Multipolyon")
          for (let position of coordinates) {
            console.log(position)
            if (checkCoodinates(position, latlng,marker)) {
             
              
              return
            }
          }

        }
    }

  }
  const checkCoodinates = (position, latlng,marker) => {

    console.log(position.length)

    for (let i in position) {
      if (latlng.lat === position[i][1] && latlng.lng === position[i][0]) {
        position.splice(i, 1)
        vertexLayer.removeLayer(marker);
        marker.off("click");
        setmapData(mapData);
        console.log(mapData)
        return true
      }
    }
    return false
  }
  useEffect(() => {
    for (let data of mapData.geodata) {
      geo.addData(data);
    }
  }, [mapData]

  );

  return null;
}

// Shapefile.propTypes = {
//   zipUrl: PropTypes.string.isRequired
// };

export default Shapefile;