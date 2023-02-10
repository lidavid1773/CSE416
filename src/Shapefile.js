import { useEffect } from "react";
import PropTypes from "prop-types";
import { useMap, GeoJSON } from "react-leaflet";
import L, { geoJSON } from "leaflet";

function Shapefile(FileData) {
  const map = useMap();


  // console.log(arrayBufferToGeoJSON(zipUrl.geodata));

  var vertexLayer = L.layerGroup();
  const geo = L.geoJson(
    { features: [] },
    {
      onEachFeature: function popUp(f, l) {
        if (f.properties)
          l.bindPopup(f.properties["NAME_2"] != null ? f.properties["NAME_2"] : (f.properties["NAME_1"] != null ? f.properties["NAME_1"] : f.properties["NAME_0"]));

        var coords = [];
        if (f.geometry.type === 'Polygon')
          coords = f.geometry.coordinates;
        else if (f.geometry.type === 'MultiPolygon') 
          f.geometry.coordinates.forEach(c => coords.push(c[0]))
        
        // console.log(f.geometry.type)
        // console.log(f.geometry.coordinates)
        if (coords.length > 0) {
          coords.forEach(function(coordsArray) {
            var vertexArray = L.GeoJSON.coordsToLatLngs(coordsArray);
            vertexArray.forEach(function(latlng) {
              L.circleMarker(latlng, 
                {radius: 2}
              ).addTo(map);
            });
          });
        }
      }
    }
  ).addTo(map);

  //map.addLayer(vertexLayer);
  useEffect(() => {

    for (let data of FileData.geodata) {
      geo.addData(data);
      console.log(data);
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