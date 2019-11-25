import React from "react";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@material-ui/styles";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import ToggleOff from "@material-ui/icons/ToggleOff";
import ToggleOn from "@material-ui/icons/ToggleOn";
import store from "../../store/gridstore";
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
    width: 350,
    height: "auto",
    maxHeight: 175,
    maxWidth: 350,
    backgroundColor: "black",
    resize: "vertical"
  },
  cardContent: {
    maxHeight: 175,
    resize: "vertical",
    overflow: "auto"
  }
}));

const PaintedIcon = styled(ToggleOff)({
  color: "grey"
});

export default function NoiseWallsConfig(props) {
  const [rawNoise, setRawNoise] = React.useState(false);
  const classes = useStyles();

  const fields = [
    store.simplex.threshold,
    store.simplex.seed,
    store.simplex.scale,
    store.simplex.octave,
    store.simplex.persistence,
    store.simplex.lacunarity
  ];

  const resetSimplex = () => {
    store.simplex.resetValues();
  };

  const paintCanvas = () => {
    var canvas = document.getElementById("noisewallscanvas");
    var context = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    var imagedata = context.createImageData(width, height);
    let config = store.simplex;
    var simplex = new SimplexNoise(config.seed.value);
    let persistence = config.persistence.value;
    let lacunarity = config.lacunarity.value;
    var translatedHeight = config.scale.value * (height / props.gridHeight);
    var translatedWidth = config.scale.value * (width / props.gridWidth);

    // Create the image
    function createImage(offset) {
      // Loop over all of the pixels
      for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
          let total = 0;
          let frequency = 1;
          let amplitude = 1;
          let maxValue = 0;
          for (let octave = 0; octave < config.octave.value; octave++) {
            total +=
              simplex.noise2D(
                (row / translatedHeight) * frequency,
                (col / translatedWidth) * frequency
              ) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
          }
          let scaled2D = scaleBetween(total, 0, 1, -maxValue, maxValue);
          //let evaluatedThreshold = [];
          let rgb;
          if (rawNoise) {
            if (scaled2D > config.threshold.value) {
              scaled2D *= 255;
              rgb = [scaled2D, scaled2D, scaled2D];
            } else {
              rgb = [0, 0, 0];
            }
          } else {
            for (let i = 5; i < store.nodeTypes.list.length; i++) {
              let nodeType = store.nodeTypes.list[i];
              if (
                scaled2D <= nodeType.minThreshold ||
                scaled2D > nodeType.maxThreshold
              ) {
                continue;
              } else {
                rgb = nodeType.rgb;
                break;
              }
            }
          }

          // Get the pixel index
          var pixelindex = (row * width + col) * 4;
          let red = rgb[0];
          let green = rgb[1];
          let blue = rgb[2];
          // Set the pixel data
          imagedata.data[pixelindex] = red;
          imagedata.data[pixelindex + 1] = green;
          imagedata.data[pixelindex + 2] = blue;
          imagedata.data[pixelindex + 3] = 255;
        }
      }
    }
    function scaleBetween(unscaledNum, newMin, newMax, oldMin, oldMax) {
      return (
        ((newMax - newMin) * (unscaledNum - oldMin)) / (oldMax - oldMin) +
        newMin
      );
    }
    window.requestAnimationFrame(() => {
      // Create the image
      createImage();
      // Draw the image data to the canvas
      context.putImageData(imagedata, 0, 0);
    });
  };
  if (props.minimize) {
    requestAnimationFrame(() => {
      paintCanvas();
    });
  }

  const handleChange = (param, event, newValue) => {
    let value = isNaN(event.target.value) ? newValue : event.target.value;
    store.simplex.setValueByName(param.name, Number(value));
  };
  const handleBlur = (param, newValue, event) => {
    var value = isNaN(event.target.value) ? newValue : event.target.value;

    store.simplex.setValueByName(
      param.name,
      Math.clamp(value, param.min, param.max)
    );
  };

  const handleKeyDown = event => {
    console.log(event);
  };

  return (
    <Collapse
      in={props.minimize}
      timeout="auto"
      unmountOnExit
      className={classes.collapse}
    >
      {<canvas id="noisewallscanvas" className={classes.noisePreview}></canvas>}
      <Grid container alignItems="flex-start" spacing={1}>
        <Grid item xs={9} style={{ height: 32 }}></Grid>

        <Grid item xs={2} style={{ height: 32 }}>
          {rawNoise ? (
            <ToggleOn
              value="check"
              size="small"
              cursor="pointer"
              style={{ height: 28 }}
              selected={rawNoise}
              onClick={() => {
                setRawNoise(!rawNoise);
              }}
            />
          ) : (
            <PaintedIcon
              value="check"
              size="small"
              cursor="pointer"
              style={{ height: 28 }}
              selected={rawNoise}
              onClick={() => {
                setRawNoise(!rawNoise);
              }}
            />
          )}
        </Grid>
        <Grid item xs={1} style={{ height: 32 }}></Grid>
      </Grid>
      <CardContent className={classes.cardContent}>
        {fields.map((field, fieldIdx) => {
          return (
            <Grid container alignItems="center" key={fieldIdx}>
              <Grid item xs={3}>
                <Typography
                  justify="left"
                  variant="body2"
                  id="threshold-slider"
                  gutterBottom
                >
                  {field.name}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Slider
                  value={props.fields[fieldIdx]}
                  onChange={(newValue, event) =>
                    handleChange(field, newValue, event)
                  }
                  aria-labelledby="threshold-slider"
                  step={field.step}
                  min={field.min}
                  max={field.max}
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  value={props.fields[fieldIdx]}
                  margin="dense"
                  onChange={(newValue, event) =>
                    handleChange(field, newValue, event)
                  }
                  onBlur={(event, newValue) =>
                    handleBlur(field, newValue, event)
                  }
                  inputProps={{
                    step: field.step,
                    min: field.min,
                    max: field.max,
                    type: "number",
                    "aria-labelledby": "threshold-input"
                  }}
                />
              </Grid>
            </Grid>
          );
        })}
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={6}>
            <Button
              color="inherit"
              onClick={() => props.pfv.generateTerrain(2)}
            >
              Make Terrain
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button color="inherit" onClick={() => resetSimplex()}>
              Reset Noise
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Collapse>
  );
}
