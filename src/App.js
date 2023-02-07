import { useState } from "react";

const App = () => {
  /*
    Shapefiles only contain geographic info, like the borders of a country, not info about subdivisions (e.g. names of states/provinces). 
    For that, we use DBASE files (.dbf).
  */
  const [files, setFiles] = useState({ shapefile: null, dbase: null });

  const handleSetFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div>
        <div>Select a Shapefile</div>
        <input name="shapefile" type="file" onChange={handleSetFile} />
        Shapefile selected: {files.shapefile || "None"}
      </div>
      <br />
      <div>
        <div>Select a dBASE file</div>
        <input name="dbase" type="file" onChange={handleSetFile} />
        dBase file selected: {files.dbase || "None"}
      </div>
    </div>
  );
};

export default App;
