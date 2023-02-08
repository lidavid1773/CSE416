import { useState, useEffect } from "react";
import FileSelector from "./Components/FileSelector";
import MyMap from "./Components/MyMap";
import "./App.css";

const App = () => {
  /*
    Shapefiles only contain geographic info, like the borders of a country, not info about subdivisions (e.g. names of states/provinces). 
    For that, we use DBASE files (.dbf).
  */
  const [files, setFiles] = useState({ shapefile: null, dbase: null });

  const handleSetFiles = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <FileSelector files={files} handleSetFiles={handleSetFiles} />
      <MyMap files={files} />
    </div>
  );
};

export default App;
