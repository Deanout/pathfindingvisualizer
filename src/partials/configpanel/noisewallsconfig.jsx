import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { noiseWalls } from "../../algorithms/noisewalls";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import store from "../../pathfindingvisualizer/gridstore";
var SimplexNoise = require("../../libraries/simplex-noise.js");

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
  noisePreview: {
    maxHeight: 200,
    maxWidth: 350,
    backgroundColor: "black"
  }
}));

export default function NoiseWallsConfig(props) {
  const classes = useStyles();
  const handleThresholdChange = (event, newValue) => {
    store.simplex.threshold = newValue;
  };
  const handleSeedChange = (event, newValue) => {
    store.simplex.seed = newValue;
  };
  const handleScaleChange = (event, newValue) => {
    store.simplex.scale = newValue;
  };
  const handleThresholdInputChange = event => {
    if (event.target.value === "") {
    } else {
      store.simplex.threshold = Number(event.target.value);
    }
  };
  const handleSeedInputChange = event => {
    if (event.target.value === "") {
    } else {
      store.simplex.seed = Number(event.target.value);
    }
  };
  const handleScaleInputChange = event => {
    if (event.target.value === "") {
    } else {
      store.simplex.scale = Number(event.target.value);
    }
  };

  const handleThresholdBlur = () => {
    if (props.threshold < store.simplex.minThreshold) {
      store.simplex.threshold = store.simplex.minThreshold;
    } else if (props.threshold > store.simplex.maxThreshold) {
      store.simplex.threshold = store.simplex.maxThreshold;
    }
  };
  const handleSeedBlur = () => {
    if (props.seed < store.simplex.minSeed) {
      store.simplex.seed = store.simplex.minSeed;
    } else if (props.seed > store.simplex.maxSeed) {
      store.simplex.seed = store.simplex.maxSeed;
    }
  };
  const handleScaleBlur = () => {
    if (props.scale < store.simplex.minScale) {
      store.simplex.scale = store.simplex.minScale;
    } else if (props.scale > store.simplex.maxScale) {
      store.simplex.scale = store.simplex.maxScale;
    }
  };
  const resetSimplex = () => {
    store.simplex.seed = store.simplex.defaultSeed;
    store.simplex.threshold = store.simplex.defaultThreshold;
    store.simplex.scale = store.simplex.defaultScale;
  };
  const paintCanvas = () => {
    var canvas = document.getElementById("noisewallscanvas");
    var context = canvas.getContext("2d");
    /*
       canvas.width = 958;
      canvas.height = 748;
    */
    var width = canvas.width;
    var height = canvas.height;
    var imagedata = context.createImageData(width, height);
    let config = store.simplex;
    var simplex = new SimplexNoise(config.seed);
    var noise2D;
    var scaledNoise2D;
    var nodes = [];

    // Create the image
    function createImage(offset) {
      // Loop over all of the pixels
      // 29*38
      for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
          noise2D = simplex.noise2D(
            row / (config.scale * (height / store.gridHeight)),
            col / (config.scale * (width / store.gridWidth))
          );
          noise2D = noise2D > store.simplex.threshold ? noise2D : 1;
          scaledNoise2D = scaleBetween(noise2D, 0, 255, -1, 1);
          if (scaledNoise2D < config.threshold) {
            scaledNoise2D = 0;
          }

          // Get the pixel index
          var pixelindex = (row * width + col) * 4;
          var result = scaledNoise2D;
          // Set the pixel data
          imagedata.data[pixelindex] = result; // Red
          imagedata.data[pixelindex + 1] = result; // Green
          imagedata.data[pixelindex + 2] = result; // Blue
          imagedata.data[pixelindex + 3] = 255; // Alpha
        }
      }
    }
    function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
      return (
        ((maxAllowed - minAllowed) * (unscaledNum - min)) / (max - min) +
        minAllowed
      );
    }
    // Main loop
    function main(tframe) {
      // Request animation frames
      window.requestAnimationFrame(main);

      // Create the image
      createImage(Math.floor(tframe / 10));

      // Draw the image data to the canvas
      context.putImageData(imagedata, 0, 0);
    }
    // Call the main loop
    main(0);
  };
  if (props.minimize) {
    requestAnimationFrame(() => {
      paintCanvas();
    });
  }

  return (
    <Collapse
      in={props.minimize}
      timeout="auto"
      unmountOnExit
      className={classes.collapse}
    >
      {<canvas id="noisewallscanvas" className={classes.noisePreview}></canvas>}
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
              step={store.simplex.stepThreshold}
              min={store.simplex.minThreshold}
              max={store.simplex.maxThreshold}
            />
          </Grid>

          <Grid item xs={3}>
            <Input
              value={props.threshold}
              margin="dense"
              onChange={handleThresholdInputChange}
              onBlur={handleThresholdBlur}
              inputProps={{
                step: store.simplex.stepThreshold,
                min: store.simplex.minThreshold,
                max: store.simplex.maxThreshold,
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
              step={store.simplex.stepSeed}
              min={store.simplex.minSeed}
              max={store.simplex.maxSeed}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              value={props.seed}
              margin="dense"
              onChange={handleSeedInputChange}
              onBlur={handleSeedBlur}
              inputProps={{
                step: store.simplex.stepSeed,
                min: store.simplex.minSeed,
                max: store.simplex.maxSeed,
                type: "number",
                "aria-labelledby": "seed-input"
              }}
            />
          </Grid>
        </Grid>
        <Typography id="threshold-slider" gutterBottom>
          Scale
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <Slider
              value={props.scale}
              onChange={handleScaleChange}
              aria-labelledby="scale-slider"
              step={store.simplex.stepScale}
              min={store.simplex.minScale}
              max={store.simplex.maxScale}
            />
          </Grid>

          <Grid item xs={3}>
            <Input
              value={props.scale}
              margin="dense"
              onChange={handleScaleInputChange}
              onBlur={handleScaleBlur}
              inputProps={{
                step: store.simplex.stepScale,
                min: store.simplex.minScale,
                max: store.simplex.maxScale,
                type: "number",
                "aria-labelledby": "threshold-input"
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
