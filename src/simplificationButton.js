import { useEffect,useContext } from "react";
import { addButton } from "./addButton";
import { simplify } from "@turf/turf";
import  {GlobalGeoJsonContext }from "./App"
import L, { easyButton } from "leaflet";

export default function SimplificationButton(api) {
    var [map, mapData] = [api.map, api.mapData];
    
    const [geojson,setgeojson] = useContext(GlobalGeoJsonContext);
    
    
    // console.log(mapData)
    const handleSimplify = () => {
        
        var options = { tolerance: 0.5, highQuality: true };
        var newGeoJson =simplify(geojson,options);
        setgeojson(newGeoJson)
        // console.log(newGeoJson)
        updateMap(map,newGeoJson);
    }
    if( !Array.isArray(geojson) )
    addButton("Simplify All Vertices", handleSimplify,map)
    useEffect(() => {
        if (!map) return;
        // if(geojson?.length>0)
       
       
        // var helloPopup = L.popup().setContent('Hello World!');
        // <button onClick={handleSimplify}> Simplify All Vertices"</button>
      }, [geojson]);
    return;
}


const updateMap = (map, geojson) => {
    // Create a new geojson layer
    // const geojsonLayer = L.geoJSON(geojson);
  
    // // Clear any existing geojson layers on the map
    // map.eachLayer(layer => {
    //   if (layer instanceof L.GeoJSON) {
    //     console.log(layer)
    //     map.removeLayer(layer);
    //   }
    // });
  
    // // Add the new geojson layer to the map
    // geojsonLayer.addTo(map);
    map.eachLayer(function(layer) {
      map.removeLayer(layer);
    });
    // setgeojson(geojson)
  };