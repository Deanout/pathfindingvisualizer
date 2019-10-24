import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import SimpleSelect from "./SimpleSelect";

const PfvToolbar = styled(Toolbar)({
  background: "linear-gradient(45deg, #2c3e50 30%, #3498db 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  padding: "0 30px",
  flexGrow: 1
});

const PfvBrand = styled(Typography)({
  marginTop: "auto",
  marginBottom: "auto",
  marginRight: "1em"
});

const PfvButton = styled(Button)({
  width: 140,
  margin: "auto",
  background: "#3EC3FF"
});

const PfvConfigButton = styled(Button)({
  width: 140,
  marginTop: "auto",
  marginBottom: "auto",
  marginRight: "1em"
});

export default class ToolBar extends Component {
  constructor(props) {
    super();
    this.state = {
      pfv: props.pfv,
      console: props.console
    };
  }
  render() {
    return (
      <div>
        <AppBar position="static">
          <PfvToolbar>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <PfvBrand variant="h6">Pathfinding Visualizer</PfvBrand>
              </Grid>
              <Grid item xs={6}>
                <SimpleSelect>Algorithms</SimpleSelect>
              </Grid>
              <Grid item xs={6}>
                <PfvButton
                  color="inherit"
                  onClick={() => this.state.pfv.visualizeDijkstra()}
                >
                  Visualize Algo
                </PfvButton>
              </Grid>
              <Grid item xs={6}>
                <PfvConfigButton
                  color="inherit"
                  onClick={() => this.state.pfv.recursiveWalls()}
                >
                  Make Maze
                </PfvConfigButton>
              </Grid>
              <Grid item xs={6}>
                <PfvConfigButton
                  color="inherit"
                  onClick={() => this.state.pfv.init(true)}
                >
                  Clear Board
                </PfvConfigButton>
              </Grid>
            </Grid>
          </PfvToolbar>
        </AppBar>
        {this.state.console}
      </div>
    );
  }
}
