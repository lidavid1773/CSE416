import { GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";

const MyMap = ({ geoData }) => {
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
    // Put a popup w/ state's name for each state in map*/
    // .ADMIN or .NAME is hardcoded. After prototype, find a way to work for all
    L.popup({ closeOnClick: false, autoClose: false, closeButton: false })
      .setLatLng({ lat: latlng.lng, lng: latlng.lat })
      .setContent(`<p>${state.properties.ADMIN || state.properties.NAME}</p>`)
      .openOn(map);

    // Set layer event handlers
    layer.on({
      mouseover: () => {
        layer.setStyle({
          fillOpacity: 1,
          fillColor: "#007eff"
        });
      },
      mouseout: () => {
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
      <GeoJSON data={geoData.features} onEachFeature={onEachState} />
    </div>
  );
};

export default MyMap;
