import { useEffect } from "react";
import PropTypes from "prop-types";
import { useMap } from "react-leaflet";
import L, { geoJSON } from "leaflet";
import shp from "shpjs";
import shapfile from"shapefile";
 function Shapefile( {zipUrl: data} ) {
  const map = useMap();
console.log(data.fc)

// console.log(arrayBufferToGeoJSON(zipUrl.geodata));
  useEffect(() => {
    const geo = L.geoJson(
      { features: [] },
      {
        onEachFeature: function popUp(f, l) {
          var out = [];
          if (f.properties) {
            for (var key in f.properties) {
              out.push(key + ": " + f.properties[key]);
            }
            l.bindPopup(out.join("<br />"));
          }
        }
      }
    ).addTo(map);
    // const test = async ()=>{
      
    //   return await shp(zipUrl.geodata);
    // }
    // const geoJson = test();
    // console.log(geoJson);
    geo.addData(data.fc)
  //   shp(zipUrl).then(function (data) {
  //     geo.addData(data);
  //   });
  }, [map,data]);
  console.log("it is working");
  return null;
}

// Shapefile.propTypes = {
//   zipUrl: PropTypes.string.isRequired
// };

export default Shapefile;