import L, { marker } from "leaflet";
export const markerIcon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    // specify the path here
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
  });
