import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import React, { useEffect, useMemo, useState } from 'react';

export default function MyMap({geodata}){

  const [show, setShow] = useState(false);

  var countyStyle = {
    fillColor : 'red',
    fillOpacity : 0.8,
    color : 'black',
    weight : 1.5
  };

  var highlight = {
		'fillColor': 'yellow',
		'weight': 2,
		'opacity': 1
	};
  
  const onEachCounty = (county,layer) => {
    const county_name = county.properties.NAME;
    layer.draggable = true;
    if(county_name){
      layer.bindPopup(county_name).openPopup();
    }
        layer.on({
          dblclick: (e) => {
            layer.setStyle(highlight)
            let name = prompt("Please Enter a new region name!");
            if(name != null && name != ""){
              county.properties.NAME = name;
              layer.bindPopup(name).openPopup();
            }
          },
    });    
  }

  return (

    <div style={{width : '100%'}}>
        {
          ( geodata && <MapContainer center = {[45, -100.4173]} zoom = {4} scrollWheelZoom = {true} doubleClickZoom = {false}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            
            <GeoJSON data = {geodata.features} style={countyStyle} draggable={true} onEachFeature = {onEachCounty}  />
  
          </MapContainer>
  
      )
        }

    </div>
  ) 
    

}
