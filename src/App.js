import './App.css';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from "leaflet"
import shp from 'shpjs';
//import mapData from './custom.geo.json'

function handleReadFile(event) {
  let file = document.getElementById("fileSelect").files[0];
  if (file) {
    let ext = getExtension(file.name);
    switch (ext) {
      case "geojson":
        readDataFromGeojsonFile(file);
        break;
      case "kml":
        readDataFromKMLFile(file);
        break;
      case "shp":
        readDataFromShpFile(file);
        break;
      case "zip":
        readDataFromShpZipFile(file);
        break;
      default:
        alert("Invalid file ");
    }
  }
}

function getExtension(filename) {
  var parts = filename.split(".");
  return parts[parts.length - 1];
}

document
  .getElementById("fileSelect")
  .addEventListener("change", handleReadFile);

function readDataFromGeojsonFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const fc = JSON.parse(reader.result.toString());
    if (fc && fc.features.length > 0) {
      onHightLight(fc);
    }
  };
  reader.readAsText(file);
}

function readDataFromKMLFile(file) {
  let fileReader = new FileReader();
  fileReader.onload = async (e) => {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(e.target.result, "text/xml");
    onHightLight(toGeoJSON.kml(xmlDoc));
  };
  fileReader.readAsText(file);
}

function readDataFromShpFile(file) {
  var fc;
  const reader = new FileReader();
  reader.onload = (event) => {
    shapefile
      .openShp(reader.result)
      .then((source) =>
        source.read().then(function log(result) {
          if (result.done) {
            onHightLight(fc);
            return;
          }
          fc = result.value;
          return source.read().then(log);
        })
      )
      .catch((error) => console.error(error.stack));
  };
  reader.readAsArrayBuffer(file);
}

function readDataFromShpZipFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    shp(reader.result).then(function (fc) {
      if (fc.features.length > 0) {
        onHightLight(fc);
      }
    });
  };
  reader.readAsArrayBuffer(file);
}

function onHightLight(data) {
  clearLayerFeature();
  map.addSource("source-hightlight", {
    type: "geojson",
    data: data,
  });
  map.addLayer({
    id: "layer-hightlight",
    type: "line",
    source: "source-hightlight",
    layout: {},
    paint: {
      "line-color": "red",
      "line-width": 2,
    },
  });
}

function clearLayerFeature() {
  if (map.getLayer("layer-hightlight")) {
    map.removeLayer("layer-hightlight");
    map.removeSource("source-hightlight");
  }
}
function App() {
  const mapData = L.geoJson(
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
  )
  shp("./USA_adm/USA_adm0").then(function(geojson){
		mapData.addData(geojson)
	});

  const onEachCounty = (county,layer) => {
    const county_name = county.properties.name;
    layer.on({
      mouseover: (e) => {
        layer.bindPopup(county_name).openPopup();
      },
    });    
  }

  return (
    <div className="App">
      <MapContainer center={[45, -100.4173]} zoom={4} scrollWheelZoom={true}>
        <GeoJSON data={mapData.features} onEachFeature={onEachCounty}></GeoJSON>
      </MapContainer>
    </div>
  );
}

export default App;
