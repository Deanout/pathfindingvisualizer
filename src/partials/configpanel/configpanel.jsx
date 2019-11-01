import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Header from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import MinimizeIcon from "@material-ui/icons/Minimize";
import store from "../../pathfindingvisualizer/gridstore";
import { styled } from "@material-ui/core/styles";
import { observer } from "mobx-react";
import NoiseWallsConfig from "./noisewallsconfig.jsx";

const theme = {
  spacing: 8
};
const PanelCard = styled(Card)({
  height: 32,
  maxWidth: "100%",
  width: 350,
  fontSize: 12,
  zIndex: 9,
  fontFamily: ["Open Sans", "sans-serif"],
  textTransform: "capitalize",
  color: "white",
  background: "#0c3547"
});

const PanelHeader = styled(Header)({
  zIndex: 10,
  cursor: "move",
  backgroundColor: "#194B4B",
  color: "#fff",
  height: 32,
  padding: 0,
  fontSize: 10,
  "& span": {
    fontSize: 15
  },
  "& button": {
    "& svg": {
      color: "#FFF"
    }
  }
});

// const getInitialGrid = (startPosition, finishPosition) => {
@observer
export default class ConfigPanel extends Component {
  constructor(props) {
    super();
    this.state = {
      pfv: props.pfv
    };
    this.noiseWallsHandler = this.noiseWallsHandler.bind(this);
  }

  noiseWallsHandler() {}

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
    var noiseWallsConfig = (
      <NoiseWallsConfig
        noiseWallsHandler={this.noiseWallsHandler}
        minimize={store.configPanel.minimize}
        threshold={store.simplex.threshold}
        seed={store.simplex.seed}
        pfv={this.state.pfv}
      ></NoiseWallsConfig>
    );
    return (
      <Collapse in={store.configPanel.toggle} timeout="auto" unmountOnExit>
        <div
          id="info-panel"
          style={{
            top: store.consoleBottom,
            position: "absolute",
            left: 0,
            zIndex: 8,
            maxWidth: "100%"
          }}
        >
          <PanelCard>
            <PanelHeader
              id="info-panel-header"
              draggable="true"
              onMouseOver={() => this.setDraggable("mouse")}
              onTouchMove={() => this.setDraggable("touch")}
              action={
                <IconButton
                  aria-label="minimize"
                  onClick={() => {
                    this.handleMinimizeClick(!store.configPanel.minimize);
                  }}
                >
                  <MinimizeIcon />
                </IconButton>
              }
              title={store.getAlgorithmName()}
            ></PanelHeader>
            {noiseWallsConfig}
          </PanelCard>
        </div>
      </Collapse>
    );
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
          pos3 = e.touches[0].pageX;
          pos4 = e.touches[0].pageY;
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
          pos1 = pos3 - e.touches[0].pageX;
          pos2 = pos4 - e.touches[0].pageY;
          pos3 = e.touches[0].pageX;
          pos4 = e.touches[0].pageY;
        }
      } else {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
      }

      // set the element's new position:
      element.style.top = element.offsetTop - pos2 + "px";
      element.style.left = element.offsetLeft - pos1 + "px";
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
