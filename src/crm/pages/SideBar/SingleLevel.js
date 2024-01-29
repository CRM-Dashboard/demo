import React from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText, ListItemIcon } from "@mui/material";
// import AbcOutlined from '@mui/icons-material/AbcOutlined';
import MuiListButton from "@mui/material/ListItemButton";
import { styled } from "@mui/material/styles";

function SingleLevel({ item }) {
  const ListItemButton = styled(MuiListButton, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme }) => ({
    borderRadius: "4px",
    justifyContent: "end",
    padding: "4px 8px",
    "&.Mui-selected": {
      backgroundColor: theme.palette.other.menuSelected.dark,
      borderRadius: "4px",
    },
  }));

  return (
    <ListItem>
      <ListItemButton>
        {item.icon && (
          <ListItemIcon>
            <item.icon sx={{ fontSize: 25 }} />
          </ListItemIcon>
        )}
        <ListItemText
          primaryTypographyProps={{
            style: { whiteSpace: "normal", overflow: "hidden" },
          }}
          primary={item.name}
        />
      </ListItemButton>
    </ListItem>
  );
}

SingleLevel.propTypes = {
  item: PropTypes.object,
};

export default SingleLevel;
