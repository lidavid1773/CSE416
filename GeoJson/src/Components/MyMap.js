import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import React, { useEffect, useMemo, useState } from 'react';

export default function MyMap({geodata}){
  const onEachCounty = (county,layer) => {
    const county_name = county.properties.NAME;
    layer.on({
      mouseover: (e) => {
        layer.bindPopup(county_name).openPopup();
      },
    });    
  }

  var countyStyle = {
    fillColor : 'red',
    fillOpacity : 0.8,
    color : 'black',
    weight : 1.5
  };

  return (
    (geodata && <MapContainer center={[45, -100.4173]} zoom={4} scrollWheelZoom={true}>
            <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />

        <GeoJSON data = {geodata.features} style={countyStyle} draggable={true} onEachFeature={onEachCounty} />

      </MapContainer>
    )

  )

}
