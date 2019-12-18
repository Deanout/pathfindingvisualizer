import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import TerrainSlider from "../terrainslider.jsx";

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

export default function GridConfig(props) {
  const classes = useStyles();
  {
  }
  var terrainSlider = (
    <TerrainSlider
      width={store.nodeWidth}
      height={store.nodeHeight}
      pfv={props.pfv}
    ></TerrainSlider>
  );
  return (
    <Collapse
      in={props.minimize}
      timeout="auto"
      unmountOnExit
      className={classes.collapse}
    >
      <CardContent className={classes.cardContent}>{terrainSlider}</CardContent>
    </Collapse>
  );
}
