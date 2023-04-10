import { useState } from "react";
import { useLocation } from "react-router-dom";
import Banner from "../components/Banner";
import FileUploader from "../components/FileUploader";
import ProjectControls from "../components/ProjectControls";
import EditMapPage from "./EditMapPage.js";
import Button from '@mui/material/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justify: 'center',
  },
  link: {
    cursor: 'pointer',
    fontSize: 40, 
    padding: theme.spacing(5),
  },
  guest_link: {
    cursor: 'pointer',
    fontSize: 20,
  },
  options: {
    paddingTop: theme.spacing(15),
  },
  title: {
    fontSize: 70, 
    fontFamily: 'calibri',
  }
}));

const HomePage = () => {
  const location = useLocation();
  const classes = useStyles();

  const [fileUploaded, setFileUploaded] = useState(false);

  return (
    <div>
      <Banner isGuest={location.state.isGuest} />
      {!fileUploaded && (
          <Button onClick={() => setFileUploaded(true)}>
            mimic file uploaded
          </Button>
      )}
      <div className={classes.paper}>
        {!fileUploaded ? <FileUploader /> : <ProjectControls />}

        {fileUploaded && <EditMapPage />}
      </div>
    </div>
  );
};

export default HomePage;
