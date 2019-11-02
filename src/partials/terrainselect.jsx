import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";
import Tooltip from "@material-ui/core/Tooltip";

const BootstrapInput = withStyles(theme => ({
  root: {
    width: 140
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#194B4B",
    color: "white",
    border: "1px solid #ced4da",
    fontSize: 16,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      backgroundColor: "#4B4B4B",
      color: "white"
    }
  }
}))(InputBase);

const useStyles = makeStyles(theme => ({
  root: {
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function TerrainSelect(props) {
  const classes = useStyles();
  const [terrain, setTerrain] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  const handleChange = event => {
    setTerrain(event.target.value);
    props.terrainHandler(event.target.value);
  };

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.margin}>
        <Tooltip
          open={open}
          title="Select a terrain generator. This will overwrite any changes to the current grid and create a terrain based on the algorithm. The default is an animated, recursively generated maze."
        >
          <Select
            value={props.makeTerrainClicked}
            onChange={handleChange}
            onMouseEnter={handleTooltipOpen}
            onMouseLeave={handleTooltipClose}
            onMouseDown={handleTooltipClose}
            input={<BootstrapInput name="terrain" id="terrain" />}
          >
            <MenuItem value={0}>
              <em>Terrain</em>
            </MenuItem>
            <MenuItem value={1}>Recursive Walls</MenuItem>
            <MenuItem value={2}>Simplex Walls</MenuItem>
            <MenuItem value={3}>Random Walls</MenuItem>
          </Select>
        </Tooltip>
      </FormControl>
    </form>
  );
}
