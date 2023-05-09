import { useSelector } from "react-redux";
import EditMap from "../components/EditMap";
import UploadFile from "../components/UploadFile";
function Home() {
  // if user is null, user is a guest.
  const { user } = useSelector((state) => state.user);

  return (
    <div>
      <div>Home Page</div>
      {user ? (
        <div>
          <div>Welcome back, {user.username}!</div>
          <button>Import map from profile</button>
        </div>
      ) : (
        <div>
          <div>You are browsing as a guest</div>
        </div>
      )}
      <UploadFile></UploadFile>
      <button>Upload GeoJSON</button>
      <EditMap />
   
    </div>
  );
}

export default Home;
