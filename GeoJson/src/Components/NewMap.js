import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import React, { useEffect, useMemo, useState, Component } from 'react';
import geodata from '../Data/Counties_USA.json';

export default class NewMap extends Component{
  state = {};

  componentDidMount() {
    console.log(geodata);
  }

  countyStyle = {
    fillColor : 'red',
    fillOpacity : 1,
    color : 'black',
    weight : 2
  };

  render(){
    return (
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
            {/* <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}
            {/* <Marker position={[51.505, -0.09]}>
              < Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>  */}

        <GeoJSON data = {geodata.features} style={this.countyStyle} />

      </MapContainer>
    )
  }


}