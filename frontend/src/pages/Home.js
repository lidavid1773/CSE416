import { useSelector } from "react-redux";
import EditMap from "../components/EditMap";
import UploadFile from "../components/UploadFile";
import { FileType } from "../components/UploadFile";
function Home() {
  // if user is null, user is a guest.
  const { user } = useSelector((state) => state.user);
  const createUploadComponents = () => {
    const fileTypes = Object.values(FileType);
    return fileTypes.map(fileType => (
      <UploadFile key={fileType} fileType={fileType} />
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
