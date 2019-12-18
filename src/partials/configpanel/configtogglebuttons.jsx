import React from "react";
import Grid from "@material-ui/core/Grid";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import store from "../../store/gridstore";

export default function ConfigToggleButtons() {
  const [alignment, setAlignment] = React.useState(
    store.configPanel.menuOption
  );

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    store.configPanel.menuOption = newAlignment;
  };

  const children = [
    <ToggleButton key={0} value="Algorithm" style={{ width: 90 }}>
      Algorithm
    </ToggleButton>,
    <ToggleButton key={1} value="Terrain" style={{ width: 80 }}>
      Terrain
    </ToggleButton>,
    <ToggleButton key={2} value="Nodes" style={{ width: 60 }}>
      Nodes
    </ToggleButton>,
    <ToggleButton key={3} value="Grid" style={{ width: 60 }}>
      Grid
    </ToggleButton>,
    <ToggleButton key={4} value="Other" style={{ width: 60 }}>
      Other
    </ToggleButton>
  ];

  return (
    <Grid container>
      <Grid item style={{ width: 350 }}>
        <ToggleButtonGroup
          size="small"
          value={alignment}
          exclusive
          onChange={handleChange}
        >
          {children}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
}
