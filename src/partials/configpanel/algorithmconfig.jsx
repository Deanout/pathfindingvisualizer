import React from "react";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import store from "../../store/gridstore";
import Tooltip from "@material-ui/core/Tooltip";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import DijkstraSelect from "./dijkstraselect.jsx";
import DirectionConfig from "./directionconfig.jsx";
import AStarSelect from "./astarselect.jsx";
import AStarHeuristicInput from "./astarheuristicinput.jsx";

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
  var dijkstraSelect = <DijkstraSelect pfv={props.pfv}></DijkstraSelect>;
  var directionsConfig = <DirectionConfig></DirectionConfig>;
  var aStarSelect = <AStarSelect pfv={props.pfv}>;</AStarSelect>;
  var aStarHeuristicInput = (
    <AStarHeuristicInput
      defaultHeuristic={store.algorithms[2].config.heuristic}
    ></AStarHeuristicInput>
  );

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
        <Typography>All Algorithms</Typography>
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
          <Grid item xs={12} style={{ marginBottom: 16 }}>
            {directionsConfig}
          </Grid>
        </Grid>
        <Typography>Algorithm Specific Settings</Typography>

        <Grid container style={{ margin: 0 }} direction="row">
          <Grid item xs={8}>
            <Typography style={{ textAlign: "left" }}>
              {store.algorithms[1].name}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Tooltip
              title={store.algorithms[1].summary}
              className={classes.tooltip}
            >
              <HelpOutlineIcon fontSize="small" />
            </Tooltip>
          </Grid>
          <Grid item xs={4}>
            Data Structure
          </Grid>
          <Grid item xs={8}>
            {dijkstraSelect}
          </Grid>
        </Grid>
        <Grid container style={{ margin: 0 }} direction="row">
          <Grid item xs={8}>
            <Typography style={{ textAlign: "left" }}>
              {store.algorithms[2].name}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Tooltip
              title={store.algorithms[2].summary}
              className={classes.tooltip}
            >
              <HelpOutlineIcon fontSize="small" />
            </Tooltip>
          </Grid>
          <Grid item xs={4}>
            Data Structure
          </Grid>
          <Grid item xs={8}>
            {aStarSelect}
          </Grid>

          <Grid item xs={12}>
            {aStarHeuristicInput}
          </Grid>
        </Grid>
      </CardContent>
    </Collapse>
  );
}
