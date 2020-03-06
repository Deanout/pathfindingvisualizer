import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles({
  root: {},
  heuristicGrid: {
    padding: 8
  }
});

export default function AStarHeuristicInput(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.defaultHeuristic);

  const handleInputChange = event => {
    let newValue = event.target.value === "" ? "" : Number(event.target.value);
    setValue(newValue);
    store.algorithms[2].config.heuristic = newValue;
    // set val in store
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 10000) {
      setValue(10000);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.heuristicGrid}>
        <Grid item xs={6}>
          <Typography align="left">Heuristic</Typography>
        </Grid>
        <Grid item xs={6}>
          <Input
            className={classes.input}
            value={typeof value === "number" ? value : 0.001}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 0.005,
              min: 0,
              max: 10000,
              type: "number",
              "aria-labelledby": "input-slider"
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
