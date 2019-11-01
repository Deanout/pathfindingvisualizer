import React from "react";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { noiseWalls } from "../../algorithms/noisewalls";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import store from "../../pathfindingvisualizer/gridstore";

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
  cardContent: {}
}));

export default function NoiseWallsConfig(props) {
  const classes = useStyles();
  const handleThresholdChange = (event, newValue) => {
    store.simplex.threshold = newValue;
    props.noiseWallsHandler();
  };
  const handleSeedChange = (event, newValue) => {
    store.simplex.seed = newValue;
    props.noiseWallsHandler();
  };
  const handleThresholdInputChange = event => {
    if (event.target.value === "") {
    } else {
      store.simplex.threshold = Number(event.target.value);
      props.noiseWallsHandler();
    }
  };
  const handleSeedInputChange = event => {
    if (event.target.value === "") {
    } else {
      store.simplex.seed = Number(event.target.value);
      props.noiseWallsHandler();
    }
  };

  const handleThresholdBlur = () => {
    if (props.threshold < -1) {
      store.simplex.threshold = -1;
      props.noiseWallsHandler();
    } else if (props.threshold > 1) {
      store.simplex.threshold = 1;
      props.noiseWallsHandler();
    }
  };
  const handleSeedBlur = () => {
    if (props.seed < 0) {
      store.simplex.seed = 0;
      props.noiseWallsHandler();
    } else if (props.seed > 1000000) {
      store.simplex.seed = 1000000;
      props.noiseWallsHandler();
    }
  };
  const resetSimplex = () => {
    store.simplex.seed = store.simplex.defaultSeed;
    store.simplex.threshold = store.simplex.defaultThreshold;
    props.noiseWallsHandler();
  };
  return (
    <Collapse
      in={props.minimize}
      timeout="auto"
      unmountOnExit
      className={classes.collapse}
    >
      <CardContent className={classes.cardContent}>
        <Typography id="threshold-slider" gutterBottom>
          Threshold
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <Slider
              value={props.threshold}
              onChange={handleThresholdChange}
              aria-labelledby="threshold-slider"
              step={0.1}
              min={-1}
              max={1}
            />
          </Grid>

          <Grid item xs={3}>
            <Input
              value={props.threshold}
              margin="dense"
              onChange={handleThresholdInputChange}
              onBlur={handleThresholdBlur}
              inputProps={{
                step: 0.1,
                min: -1,
                max: 1,
                type: "number",
                "aria-labelledby": "threshold-input"
              }}
            />
          </Grid>
        </Grid>
        <Typography id="seed-slider" gutterBottom>
          Seed
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <Slider
              value={props.seed}
              onChange={handleSeedChange}
              aria-labelledby="seed-slider"
              step={1}
              min={0}
              max={1000000}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              value={props.seed}
              margin="dense"
              onChange={handleSeedInputChange}
              onBlur={handleSeedBlur}
              inputProps={{
                step: 1,
                min: 0,
                max: 1000000,
                type: "number",
                "aria-labelledby": "seed-input"
              }}
            />
          </Grid>
        </Grid>
        <Button color="inherit" onClick={() => props.pfv.noiseWalls()}>
          Run Simplex Noise
        </Button>
        <Button color="inherit" onClick={() => resetSimplex()}>
          Reset Simplex Noise
        </Button>
      </CardContent>
    </Collapse>
  );
}
