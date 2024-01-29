import React from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText } from "@mui/material";
import MuiListButton from "@mui/material/ListItemButton";
import { useNavigate, useLocation } from "react-router-dom";
// import { useTheme, styled } from "@mui/styles";

function ChildMenuItems(props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ListItem
      style={{
        overflow: "hidden",
      }}
      key={props.item.name}
    >
      <MuiListButton
        onClick={() => {
          navigate(`/crm${props.to}`);
        }}
        selected={location.pathname.includes(props.to + props.item.url)}
      >
        <ListItemText
          primaryTypographyProps={{ style: { whiteSpace: "normal" } }}
          sx={{ fontSize: "14px" }}
          primary={props.item.name}
        />
      </MuiListButton>
    </ListItem>
  );
}

ChildMenuItems.propTypes = {
  isSub: PropTypes.bool,
  item: PropTypes.object,
  to: PropTypes.string,
};

export default ChildMenuItems;
