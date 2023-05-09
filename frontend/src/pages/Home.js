import { useSelector } from "react-redux";
import EditMap from "../components/EditMap";
import UploadFileButtons from "../components/UploadFileButtons";
import { FileType } from "../components/UploadFileButtons";
import { useEffect } from "react";

function Home() {
  // if user is null, user is a guest.
  const { user } = useSelector((state) => state.user);

  const createUploadComponents = () => {
    const fileTypes = Object.values(FileType);
    return fileTypes.map(fileType => (
      <UploadFileButtons key={fileType} fileType={fileType} />
    ));
  }

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
      {createUploadComponents()}
      <EditMap />
    </div>
  );
}

export default Home;
