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

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    minHeight: 128
  }
}));
export default function DirectionConfig() {
  const classes = useStyles();
  const [directions, setDirections] = React.useState([1, 2, 3, 4]);
  var enabledDirections;
  var disabledDirections;
  return (
    <Grid
      direction="row"
      container
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={5}>
        <List dense className={classes.root} id="enabledDirections">
          <Tooltip title="List of enabled directions that the algorithms may explore. Enabling only the default 4 results in manhattan traversal, while enabling all eight results in fully diagonal movement. Other combinations will result in niche movement restrictions.">
            <Typography>Enabled</Typography>
          </Tooltip>
          <hr style={{ width: 50 }} />
          <ListItem style={{ padding: 0 }} data-direction={1}>
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

          <ListItem style={{ padding: 0 }} data-direction={2}>
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
          <ListItem style={{ padding: 0 }} data-direction={3}>
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
          <ListItem style={{ padding: 0 }} data-direction={4}>
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
      </Grid>
      <Grid item xs={2}></Grid>
      <Grid item xs={5}>
        <List dense className={classes.root} id="disabledDirections">
          <Tooltip title="List of disabled directions that the algorithms may explore. Disabling only the default 4 results in manhattan traversal, while Disabling none results in fully diagonal movement. Other combinations will result in niche movement restrictions.">
            <Typography>Disabled</Typography>
          </Tooltip>
          <hr style={{ width: 50 }} />
          <ListItem style={{ padding: 0 }} data-direction={5}>
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
          <ListItem style={{ padding: 0 }} data-direction={6}>
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
          <ListItem style={{ padding: 0 }} data-direction={7}>
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
          <ListItem style={{ padding: 0 }} data-direction={8}>
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
      </Grid>

      {
        (requestAnimationFrame(() => {
          enabledDirections = Sortable.create(
            document.getElementById("enabledDirections"),
            {
              group: "directions",
              sort: true,
              animation: 100,
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
              animation: 100,
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

const endDrag = event => {
  var newDirections = [];
  for (let i = 2; i < enabledDirections.children.length; i++) {
    let direction = enabledDirections.children[i];
    newDirections[i - 2] = parseInt(direction.dataset.direction);
  }
  store.directionOrder.replace(newDirections);
  return newDirections;
};
