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
        out.push(" " + f.properties["NAME_1"]);
        l.bindPopup(out.join("<br />"));
      }
    }
  }
).addTo(map);

  useEffect(() => {
    
    for (let data of FileData.geodata){
      geo.addData(data);
      console.log(data);
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