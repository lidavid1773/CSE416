import { useState, useEffect } from "react";
import FileSelector from "./Components/FileSelector";
import MyMap from "./Components/MyMap";
import "./App.css";
import { MapContainer } from "react-leaflet";
const App = () => {
  /*
    Shapefiles only contain geographic info, like the borders of a country, not info about subdivisions (e.g. names of states/provinces). 
    For that, we use DBASE files (.dbf).
  */
  // const [files, setFiles] = useState({ shapefile: null, dbase: null });

  // const handleSetFiles = (e) => {
  //   setFiles({ ...files, [e.target.name]: e.target.value });
  // };

  return (
    <div>
      {/* <FileSelector files={files} handleSetFiles={handleSetFiles} /> */}
      {/* <MyMap files={files} /> */}
      <MapContainer center={[35, -100]} zoom={4.5} scrollWheelZoom={true}>
        <MyMap />
      </MapContainer>
    </div>
  );
};

export default App;
