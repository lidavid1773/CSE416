import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMap, GeoJSON } from "react-leaflet";
import L, { geoJSON } from "leaflet";
import { turf } from "turf-union";
function Shapefile(FileData) {
  var dissolve = require("geojson-dissolve");
  const [region, setRegion] = useState([]);
  const [mapData, setmapData] = useState(FileData);
  const map = useMap();
  var highlight = {
    fillColor: "yellow",
    weight: 2,
    opacity: 1
  };
  var count = 0;
  const geo = L.geoJson(
    {
      features: []
    },
    {
      onEachFeature: function popUp(features, layer) {
        var out = [];
        if (features.properties) {
          out.push(" " + features.properties["NAME_1"]);
          layer.bindPopup(out.join("<br />"));
          layer.on("click", function (e) {
            if (!e["sourceTarget"]["options"]["fillColor"] !== "yellow") {
              region[count] = features;
              layer.setStyle(highlight);
              count++;
            }
            if (count === 2) {
              var newFiledata = {
                geodata: []
              };
              var union = dissolve(region[0], region[1]);
              let name = prompt("Enter a new region name!");
              var newRegion = {};
              newRegion.type = "Feature";
              newRegion.properties = region[0].properties;
              newRegion.properties.NAME_1 = name;
              layer.bindPopup(name + "<br />");
              newRegion.geometry = union;
              // console.log(newRegion)
              // newFiledata.geodata.push(union);
              newFiledata.geodata.push(newRegion);
              geo.remove(region[0]);
              geo.remove(region[1]);
              // console.log(region)

              for (let geodata of mapData.geodata) {
                if (geodata !== region[0] && geodata !== region[1]) {
                  newFiledata.geodata.push(geodata);
                }
              }
              count = 0;
              console.log(newFiledata);
              setmapData(newFiledata);
              setRegion([]);
              // if (map !== undefined) {
              //   console.log("new map");
              //   map.remove(); }
            }
          });
        }
      }
    }
  ).addTo(map);
  // L.geoJson({onEachFeature:function setcolor(f,layer){
  //   layer.on({
  //     click:(e)=>{
  //       console.log("1")
  //     }
  //   })
  // }}).addTo(map);
  useEffect(() => {
    console.log("render");

    console.log(mapData);
    for (let data of mapData.geodata) {
      geo.addData(data);

      // <GeoJSON data={data.features} />
    }
  }, [mapData]);

  return null;
}

// Shapefile.propTypes = {
//   zipUrl: PropTypes.string.isRequired
// };

export default Shapefile;
