import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  button: {
    backgroundColor: "blue",
    color: "white",
    borderRadius: "4px",
    padding: "10px 20px",
    "&:hover": {
      backgroundColor: "darkblue"
    }
  }
});

const MyButton = (props) => {
  const classes = useStyles();

  return (
    <Button className={classes.button} {...props}>
      {props.children}
    </Button>
  );
};

export default MyButton;
