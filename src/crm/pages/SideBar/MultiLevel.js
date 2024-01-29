import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@mui/material";
import MuiListButton from "@mui/material/ListItemButton";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { styled } from "@mui/styles";
import hasChildren from "./hasChildren";
import ChildMenuItems from "./ChildMenuItems.js";

function MultiLevel(props) {
  const { children } = props.item;
  const [open, setOpen] = useState(!props.item.collapsed);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  // const ListItemButton = styled(MuiListButton, {
  //   shouldForwardProp: (prop) => prop !== "open",
  // })(({ theme }) => ({
  //   padding: "1px",
  //   "&.Mui-selected": props.item?.isSub
  //     ? {
  //         padding: "1px",
  //         backgroundColor: "transparent",
  //         borderLeft: `1px solid ${theme.palette.primary.main}`, // TO-DO : Theme for dark and light(have to add colour text too), Need to set data into redux and need to fetch here
  //       }
  //     : {
  //         backgroundColor: theme.palette.primary.main, // TO-DO : Theme for dark and light(have to add colour text too), Need to set data into redux and need to fetch here
  //         borderRadius: "4px",
  //         marginLeft: "1px",
  //       },
  // }));

  return (
    <>
      <ListItem
        sx={{
          float: "right",
          width: props.item?.isSub ? "95%" : "100%",
          overflow: "hidden",
        }}
        onClick={handleClick}
      >
        <MuiListButton selected={open}>
          {/* TODO: Uncomment this when icons are ready */}
          {props.item.icon && (
            <ListItemIcon>
              <props.item.icon sx={{ fontSize: 25 }} />
            </ListItemIcon>
          )}
          <ListItemText
            primaryTypographyProps={{ style: { whiteSpace: "normal" } }}
            primary={props.item.name}
          />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </MuiListButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children.map((child) =>
            !hasChildren(child) ? (
              <ChildMenuItems
                item={child}
                to={props.item.to}
                key={child.name}
                isSub={props.item?.isSub}
              />
            ) : (
              <MultiLevel item={child} key={props.item.to} />
            )
          )}
        </List>
      </Collapse>
    </>
  );
}

MultiLevel.propTypes = {
  item: PropTypes.object,
};

export default MultiLevel;
