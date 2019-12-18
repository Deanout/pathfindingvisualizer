import React from "react";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import store from "../../store/gridstore";

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
  },
  uiNode: {
    height: 20,
    width: 20
  }
}));

export default function NoiseConfig(props) {
  const [nodes, setNodes] = React.useState(props.nodes);
  const classes = useStyles();

  const handleChange = (event, newValue, nodeID) => {
    props.nodes[nodeID].weight = newValue;
    setNodes(props.nodes);
    props.nodeConfigHandler(nodeID, newValue);
  };
  const handleBlur = (event, newValue, nodeID) => {
    props.nodes[nodeID].weight = newValue;
    setNodes(props.nodes);
    props.nodeConfigHandler(nodeID, newValue);
  };

  const handleKeyDown = event => {};
  return (
    <Collapse
      in={props.minimize}
      timeout="auto"
      unmountOnExit
      className={classes.collapse}
    >
      <CardContent className={classes.cardContent}>
        <Typography>Node Weights</Typography>
        {props.nodes.map((node, nodeID) => {
          return node.weight === Infinity ? (
            ""
          ) : (
            <Grid container alignItems="center" key={nodeID}>
              <Grid item xs={1}>
                <div
                  className={classes.uiNode}
                  style={{
                    backgroundColor: `rgb(${node.rgb[0]}, ${node.rgb[1]}, ${node.rgb[2]})`,
                    border: "1px solid black"
                  }}
                ></div>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  justify="left"
                  variant="body2"
                  id="threshold-slider"
                  gutterBottom
                >
                  {node.name}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Slider
                  value={nodes[nodeID].weight}
                  onChange={(event, newValue) =>
                    handleChange(event, newValue, nodeID)
                  }
                  aria-labelledby="threshold-slider"
                  step={1}
                  min={0}
                  max={1000}
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  value={nodes[nodeID].weight}
                  margin="dense"
                  onChange={(event, newValue) =>
                    handleChange(event, newValue, nodeID)
                  }
                  onBlur={(event, newValue) =>
                    handleBlur(event, newValue, nodeID)
                  }
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 1000,
                    type: "number",
                    "aria-labelledby": "threshold-input"
                  }}
                />
              </Grid>
            </Grid>
          );
        })}
      </CardContent>
    </Collapse>
  );
}
