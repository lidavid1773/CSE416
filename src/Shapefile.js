import { useEffect,useState } from "react";
import PropTypes from "prop-types";
import { useMap,GeoJSON } from "react-leaflet";
import L, { geoJSON } from "leaflet";

 function Shapefile( FileData ) {
  const[region,setRegion]=useState([])
  const map = useMap();
  var highlight = {
		'fillColor': 'yellow',
		'weight': 2,
		'opacity': 1
	};
var count = 0;
// console.log(arrayBufferToGeoJSON(zipUrl.geodata));
const geo = L.geoJson(
  { features: [
    
  ] },
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
          //resets layer colors
          // console.log(e["sourceTarget"]["options"])
         
          if(!e["sourceTarget"]["options"]["fillColor"] !== "yellow"){
            region[count]=e["sourceTarget"]["feature"]["geometry"]["coordinates"]
            layer.setStyle(highlight);
            count++;
          }
          if(count === 2){
            console.log(region)
            
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
    
    for (let data of FileData.geodata){
      geo.addData(data);
      // console.log(data);
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