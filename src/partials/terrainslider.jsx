import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles({
  root: {
    width: 140,
    height: 32,
    margin: "auto"
  },
  input: {
    color: "#fff",
    margin: "auto",
    width: 50
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
      <Typography variant="body2" id="input-slider">
        Node Size
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
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
        <Grid item xs={4}>
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
