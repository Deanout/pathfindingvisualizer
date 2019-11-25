import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import AlgorithmSelect from "./algorithmselect.jsx";
import TerrainSelect from "./terrainselect.jsx";
import ClearBoardSelect from "./clearboardselect.jsx";
import NodeTypeSelect from "./nodetypeselect.jsx";
import ConfigPanel from "./configpanel/configpanel.jsx";
import TerrainSlider from "./terrainslider.jsx";
import { observer } from "mobx-react";
import store from "../store/gridstore.js";

const theme = {
  spacing: 8
};

const PfvToolbar = styled(Toolbar)({
  background: "#194B4B",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  zIndex: 9999
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
    this.configPanelHandler = this.configPanelHandler.bind(this);
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  algorithmHandler(algorithm) {
    store.algorithm = algorithm;
  }

  terrainHandler(terrain) {
    store.terrain = terrain;
  }

  toggleConfigPanel() {
    store.configPanel.toggle = !store.configPanel.toggle;
    store.configPanel.minimize = store.configPanel.toggle;
  }
  configPanelHandler() {
    this.toggleConfigPanel();
  }

  render() {
    const { pfv } = this.state;
    const algorithmSelect = (
      <AlgorithmSelect
        algorithms={store.algorithms}
        algorithmHandler={this.algorithmHandler}
        algorithm={store.algorithm}
        pfv={this.state.pfv}
      ></AlgorithmSelect>
    );
    const terrainSelect = (
      <TerrainSelect
        terrains={store.terrains}
        terrainHandler={this.terrainHandler}
        terrain={store.terrain}
        pfv={this.state.pfv}
      ></TerrainSelect>
    );
    var clearBoardSelect = (
      <ClearBoardSelect pfv={this.state.pfv}></ClearBoardSelect>
    );
    var configPanel = (
      <ConfigPanel
        algorithm={this.state.algorithm}
        toggleClicked={store.configPanel.toggle}
        pfv={pfv}
        configPanelHandler={this.configPanelHandler}
      ></ConfigPanel>
    );

    var nodeTypeSelect = (
      <NodeTypeSelect
        nodeTypes={store.nodeTypes.list}
        clickNodeType={store.clickNodeType}
        clickNodeIndex={store.clickNodeIndex}
      ></NodeTypeSelect>
    );

    var terrainSlider = (
      <TerrainSlider
        width={store.nodeWidth}
        height={store.nodeHeight}
        pfv={this.state.pfv}
      ></TerrainSlider>
    );
    return (
      <div>
        {configPanel}

        <div>
          <AppBar position="fixed" id="AppBar">
            <PfvToolbar>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={5} md={3} lg={3} xl={2}>
                  <PfvBrand variant="h6" m="auto">
                    <a href="/">Pathfinding Visualizer</a>
                  </PfvBrand>
                </Grid>
                <Grid item xs={6} sm={3} md={2} lg={2} xl={1}>
                  {algorithmSelect}
                </Grid>

                <Grid item xs={6} sm={3} md={2} lg={2} xl={1}>
                  {terrainSelect}
                </Grid>

                <Grid item xs={6} sm={3} md={2} lg={2} xl={1}>
                  {clearBoardSelect}
                </Grid>
                <Grid item xs={6} sm={3} md={2} lg={2} xl={1}>
                  {nodeTypeSelect}
                </Grid>
                <Grid item xs={6} sm={3} md={2} lg={2} xl={1}>
                  <PfvConfigButton
                    color="inherit"
                    onClick={this.toggleConfigPanel}
                  >
                    Terrain Settings
                  </PfvConfigButton>
                </Grid>

                <Grid item xs={6} sm={3} md={2} lg={2} xl={1}>
                  {terrainSlider}
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
