import { useState } from "react";
import Banner from "../components/Banner";
import FileUploader from "../components/FileUploader";
import ProjectControls from "../components/ProjectControls";
import ViewMapPage from "./ViewMapPage.js";

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

      {fileUploaded && <ViewMapPage />}
    </div>
  );
};

export default HomePage;
