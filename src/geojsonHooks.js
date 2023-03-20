// geojsonHooks.js
import { useEffect } from "react";
export function countCoordinates(geojson) {
    let count = 0;
    for (const feature of geojson.features) {
      const geometry = feature.geometry;
      if (geometry.type === "Polygon") {
        count += geometry.coordinates[0].length;
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          count += polygon[0].length;
        }
      }
    }
    console.log(count)
    return count;
  }
export const updateGeoJson = (geojson, setgeojson, setnumOfVertices) => {
  if (geojson?.length) {
    setgeojson(prevGeoJson => {
      const newGeoJson = [...prevGeoJson, ...geojson];
        console.log(newGeoJson)
      setnumOfVertices(countCoordinates(newGeoJson));
      return newGeoJson;
    });
  }
};

export const useLocalGeoJson = (localgeojson, setgeojson, setnumOfVertices) => {
  useEffect(() => {
    if (localgeojson) {
      setgeojson(localgeojson);
      setnumOfVertices(countCoordinates(localgeojson));
    }
  }, [localgeojson, setgeojson, setnumOfVertices]);
};

export const useGeoJson = (geojson, setgeojson, setnumOfVertices) => {
  useEffect(() => {
    updateGeoJson(geojson, setgeojson, setnumOfVertices);
    console.log(geojson?.features)
  }, [geojson, setgeojson, setnumOfVertices]);
};
