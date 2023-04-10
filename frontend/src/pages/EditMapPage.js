import { MapContainer, GeoJSON } from "react-leaflet";
import geoData from "../example-maps/us_states.json";

const EditMapPage = () => {
  return (
    <div style={{marginTop: '10%', borderStyle: 'solid'}}>
      <MapContainer center={[25, -100]} zoom={4.2} scrollWheelZoom={true}>
        <GeoJSON data={geoData} />
      </MapContainer>
    </div>
  );
};

export default EditMapPage;
