import React from 'react';
import { useState } from "react";
import BannerModal from "./Modals/BannerModal";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';

const SearchBar = ({setSearchQuery}) => (
  <form style={{width: '50%', margin: '0% 10%'}}>
    <TextField
      id="search-bar"
      className="text"
      onInput={(e) => {
        setSearchQuery(e.target.value);
      }}
      label="Search"
      variant="outlined"
      placeholder="Search..."
      size="small"
      style={{width: '80%'}}
    />
    <IconButton type="submit" aria-label="search">
      <SearchIcon style={{ fill: "blue", padding: "0%"}} />
    </IconButton>
  </form>
);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    marginLeft: '100%',
  },
  title: {
    margin: theme.spacing(2),
    fontSize: 30, 
    fontFamily: 'calibri',
  },
}));

export default function Banner(isGuest)  {
  const classes = useStyles(); 
  // const [openModal, setOpenModal] = useState(false);

  return (
    <Grid container className={classes.paper}>
      <Typography className={classes.title}>
        MapWorkshop
      </Typography>
      <SearchBar/>
      <BannerModal isGuest={isGuest}/>
      {/* <div>
        <Button className={classes.menu} onClick={() => setOpenModal(!openModal)}>
          <MenuIcon fontSize="large"/>
        </Button>
      </div>
      {openModal && <BannerModal isGuest={isGuest} />} */}
    </Grid>
  );
};
