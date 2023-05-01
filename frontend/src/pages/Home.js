import { useSelector } from "react-redux";

function Home() {
  // if user is null, user is a guest.
  const { user } = useSelector((state) => state.user);

  return (
    <div>
      {user ? (
        <div>
          <div>Home Page</div>
          <div>Welcome back, {user.username}!</div>
          <button>Import map from profile</button>
          <button>Upload Shapefile</button>
          <button>Upload GeoJSON</button>
        </div>
      ) : (
        <div>
          <div>Home Page</div>
          <div>You are browsing as a guest</div>
          <button>Upload Shapefile</button>
          <button>Upload GeoJSON</button>
        </div>
      )}
    </div>
  );
}

export default Home;
