import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Typography from "@material-ui/core/Typography";
import store from "../store/gridstore";

const useStyles = makeStyles(theme => ({
  nodeButtonGroup: {
    height: 32,
    maxWidth: 140,
    margin: theme.spacing(1),
    borderRadius: 4,
    border: "1px solid #ced4da",
    background: "#3EC3FF",
    color: "#FFF",
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    "& span": {
      height: 0
    }
  },
  nodeLabel: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    textTransform: "capitalize",
    fontSize: 15
  },
  nodeButton: {
    background: "#194B4B",
    "&:hover": {
      background: "#194B4B"
    }
  },
  nodeButtonArrow: {
    background: "#194B4B",
    color: "#000",
    "&:hover": {
      background: "#194B4B",
      color: "#000"
    }
  }
}));

export default function NodeTypeSelect(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(
    props.clickNodeIndex
  );

  const handleClick = () => {};

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    store.clickNodeType = props.nodeTypes[index];
    store.clickNodeIndex = index;
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ margin: "auto" }}
    >
      <Grid item xs={12}>
        <ButtonGroup
          variant="contained"
          color="inherit"
          ref={anchorRef}
          aria-label="split button"
          className={classes.nodeButtonGroup}
        >
          <Button onClick={handleClick} className={classes.nodeButton}>
            <Typography className={classes.nodeLabel}>
              {props.nodeTypes[props.clickNodeIndex].name}
            </Typography>
          </Button>
          <Button
            size="small"
            aria-owns={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            className={classes.nodeButtonArrow}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper id="menu-list-grow">
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList style={{ zIndex: 420 }}>
                    {props.nodeTypes.map((option, index) => (
                      <MenuItem
                        key={option.name}
                        selected={index === props.clickNodeIndex}
                        onClick={event => handleMenuItemClick(event, index)}
                      >
                        <Typography className={classes.nodeLabel}>
                          {option.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
}