import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMap, GeoJSON } from "react-leaflet";
import L, { geoJSON } from "leaflet";
import {turf} from "turf-union"
function Shapefile(FileData) {
  var dissolve = require('geojson-dissolve')
  const [region, setRegion] = useState([])
  const map = useMap();
  var highlight = {
    'fillColor': 'yellow',
    'weight': 2,
    'opacity': 1
  };
  var count = 0;
  
  // console.log(arrayBufferToGeoJSON(zipUrl.geodata));
  const geo = L.geoJson(
    {
      features: [

      ]
    },
    // {
    //   style: function (feature) { // Style option
    //     return {
    //         'weight': 1,
    //         'color': 'black',
    //         'fillColor': 'blue'
    //     }
    // }
    // },
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
            if(count === 2){
              console.log(region);
              var union = dissolve(region[0], region[1]);
              console.log(union);
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

    for (let data of FileData.geodata) {
      geo.addData(data);
      
      <GeoJSON data={data.features} />
    }
  }, [FileData]

  );

  return null;
}

// Shapefile.propTypes = {
//   zipUrl: PropTypes.string.isRequired
// };

export default Shapefile;