import { useEffect } from "react";
import PropTypes from "prop-types";
import { useMap,GeoJSON } from "react-leaflet";
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

  useEffect(() => {
    
    for (let data of FileData.geodata){
      geo.addData(data);
      <GeoJSON data = {data.features} />
    }
  }, [FileData]

  );
 
  return null;
}

// Shapefile.propTypes = {
//   zipUrl: PropTypes.string.isRequired
// };

export default Shapefile;