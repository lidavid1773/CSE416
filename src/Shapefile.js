import { useEffect } from "react";
import PropTypes from "prop-types";
import { useMap } from "react-leaflet";
import L, { geoJSON } from "leaflet";

 function Shapefile( FileData ) {
  const map = useMap();


// console.log(arrayBufferToGeoJSON(zipUrl.geodata));
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
console.log(FileData)
  useEffect(() => {
    
    for (let data of FileData.geodata){
    
      geo.addData(data);
    }
  }, [FileData]
  );
 
  return null;
}

// Shapefile.propTypes = {
//   zipUrl: PropTypes.string.isRequired
// };

export default Shapefile;