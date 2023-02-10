import { useEffect } from "react";
import PropTypes from "prop-types";
import { useMap, GeoJSON } from "react-leaflet";
import L, { geoJSON, layerGroup } from "leaflet";

function Shapefile(FileData) {
  const map = useMap();
  var highlight = {
		'fillColor': 'yellow',
		'weight': 2,
		'opacity': 1
	};

  var vertexLayer = L.layerGroup();
  const geo = L.geoJson(
    { features: [] },
    {
      onEachFeature: function popUp(f, l) {
        if (f.properties)
          l.bindPopup(f.properties["NAME_2"] != null ? f.properties["NAME_2"] : (f.properties["NAME_1"] != null ? f.properties["NAME_1"] : f.properties["NAME_0"]));
        l.on("click", function (e) { 
          l.setStyle(highlight)
        });
        l.on("dblclick", function (e) { 
          let name = prompt("Please enter new name:");
          if (name != null && name !== "") {
            f.properties["NAME_1"] = name;
            console.log(f.properties["NAME_1"])
            l.bindPopup(name)
          }
        });

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
              ).addTo(vertexLayer);
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
      //console.log(data);
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