import EditMap from "../components/GraphicEditorComponents/GraphicEditingMap";
import UploadFileButtons from "../components/UploadFileButtons";
import { FileType } from "../components/UploadFileButtons";
import { useSelector, useDispatch } from "react-redux";
import { setGeojson } from '../features/geojson/geojsonSlice';
import localgeojson from "../maps/geojson (17).json";
import Dropdown, { DownloadDropdownMenuType, ModeDropdownMenuType } from "../components/GraphicEditorComponents/Dropdown";
import GraphicEditor from "../components/GraphicEditorComponents/GraphicEditor";
function Home() {
  const { user } = useSelector((state) => state.user);
  const graphicEditor = useSelector((state) => state.graphicEditor);
  const geojson = useSelector((state) => state.geojsonController.geojson);

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
      <div >
        {createUploadComponents()}
        {geojson && <span>
          {<Dropdown DropdownMenuType={DownloadDropdownMenuType} />}
          {<Dropdown DropdownMenuType={ModeDropdownMenuType} />}
        </span>}

      </div>
      <div>
        {graphicEditor["Editing Mode"] === "Graphic Editing" && <div className="grid-container">
          <EditMap />
          <GraphicEditor />
        </div>}

      </div>

    </div>
  );
}

export default Home;
