import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import mapData from "../Sources/custom.geo.json";

const MyMap = ({ files }) => {
  let onEach = (target, layer) => {
    console.log(target);
    const continentName = target.properties.continent;
    layer.on({
      mouseover: (e) => {
        layer.bindPopup(continentName).openPopup();
      }
    });
  };

  return (
    <MapContainer center={[35, -100]} zoom={4.5} scrollWheelZoom={true}>
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}

      <GeoJSON data={mapData.features} onEachFeature={onEach} />
    </MapContainer>
  );
};

export default MyMap;
