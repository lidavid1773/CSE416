import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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

export default function WelcomePage() {
  const classes = useStyles();

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Typography className={classes.title}>
          Map Workshop
        </Typography>
        <div className={classes.options}>
          <Link className={classes.link} href='/login'>
              Log In
          </Link>
          <Link className={classes.link} href='/register'>
              Sign Up
          </Link>
        </div>
        <div className={classes.options}>
          <Link className={classes.guest_link} underline='always' href="/home" state={{ isGuest: true }}>
            Continue as guest
          </Link>
        </div>
      </div>
    </Container>
  );
};