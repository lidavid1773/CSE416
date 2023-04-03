// geojsonHooks.js
import { useEffect } from "react";
export function countCoordinates(geojson) {
    let count = 0;
    if (geojson.features === undefined) return 0
    geojson.features.forEach(features => {
        var coordinates = features.geometry.coordinates
        // console.log(features.geometry.type)
        // console.log(coordinates)
        if (features.geometry.type === 'MultiPolygon') {
            coordinates.forEach(coords => {
                count += coords[0].length;
            })
        }
        else {
            count += coordinates[0].length
        }
    }
    )
    return count;
}
export const updateGeoJson = (geojson, setgeojson, setnumOfVertices) => {
    // console.log("newGeoJson")
    // console.log(geojson?.length)
    if (geojson?.length) {
        setgeojson(prevGeoJson => {
            const newGeoJson = [...prevGeoJson, ...geojson];

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
        if (geojson)
            setnumOfVertices(countCoordinates(geojson));
    }, [geojson, setgeojson, setnumOfVertices]);
};
