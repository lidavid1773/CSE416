import Button from '@mui/material/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justify: 'center',
  },
  button: {
    margin: '0% 15%'
  }
}));

export default function ProjectControls() {
  const classes = useStyles();
  return (
    <div className={classes.paper}>
      <div className={classes.button}>
        <Button 
          sx={{ 
            minWidth: 100,
            textTransform: 'none',
            color: 'white',
            backgroundColor: '#0A95FF',
            '&:hover': {
              color: 'white',
              backgroundColor: '#65BCFF',
            },
          }}
        >
          New
        </Button>
      </div>
      <div>
        <Button sx={{ 
          minWidth: 100,
          textTransform: 'none',
          color: 'white',
          backgroundColor: '#0A95FF',
          '&:hover': {
            color: 'white',
            backgroundColor: '#65BCFF',
          },
        }}>
          Save
        </Button>
      </div>
      <div className={classes.button}>
        <Button 
          sx={{ 
            minWidth: 100,
            textTransform: 'none',
            color: 'white',
            backgroundColor: '#0A95FF',
            '&:hover': {
              color: 'white',
              backgroundColor: '#65BCFF',
            },
          }}
        >
          Export
        </Button>
      </div>
      <div>
        <Button sx={{ 
          minWidth: 150,
          textTransform: 'none',
          color: 'white',
          backgroundColor: '#0A95FF',
          '&:hover': {
            color: 'white',
            backgroundColor: '#65BCFF',
          },
        }}>
          Invite Others
        </Button>
      </div>
    </div>
  );
};