import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import VolumeUp from "@material-ui/icons/VolumeUp";
import store from "../store/gridstore";

const useStyles = makeStyles({
  root: {
    width: 250
  },
  input: {
    width: 42,
    color: "#fff"
  },
  slider: {
    color: "#fff"
  }
});

export default function TerrainSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.width);
  const [resizeTimer, setResizeTimer] = React.useState();

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    store.nodeSize = newValue;
    clearTimeout(resizeTimer);
    setResizeTimer(
      setTimeout(() => {
        store.resetNodeSize(newValue);
        props.pfv.resizeGrid();
      }, 1000)
    );
  };

  const handleInputChange = event => {
    let newValue = event.target.value === "" ? "" : Number(event.target.value);
    setValue(newValue);
    store.nodeSize = newValue;
    clearTimeout(resizeTimer);
    setResizeTimer(
      setTimeout(() => {
        store.resetNodeSize(newValue);
        props.pfv.resizeGrid();
      }, 1000)
    );
  };

  const handleBlur = () => {
    if (value < 5) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="input-slider" gutterBottom>
        Node Size
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            className={classes.slider}
            value={typeof value === "number" ? value : 25}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            step={10}
            min={10}
            max={100}
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 5,
              min: 10,
              max: 200,
              type: "number",
              "aria-labelledby": "input-slider"
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
