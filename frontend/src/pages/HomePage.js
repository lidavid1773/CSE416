import { useState } from "react";
import Banner from "../components/Banner";
import FileUploader from "../components/FileUploader";
import ProjectControls from "../components/ProjectControls";
import EditMapPage from "./EditMapPage.js";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const location = useLocation();

  const [fileUploaded, setFileUploaded] = useState(false);

  return (
    <div>
      <Banner isGuest={location.state.isGuest} />

      {!fileUploaded && (
        <button onClick={() => setFileUploaded(true)}>
          mimic file uploaded
        </button>
      )}

      {!fileUploaded ? <FileUploader /> : <ProjectControls />}

      {fileUploaded && <EditMapPage />}
    </div>
  );
};

export default HomePage;
