import { MapContainer, GeoJSON } from "react-leaflet";
import geoData from "../example-maps/us_states.json";

const ViewMapPage = () => {
  return (
    <div>
      <MapContainer center={[35, -100]} zoom={4.5} scrollWheelZoom={true}>
        <GeoJSON data={geoData} />
      </MapContainer>
    </div>
  );
};

export default ViewMapPage;
