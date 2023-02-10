import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap
} from "react-leaflet";
import L, { Polygon } from "leaflet";
import mapData from "../Sources/us_states.json";
import { useState, useEffect } from "react";

const MyMap = ({ files }) => {
  let map = useMap();

  // Visually select state
  let updateColor = (e) => {
    e.target.setStyle({
      color: "#666",
      fillColor: "#007eff"
    });
  };

  // Each target is a state bc our json file is for us states. App should be able to work for different types of geojson files, where target.properties.field may vary
  let onEachState = (state, layer) => {
    let polygon = L.polygon(state.geometry.coordinates);
    let latlng = polygon.getBounds().getCenter();
    L.popup({ closeOnClick: false, autoClose: false, closeButton: false })
      .setLatLng({ lat: latlng.lng, lng: latlng.lat })
      .setContent(`<p>${state.properties.NAME}</p>`)
      .openOn(map);

    // let popup = L.popup({
    //   closeOnClick: false,
    //   autoClose: false,
    //   closeButton: false
    // })
    //   .setLatLng({ lat: latlng.lng, lng: latlng.lat })
    //   .setContent(`<p>${state.properties.NAME}</p>`);

    // layer.bindPopup(popup).addTo(map);
    // layer.openPopup();
    // layer.closePopup();

    // Set layer event handlers
    layer.on({
      click: (e) => {
        // console.log(state);
        // layer.closePopup();
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 1,
          fillColor: "#007eff"
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.25,
          color: "#3388ff",
          fillColor: "#3388ff"
        });
      },
      dblclick: (e) => {
        let name = prompt("Please enter new name:");
        if (name != null && name !== "") {
          layer.unbindPopup();
          polygon = L.polygon(state.geometry.coordinates);
          latlng = polygon.getBounds().getCenter();
          // Create popup w/ new name
          L.popup({ closeOnClick: false, autoClose: false, closeButton: false })
            .setLatLng({ lat: latlng.lng, lng: latlng.lat })
            .setContent(`<p>${name}</p>`)
            .openOn(map);
        }
        updateColor(e);
      }
    });
  };

  return (
    <div>
      {/* Put a popup w/ state's name for each state in map*/}
      {/* {mapData.features.forEach((obj) => {
        let polygon = L.polygon(obj.geometry.coordinates);
        let latlng = polygon.getBounds().getCenter();
        L.popup({ closeOnClick: false, autoClose: false, closeButton: false })
          .setLatLng({ lat: latlng.lng, lng: latlng.lat })
          .setContent(`<p>${obj.properties.NAME}</p>`)
          .openOn(map);
      })} */}

      <GeoJSON data={mapData.features} onEachFeature={onEachState} />
    </div>
  );
};

export default MyMap;
