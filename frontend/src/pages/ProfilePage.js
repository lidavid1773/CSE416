import MapItem from "../components/MapItem";
import OwnedMap from "../components/OwnedMap";

const ProfilePage = () => {
  // Temporarily hardcode so that yoyo can style MapItem component
  return (
    <div>
      <div>
        {[1].map((map) => {
          return <OwnedMap />;
        })}
      </div>
      <div>Maps</div>
      <div>
        {[1].map((map) => {
          return <MapItem map={map} />;
        })}
      </div>
    </div>
  );
};

export default ProfilePage;
