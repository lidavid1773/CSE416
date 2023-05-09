import React, { useRef, useState } from 'react';
const shapefile = require('shapefile')

export default function UploadFile() {
    const fileInputRef = useRef(null);
    const [geojson, setgeojson] = useState([]);


    const handleClick = () => {
        fileInputRef.current.click();
    };
    const handleFile = (e) => {
        var ShpData = null, DbfData = null;
        for (let file of e.currentTarget.files) {
          let reader = new FileReader();
          let ext = getExtension(file.name);
          // eslint-disable-next-line no-loop-func
          reader.onload = () => {
            if (ext === "dbf") {
              DbfData = reader.result;
            }
            else if (ext === "shp") {
              ShpData = reader.result;
            }
            if (ShpData && DbfData) {
              shapefile.open(ShpData, DbfData).then((source) =>
                source.read().then(function log(result) {
                  if (result.done) {
                    return;
                  }
                  console.log(result.value)
                  setgeojson(result.value);
                  return source.read().then(log);
                })
              ).catch((error) => alert(error.stack));
            }
          }
          reader.readAsArrayBuffer(file);
        }
    }
    function getExtension(filename) {
        var parts = filename.split(".");
        return parts[parts.length - 1];
    }
    return (
        <span>
            <input onChange={handleFile}
                type="file" id="file" accept=".shp , .dbf" multiple ref={fileInputRef} style={{ display: 'none' }} />
            <button onClick={handleClick}>Upload SHP/DBF</button>
        </span>
    );
}