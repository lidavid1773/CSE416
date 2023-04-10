import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import globeImage from "../assets/globe.jpg";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(6),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  form: {
    width: '80%',
    marginTop: theme.spacing(1),
    marginLeft: '10%',
  },
  container: {
    backgroundColor: '#D6E4EF',
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(2),
    maxWidth: 'md',
  },
  textfield: {
    backgroundColor: 'white',
  },
  options: {
    paddingTop: theme.spacing(15),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  title: {
    marginTop: theme.spacing(5),
    fontSize: 40, 
    fontFamily: 'calibri',
    textAlign: 'center',
  },
  link: {
    padding: theme.spacing(3),
    textAlign: 'center'
  }
}));

export default function LoginPage() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth={false}>
      {/* <CssBaseline/> */}
      <Grid container className={classes.paper}>
        <Grid item xs={8} sm={8} md={5} component={Paper} elevation={6} square 
        className={classes.container}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography className={classes.title}>
              MapWorkshop
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                className={classes.textfield}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                className={classes.textfield}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                href='/home'
                className={classes.submit}
              >
                Log In
              </Button>
              <Grid item className={classes.link}>
                <span>
                  Don't have an account?
                </span>
                <Link href="/register" variant="body2">
                  {" Sign Up"}
                </Link>
              </Grid>
              <Grid item className={classes.link}>
                <Link href='/recover-password' variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </form>
          </Box>
        </Grid>
        {/* <Grid
          item
          xs={4}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${globeImage})`,
            height: "100vh",
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        /> */}
        <img src={globeImage} alt="globe" style={{marginLeft: '5%', width: '50%'}}/>
      </Grid>
    </Container>
  );
}