import { useState } from "react";
import Banner from "../components/Banner";
import FileUploader from "../components/FileUploader";
import ProjectControls from "../components/ProjectControls";
import EditMapPage from "./EditMapPage.js";

const HomePage = () => {
  const [fileUploaded, setFileUploaded] = useState(false);

  return (
    <div>
      <Banner />

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
