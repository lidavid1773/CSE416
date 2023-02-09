import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import mapData from "../Sources/us_states.json";
import { useState, useEffect } from "react";
import { ShapeFile } from "./ShapeFile";

const MyMap = ({ files }) => {
  // Visually select state
  // let updateColor = (e) => {
  //   e.target.setStyle({
  //     color: "red",
  //     fillColor: "yellow"
  //   });
  // };

  // Each target is a state bc our json file is for us states. App should be able to work for different types of geojson files, where target.properties.field may vary
  // let onEachState = (state, layer) => {
  //   let stateName = state.properties.NAME;
  //   layer.bindPopup(stateName);
  //   layer.on({
  //     click: (e) => {
  //       // Default:
  //       //     color: "#3388ff",
  //       //     fillColor: null
  //       updateColor(e);
  //     }
  //   });
  // };

  const [geodata, setGeodata] = useState(null);

  const handleFile = (e) => {
    var reader = new FileReader();
    var file = e.target.files[0];
    reader.readAsArrayBuffer(file);
    reader.onload = function (buffer) {
      console.log("loading data from: ", file.name);
      setGeodata({ data: buffer.target.result, name: file.name });
    };
  };

  return (
    <div>
      <div>
        Upload a .zip folder containing a shapefile
        <br />
        <input type="file" accept=".zip" onChange={handleFile} />
      </div>
      <MapContainer center={[35, -100]} zoom={4.5} scrollWheelZoom={true}>
        {/* Can put a popup at each feature w/ name of region. Problem with this is that it shows up as a popup, and need a way to calculate position based off of 
        // data's coordinates, which we probably need an API for. Maybe we can get away with displaying region through popups with styling?? */}
        {/* {mapData.features.map((obj) => (
          <Marker
            key={obj.properties.NAME}
            position={[Math.random() * 100, Math.random() * 100]}
          >
            <Popup>{obj.properties.NAME}</Popup>
          </Marker>
        ))} */}

        {/* <GeoJSON data={mapData.features} onEachFeature={onEachState} /> */}
        {geodata && <ShapeFile data={geodata.data} />}
      </MapContainer>
    </div>
  );
};

export default MyMap;
