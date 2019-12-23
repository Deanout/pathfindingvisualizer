import React from "react";
import Sortable from "sortablejs";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import store from "../../store/gridstore";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    minHeight: 128,
    fontFamily: ["Open Sans", "sans-serif"],
    padding: 8
  }
}));
var enabledDirections;
var disabledDirections;
var defaultEnabledDirections;
var defaultDisabledDirections;
export default function DirectionConfig() {
  const classes = useStyles();
  const [directions, setDirections] = React.useState([1, 2, 3, 4]);

  enabledDirections = window.enabledDirections = (
    <List dense className={classes.root} id="enabledDirections">
      <Tooltip title="List of enabled directions that the algorithms may explore. Enabling only the default 4 results in manhattan traversal, while enabling all eight results in fully diagonal movement. Other combinations will result in niche movement restrictions.">
        <Typography
          onClick={event => handleDirectionChange(event, "Enable")}
          style={{ cursor: "pointer" }}
        >
          Enabled
        </Typography>
      </Tooltip>
      <hr style={{ width: 50 }} />
      <ListItem
        style={{
          padding: 0,
          margin: "5px 0px 5px 0px",
          boxShadow: "1px 1px 1px 1px #777"
        }}
        data-direction={1}
        className="listItem"
      >
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={2}>
            <ArrowUpwardIcon></ArrowUpwardIcon>
          </Grid>
          <Grid item xs={10}>
            <ListItemText>Top</ListItemText>
          </Grid>
        </Grid>
      </ListItem>

      <ListItem
        style={{
          padding: 0,
          margin: "5px 0px 5px 0px",
          boxShadow: "1px 1px 1px 1px #777"
        }}
        data-direction={2}
      >
        <Grid
          direction="row"
          container
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={2}>
            <ArrowUpwardIcon></ArrowUpwardIcon>
          </Grid>
          <Grid item xs={10}>
            <ListItemText>Left</ListItemText>
          </Grid>
        </Grid>
      </ListItem>
      <ListItem
        style={{
          padding: 0,
          margin: "5px 0px 5px 0px",
          boxShadow: "1px 1px 1px 1px #777"
        }}
        data-direction={3}
      >
        <Grid
          direction="row"
          container
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={2}>
            <ArrowUpwardIcon></ArrowUpwardIcon>
          </Grid>
          <Grid item xs={10}>
            <ListItemText>Right</ListItemText>
          </Grid>
        </Grid>
      </ListItem>
      <ListItem
        style={{
          padding: 0,
          margin: "5px 0px 5px 0px",
          boxShadow: "1px 1px 1px 1px #777"
        }}
        data-direction={4}
      >
        <Grid
          direction="row"
          container
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={2}>
            <ArrowUpwardIcon></ArrowUpwardIcon>
          </Grid>
          <Grid item xs={10}>
            <ListItemText>Bottom</ListItemText>
          </Grid>
        </Grid>
      </ListItem>
    </List>
  );

  disabledDirections = (
    <List dense className={classes.root} id="disabledDirections">
      <Tooltip title="List of disabled directions that the algorithms may explore. Disabling only the default 4 results in manhattan traversal, while Disabling none results in fully diagonal movement. Other combinations will result in niche movement restrictions.">
        <Typography
          onClick={event => handleDirectionChange(event, "Disable")}
          style={{ cursor: "pointer" }}
        >
          Disabled
        </Typography>
      </Tooltip>
      <hr style={{ width: 50 }} />
      <ListItem
        style={{
          padding: 0,
          margin: "5px 0px 5px 0px",
          boxShadow: "1px 1px 1px 1px #777"
        }}
        data-direction={5}
      >
        <Grid
          direction="row"
          container
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={2}>
            <ArrowUpwardIcon></ArrowUpwardIcon>
          </Grid>
          <Grid item xs={10}>
            <ListItemText>Top Left</ListItemText>
          </Grid>
        </Grid>
      </ListItem>
      <ListItem
        style={{
          padding: 0,
          margin: "5px 0px 5px 0px",
          boxShadow: "1px 1px 1px 1px #777"
        }}
        data-direction={6}
      >
        <Grid
          direction="row"
          container
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={2}>
            <ArrowUpwardIcon></ArrowUpwardIcon>
          </Grid>
          <Grid item xs={10}>
            <ListItemText>Top Right</ListItemText>
          </Grid>
        </Grid>
      </ListItem>
      <ListItem
        style={{
          padding: 0,
          margin: "5px 0px 5px 0px",
          boxShadow: "1px 1px 1px 1px #777"
        }}
        data-direction={7}
      >
        <Grid
          direction="row"
          container
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={2}>
            <ArrowUpwardIcon></ArrowUpwardIcon>
          </Grid>
          <Grid item xs={10}>
            <ListItemText>Bottom Left</ListItemText>
          </Grid>
        </Grid>
      </ListItem>
      <ListItem
        style={{
          padding: 0,
          margin: "5px 0px 5px 0px",
          boxShadow: "1px 1px 1px 1px #777"
        }}
        data-direction={8}
      >
        <Grid
          direction="row"
          container
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={2}>
            <ArrowUpwardIcon></ArrowUpwardIcon>
          </Grid>
          <Grid item xs={10}>
            <ListItemText>Bottom Right</ListItemText>
          </Grid>
        </Grid>
      </ListItem>
    </List>
  );
  defaultEnabledDirections = window.defaultEnabledDirections = enabledDirections;
  defaultDisabledDirections = disabledDirections;
  return (
    <Grid
      direction="row"
      container
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={5}>
        {enabledDirections}
      </Grid>
      <Grid item xs={2} style={{ margin: "-8px" }}></Grid>
      <Grid item xs={5}>
        {disabledDirections}
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={4}>
          <Button
            color="inherit"
            onClick={event => handleDirectionChange(event, "Manhattan")}
          >
            Manhattan
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            color="inherit"
            onClick={event => handleDirectionChange(event, "Chebyshev")}
          >
            Chebyshev
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            color="inherit"
            onClick={event => handleDirectionChange(event, "Reset")}
          >
            Reset
          </Button>
        </Grid>
      </Grid>

      {
        (requestAnimationFrame(() => {
          enabledDirections = Sortable.create(
            document.getElementById("enabledDirections"),
            {
              group: "directions",
              sort: true,
              animation: 150,
              ghostClass: "blue-background-class",
              onEnd: event => {
                setDirections(endDrag(event));
              }
            }
          );
          disabledDirections = Sortable.create(
            document.getElementById("disabledDirections"),
            {
              group: "directions",
              sort: true,
              animation: 150,
              ghostClass: "blue-background-class",
              onEnd: event => {
                setDirections(endDrag(event));
              }
            }
          );
        }),
        null)
      }
    </Grid>
  );
}

const handleDirectionChange = (event, action) => {
  switch (action.toLowerCase()) {
    case "reset":
      store.directionOrder.replace([1, 2, 3, 4]);
      defaultEnabledItems();
      break;
    case "enable":
      store.directionOrder.replace([1, 2, 3, 4, 5, 6, 7, 8]);
      setAllItems("enabled");
      break;
    case "disable":
      store.directionOrder.replace([1, 2, 3, 4, 5, 6, 7, 8]);
      setAllItems("disabled");
      break;
    case "manhattan":
      store.directionOrder.replace([1, 2, 3, 4, 5, 6, 7, 8]);
      defaultEnabledItems();
      break;
    case "chebyshev":
      store.directionOrder.replace([1, 2, 3, 4, 5, 6, 7, 8]);
      setAllItems("enabled");
      break;
    case "default":
      console.log("No action associated with this list handler input.");
      break;
  }
};

const defaultEnabledItems = () => {
  let enabled = document.getElementById("enabledDirections");
  let disabled = document.getElementById("disabledDirections");
  for (let i = 1; i < 5; i++) {
    let element = document.querySelector(`[data-direction~="${i}"]`);
    enabled.appendChild(element);
  }
  for (let i = 5; i < 9; i++) {
    let element = document.querySelector(`[data-direction~="${i}"]`);
    disabled.appendChild(element);
  }
};

const setAllItems = toggleOn => {
  let toggleList =
    toggleOn === "enabled"
      ? document.getElementById("enabledDirections")
      : toggleOn === "disabled"
      ? document.getElementById("disabledDirections")
      : "";
  for (let i = 1; i < 9; i++) {
    let element = document.querySelector(`[data-direction~="${i}"]`);
    toggleList.appendChild(element);
  }
};

const endDrag = event => {
  var newDirections = [];
  var enabledDirections = document.getElementById("enabledDirections");
  window.item = event.item;
  for (let i = 2; i < enabledDirections.children.length; i++) {
    let direction = enabledDirections.children[i];
    newDirections[i - 2] = parseInt(direction.dataset.direction);
  }
  store.directionOrder.replace(newDirections);
  return newDirections;
};
