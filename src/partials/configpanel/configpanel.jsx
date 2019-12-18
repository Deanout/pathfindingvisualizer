import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Header from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import MinimizeIcon from "@material-ui/icons/Minimize";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { styled } from "@material-ui/core/styles";
import { observer } from "mobx-react";
import NoiseConfig from "./noiseconfig.jsx";
import AlgorithmConfig from "./algorithmconfig.jsx";
import store from "../../store/gridstore.js";
import { classes } from "istanbul-lib-coverage";
import ConfigToggleButtons from "./configtogglebuttons.jsx";
import GridConfig from "./gridconfig.jsx";
import NodeConfig from "./nodeconfig.jsx";

const PanelCard = styled(Card)({
  maxHeight: 400,
  maxWidth: "100%",
  width: 350,
  fontSize: 12,
  fontFamily: ["Open Sans", "sans-serif"],
  textTransform: "capitalize",
  color: "white",
  background: "#0c3547"
});

const PanelHeader = styled(Header)({
  zIndex: 10000,
  cursor: "move",
  backgroundColor: "#194B4B",
  color: "#fff",
  height: 32,
  padding: 0,
  fontSize: 10,
  width: 350,
  "& span": {
    fontSize: 15
  },
  "& button": {
    "& svg": {
      color: "#FFF"
    }
  }
});

@observer
export default class ConfigPanel extends Component {
  constructor(props) {
    super();
    this.state = {
      pfv: props.pfv,
      nodes: store.nodeTypes.list
    };
    this.nodeConfigHandler = this.nodeConfigHandler.bind(this);
  }

  nodeConfigHandler(nodeID, weight) {
    store.nodeTypes.list[nodeID].weight = weight;
    this.setState({ nodes: store.nodeTypes.list });
  }

  handleMinimizeClick(input) {
    if (store.configPanel.minimize != input) {
      store.configPanel.minimize = input;
    }
  }

  setDraggable(source) {
    document.getElementById("info-panel-header")
      ? this.dragElement(document.getElementById("info-panel"), source)
      : "";
  }

  render() {
    requestAnimationFrame(() => {
      this.setDraggable("mouse");
      this.setDraggable("touch");
    });

    var configToggleButtons = <ConfigToggleButtons></ConfigToggleButtons>;
    return (
      <Collapse in={store.configPanel.toggle} timeout="auto" unmountOnExit>
        <div
          id="info-panel"
          style={{
            top: store.consoleBottom,
            position: "absolute",
            left: 0,
            zIndex: 100000,
            maxWidth: "100%"
          }}
        >
          <PanelCard>
            <PanelHeader
              id="info-panel-header"
              draggable="true"
              onMouseOver={() => this.setDraggable("mouse")}
              onTouchMove={() => this.setDraggable("touch")}
              style={{ width: 350 }}
              action={
                <div>
                  <IconButton
                    aria-label="minimize"
                    onClick={() => {
                      this.handleMinimizeClick(!store.configPanel.minimize);
                    }}
                  >
                    {store.configPanel.minimize ? (
                      <MinimizeIcon />
                    ) : (
                      <AddIcon />
                    )}
                  </IconButton>
                  <IconButton
                    aria-label="exit"
                    onClick={() => {
                      this.props.configPanelHandler();
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              }
              title="Simplex Terrain Settings"
            ></PanelHeader>
            {configToggleButtons}
            {this.switchConfig()}
          </PanelCard>
        </div>
      </Collapse>
    );
  }
  switchConfig() {
    var noiseFields = [
      store.simplex.threshold.value,
      store.simplex.seed.value,
      store.simplex.scale.value,
      store.simplex.octave.value,
      store.simplex.persistence.value,
      store.simplex.lacunarity.value
    ];

    var algorithmConfig = (
      <AlgorithmConfig
        minimize={store.configPanel.minimize}
        animSpeed={store.currentAnimationSpeed}
        pfv={this.state.pfv}
      ></AlgorithmConfig>
    );
    var noiseConfig = (
      <NoiseConfig
        noiseWallsRedrawRequestHandler={this.noiseWallsRedrawRequestHandler}
        minimize={store.configPanel.minimize}
        fields={noiseFields}
        gridWidth={store.gridWidth}
        gridHeight={store.gridHeight}
        pfv={this.state.pfv}
      ></NoiseConfig>
    );
    var gridConfig = (
      <GridConfig
        minimize={store.configPanel.minimize}
        pfv={this.state.pfv}
      ></GridConfig>
    );
    var nodeConfig = (
      <NodeConfig
        pfv={this.state.pfv}
        nodes={this.state.nodes}
        minimize={store.configPanel.minimize}
        nodeConfigHandler={this.nodeConfigHandler}
      ></NodeConfig>
    );
    switch (store.configPanel.menuOption) {
      case "Algorithm":
        return algorithmConfig;
        return;
      case "Terrain":
        return noiseConfig;
      case "Nodes":
        return nodeConfig;
      case "Grid":
        return gridConfig;
      case "Other":
        return;
      default:
        return;
    }
  }

  dragElement(element, source) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById("info-panel-header")) {
      if (source == "touch") {
        // if present, the header is where you move the DIV from:
        document.getElementById(
          "info-panel-header"
        ).ontouchstart = dragMouseDown;
      } else {
        document.getElementById(
          "info-panel-header"
        ).onmousedown = dragMouseDown;
      }
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      if (source == "touch") {
        element.ontouchstart = dragMouseDown;
      } else {
        element.onmousedown = dragMouseDown;
      }
    }

    function dragMouseDown(e) {
      if (source == "touch") {
        if (e.touches.length == 1) {
          // Only deal with one finger
          pos3 = e.touches[0].clientX;
          pos4 = e.touches[0].clientY;
        }
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDrag;
      } else {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }
    }

    function elementDrag(e) {
      // calculate the new cursor position:
      if (source == "touch") {
        if (e.touches.length == 1) {
          pos1 = pos3 - e.touches[0].clientX;
          pos2 = pos4 - e.touches[0].clientY;
          pos3 = e.touches[0].clientX;
          pos4 = e.touches[0].clientY;
        }
      } else {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
      }
      // Clamp element's new position:
      let newTop = Math.clamp(
        element.offsetTop - pos2,
        0,
        document.body.offsetHeight - 32
      );
      let newLeft = Math.clamp(
        element.offsetLeft - pos1,
        0,
        document.body.clientWidth - 350
      );
      // set the element's new position:
      element.style.top = newTop + "px";
      element.style.left = newLeft + "px";
    }

    function closeDragElement() {
      if (source == "touch") {
        document.ontouchend = null;
        document.ontouchmove = null;
      } else {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  }
}
