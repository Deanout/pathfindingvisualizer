import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import AlgorithmSelect from "./algorithmselect.jsx";
import TerrainSelect from "./terrainselect.jsx";
import ConfigPanel from "./configpanel/configpanel.jsx";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { observer } from "mobx-react";

const theme = {
  spacing: 8
};

const PfvToolbar = styled(Toolbar)({
  background: "#194B4B",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white"
});

const PfvBrand = styled(Typography)({
  margin: theme.spacing,
  fontSize: 20,
  fontFamily: ["Open Sans", "sans-serif"],
  textTransform: "capitalize",
  "& a": {
    textDecoration: "none",
    color: "inherit"
  },
  "& a:hover": {
    color: "#ddd"
  }
});

const PfvVisualizeAlgorithmButton = styled(Button)({
  margin: theme.spacing,
  height: 32,
  width: 140,
  fontSize: 15,
  fontFamily: ["Open Sans", "sans-serif"],
  textTransform: "capitalize",
  background: "#3EC3FF",
  "& span": {
    height: 0
  }
});

const PfvConfigButton = styled(Button)({
  margin: theme.spacing,
  height: 32,
  width: 140,
  fontSize: 15,
  fontFamily: ["Open Sans", "sans-serif"],
  textTransform: "capitalize",
  background: "#0C1824",
  "& span": {
    height: 0
  }
});

const PfvStartNodeButton = styled(IconButton)({
  margin: theme.spacing,
  height: 32,
  width: 32,
  fontSize: 12,
  fontFamily: ["Open Sans", "sans-serif"],
  textTransform: "capitalize",
  color: "white",
  background: "#009605"
});
const PfvFinishNodeButton = styled(IconButton)({
  margin: theme.spacing,
  height: 32,
  width: 32,
  fontSize: 12,
  fontFamily: ["Open Sans", "sans-serif"],
  textTransform: "capitalize",
  color: "#fff",
  background: "#0C1824"
});
const PfvWallNodeButton = styled(IconButton)({
  margin: theme.spacing,
  height: 32,
  width: 32,
  fontSize: 12,
  fontFamily: ["Open Sans", "sans-serif"],
  textTransform: "capitalize",
  color: "white",
  background: "#0c3547"
});
@observer
export default class ToolBar extends Component {
  constructor(props) {
    super();
    this.state = {
      pfv: props.pfv,
      console: props.console
    };
    this.algorithmHandler = this.algorithmHandler.bind(this);
    this.terrainHandler = this.terrainHandler.bind(this);
  }

  algorithmHandler(algorithm) {
    store.algorithm = algorithm;
  }

  terrainHandler(terrain) {
    store.terrain = terrain;
  }

  toggleConfigPanel() {
    store.configPanel.toggle = !store.configPanel.toggle;
  }

  render() {
    const { pfv } = this.state;
    const algorithmSelect = (
      <AlgorithmSelect
        algorithmHandler={this.algorithmHandler}
        visualizeClicked={store.algorithm}
      ></AlgorithmSelect>
    );
    const terrainSelect = (
      <TerrainSelect
        terrainHandler={this.terrainHandler}
        makeTerrainClicked={store.terrain}
      ></TerrainSelect>
    );

    var configPanel = (
      <ConfigPanel
        algorithm={this.state.algorithm}
        toggleClicked={store.configPanel.toggle}
        pfv={pfv}
      ></ConfigPanel>
    );
    return (
      <div>
        {configPanel}

        <div onMouseEnter={() => (pfv.state.mouseIsPressed = false)}>
          <AppBar position="static">
            <PfvToolbar>
              <Grid container spacing={1}>
                <Grid item xs={6} sm={3} md={3}>
                  <PfvBrand variant="h6" m="auto">
                    <a href="/">Pathfinding Visualizer</a>
                  </PfvBrand>
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  {algorithmSelect}
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  <PfvVisualizeAlgorithmButton
                    color="inherit"
                    onClick={() => {
                      pfv.visualizeAlgorithm(store.algorithm);
                      store.algorithm === 0 ? (store.algorithm = 1) : "";
                    }}
                  >
                    Visualize
                  </PfvVisualizeAlgorithmButton>
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  {terrainSelect}
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  <PfvVisualizeAlgorithmButton
                    color="inherit"
                    onClick={() => {
                      pfv.generateTerrain(store.terrain);
                      store.terrain === 0 ? (store.terrain = 1) : "";
                    }}
                  >
                    Make Terrain
                  </PfvVisualizeAlgorithmButton>
                </Grid>

                <Grid item xs={6} sm={3} md={2}>
                  <PfvConfigButton
                    color="inherit"
                    onClick={() => pfv.init(true)}
                  >
                    Clear Board
                  </PfvConfigButton>
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  <PfvConfigButton
                    color="inherit"
                    onClick={this.toggleConfigPanel}
                  >
                    Configure Noise
                  </PfvConfigButton>
                </Grid>
                <Grid item xs={2} sm={1}>
                  <PfvStartNodeButton
                    size="small"
                    onClick={() => (store.nodeType = "start")}
                  >
                    Start
                  </PfvStartNodeButton>
                </Grid>

                <Grid item xs={2} sm={1}>
                  <PfvFinishNodeButton
                    size="small"
                    onClick={() => (store.nodeType = "finish")}
                  >
                    End
                  </PfvFinishNodeButton>
                </Grid>
                <Grid item xs={2} sm={1}>
                  <PfvWallNodeButton
                    size="small"
                    onClick={() => (store.nodeType = "wall")}
                  >
                    Wall
                  </PfvWallNodeButton>
                </Grid>
              </Grid>
            </PfvToolbar>
          </AppBar>
          {this.state.console}
        </div>
      </div>
    );
  }
}
