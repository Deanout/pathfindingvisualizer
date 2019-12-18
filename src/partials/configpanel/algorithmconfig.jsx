import React from "react";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import store from "../../store/gridstore";

const useStyles = makeStyles(theme => ({
  collapse: {
    position: "absolute",
    maxWidth: 350,
    fontSize: 12,
    zIndex: 9,
    fontFamily: ["Open Sans", "sans-serif"],
    textTransform: "capitalize",
    color: "black",
    background: "#fffb"
  },

  cardContent: {
    maxHeight: 400,
    maxWidth: 350,
    height: 400,
    width: 350,
    resize: "vertical",
    overflow: "auto",
    padding: 0
  }
}));

export default function AlgorithmConfig(props) {
  const [animSpeed, setAnimSpeed] = React.useState(props.animSpeed);
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    let value = isNaN(event.target.value) ? newValue : event.target.value;
    console.log(value);
    setAnimSpeed(value);
    store.currentAnimationSpeed = Number(value);
  };
  const handleBlur = (newValue, event) => {
    var value = isNaN(event.target.value) ? newValue : event.target.value;
    setAnimSpeed(value);
    store.currentAnimationSpeed = Math.clamp(value, 1, 1000);
  };
  return (
    <Collapse
      in={props.minimize}
      timeout="auto"
      unmountOnExit
      className={classes.collapse}
    >
      <CardContent className={classes.cardContent}>
        <Grid container alignItems="center">
          <Grid item xs={3}>
            <Typography
              justify="left"
              variant="body2"
              id="threshold-slider"
              gutterBottom
            >
              Animation Speed
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Slider
              value={animSpeed}
              onChange={(newValue, event) => handleChange(newValue, event)}
              aria-labelledby="threshold-slider"
              step={1}
              min={1}
              max={1000}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              value={animSpeed}
              margin="dense"
              onChange={(newValue, event) => handleChange(newValue, event)}
              onBlur={(event, newValue) => handleBlur(newValue, event)}
              inputProps={{
                step: 1,
                min: 1,
                max: 1000,
                type: "number",
                "aria-labelledby": "threshold-input"
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Collapse>
  );
}
