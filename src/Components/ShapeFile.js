import React, { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import shp from "shpjs";

export const ShapeFile = ({ data }) => {
  const [geoJSONData, setGeoJSONData] = useState(null);

  useEffect(() => {
    async function getData() {
      console.log(data);
      const response = await shp(data);
      setGeoJSONData(response);
      console.log("retrieved data");
    }
    getData();
  }, [data]);

  return <GeoJSON data={geoJSONData} />;
};

export default ShapeFile;
