import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";

const BootstrapInput = withStyles(theme => ({
  root: {
    width: 140,
    margin: "auto"
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#3EC3FF",
    color: "white",
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      backgroundColor: "#3EC3FF",
      color: "white"
    }
  }
}))(InputBase);

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function SimpleSelect() {
  const classes = useStyles();
  const [algorithm, setAlgorithm] = React.useState(0);
  const handleChange = event => {
    setAlgorithm(event.target.value);
  };
  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.margin}>
        <Select
          value={algorithm}
          onChange={handleChange}
          input={<BootstrapInput name="algorithm" id="age-customized-select" />}
        >
          <MenuItem value={0}>
            <em>Algorithms</em>
          </MenuItem>
          <MenuItem value={1}>Dijkstra's Algorithm</MenuItem>
          <MenuItem value={2}>A* Search</MenuItem>
        </Select>
      </FormControl>
    </form>
  );
}
