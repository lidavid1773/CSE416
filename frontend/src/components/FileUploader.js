import Button from '@mui/material/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justify: 'center',
  },
  button: {
    margin: '0% 30%'
  }
}));

export default function FileUploader() {
  const classes = useStyles();
  return (
    <div className={classes.paper}>
      <div className={classes.button}>
        <Button 
          sx={{ 
            width: 'auto',
            textTransform: 'none',
            color: 'white',
            backgroundColor: '#0A95FF',
            '&:hover': {
              color: 'white',
              backgroundColor: '#65BCFF',
            },
          }}
        >
          SHP/DBF Upload
        </Button>
      </div>
      <div>
        <Button sx={{ 
          textTransform: 'none',
          color: 'white',
          backgroundColor: '#0A95FF',
          '&:hover': {
            color: 'white',
            backgroundColor: '#65BCFF',
          },
        }}>
          GeoJson Upload
        </Button>
      </div>
    </div>
  );
};