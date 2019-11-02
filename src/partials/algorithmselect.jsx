import React, { useEffect } from "react";
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

export default function AlgorithmSelect(props) {
  const classes = useStyles();
  const [algorithm, setAlgorithm] = React.useState(0);
  const [mouseAlgorithm, setMouseAlgorithm] = React.useState(algorithm);
  const [open, setOpen] = React.useState(false);
  var textStyle = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  var toolTips = [];

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  const handleMouseAlgorithm = input => {
    if (mouseAlgorithm != input) {
      setMouseAlgorithm(input);
    }
  };
  const handleChange = event => {
    setAlgorithm(event.target.value);
    props.algorithmHandler(event.target.value);
  };

  return (
    <Tooltip
      title={store.algorithms[mouseAlgorithm].summary}
      placement="right"
      enterDelay={500}
    >
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.margin}>
          <Select
            value={props.visualizeClicked}
            onChange={handleChange}
            input={<BootstrapInput name="algorithm" id="algorithm" />}
          >
            <MenuItem value={0} onMouseEnter={() => handleMouseAlgorithm(0)}>
              <em>Algorithms</em>
            </MenuItem>

            <MenuItem value={1} onMouseEnter={() => handleMouseAlgorithm(1)}>
              <div style={textStyle}>Dijkstra's Algorithm</div>
            </MenuItem>

            <MenuItem value={2} onMouseEnter={() => handleMouseAlgorithm(2)}>
              <div style={textStyle}>A* Search</div>
            </MenuItem>
            <MenuItem value={3} onMouseEnter={() => handleMouseAlgorithm(3)}>
              <div style={textStyle}>Breadth First Search</div>
            </MenuItem>
            <MenuItem value={4} onMouseEnter={() => handleMouseAlgorithm(4)}>
              <div style={textStyle}>Depth First Search</div>
            </MenuItem>
            <MenuItem value={5} onMouseEnter={() => handleMouseAlgorithm(5)}>
              <div style={textStyle}>A* Priority Queue</div>
            </MenuItem>
          </Select>
        </FormControl>
      </form>
    </Tooltip>
  );
}
