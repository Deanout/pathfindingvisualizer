import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { styled } from "@material-ui/core/styles";

const PfvToolbar = styled(Toolbar)({
  background: "linear-gradient(45deg, #2c3e50 30%, #3498db 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 48,
  padding: "0 30px"
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
      pfv: props.pfv
    };
  }
  render() {
    return (
      <div>
        <AppBar position="static">
          <PfvToolbar>
            <PfvBrand variant="h6">Pathfinding Visualizer</PfvBrand>
            <PfvButton
              color="inherit"
              onClick={() => this.state.pfv.visualizeDijkstra()}
            >
              Visualize Algo
            </PfvButton>
            <PfvConfigButton
              color="inherit"
              onClick={() => this.state.pfv.init(true)}
            >
              Clear Board
            </PfvConfigButton>
          </PfvToolbar>
        </AppBar>
      </div>
    );
  }
}
