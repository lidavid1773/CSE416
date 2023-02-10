import { useState } from "react";
import MyMap from "./Components/MyMap";
import "./App.css";
import { MapContainer } from "react-leaflet";

const App = () => {
  const [geoData, setGeoData] = useState(null);

  let handleSetFile = (e) => {
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = (e) => {
      setGeoData(e.target.result);
    };
  };

  return !geoData ? (
    <div>
      <div>Select a geojson file</div>
      <input type="file" onChange={handleSetFile} />
    </div>
  ) : (
    <MapContainer center={[35, -100]} zoom={4.5} scrollWheelZoom={true}>
      <MyMap geoData={JSON.parse(geoData)} />
    </MapContainer>
  );
};

export default App;
